const db = require("../config/db");
const { send, err } = require("../utils/help");
const { exist } = require("../utils/query");
const { fn, statusCase} = require("../utils/query");
const PDFDocument = require("pdfkit");

// แสดงผลลัพธ์การประเมิน แต่ละตัวชี้วัด ในรูปแบบของตาราง และสรุปภาพรวมของผู้รับการประเมินรายบุคคล
exports.getSummryTableEvaluatee = async (req, res) => {
  try {
    const {assign_id} = req.params
    const uid = req.user.id

    const row = await db('assignments as a')
      .join('users as u', 'a.evaluatee_id', 'u.id')
      .join('users as ut', 'a.evaluator_id', 'ut.id')
      .join('indicators as i', 'i.eval_id', 'a.eval_id')
      .leftJoin('assessments as self', q => {
          q.on('self.assign_id', 'a.id')
            .andOn('self.indic_id', 'i.id')
            .andOnVal('self.role', 'self')
      })
      .leftJoin('assessments as com', q => {
          q.on('com.assign_id', 'a.id')
            .andOn('com.indic_id', 'i.id')
            .andOnVal('com.role', 'committee')
      })
      .where('a.id', assign_id)
      .select(
        'i.id',
        'i.name',
        'u.id as evaluatee_id',
        fn('u', 'evaluatee_name'),
        'ut.id as evaluator_id',
        fn('ut', 'evaluator_name'),
        'self.score as self_score',
        'self.bool_score as self_bool',
        'com.score as com_score',
        'com.bool_score as com_bool',
      )

    send(res, row)

  } catch (e) {
    err(res, e);
  }
};

// แสดงผลสรุปการประเมินรายกรรมการ
exports.SummaryEvaluator = async (req, res) => {
  try {
      const {eval_id} = req.params

      const {total} = await db('indicators').where({eval_id}).count('* as total').first()

      const row = await db('assignments as a')
        .join('users as u', 'a.evaluator_id', 'u.id')
        .join('indicatos as i', 'a.eval_id', 'i.id')
        .leftJoin('assessments as asm', q => {
          q.on('asm.assing_id', 'i.id')
            .andOn('asm.indic_id', 'i.id')
            .andOnVal('asm.role', 'committee')
        })
        .where('a.eval_id', eval_id)
        .groupBy('u.id')
        .countDistinct('a.id as  assigned')
        .select(
          'u.id as evaluator_id', fn('u', 'evaluator_id'),
          db.raw(`
            COUNT(DISTINCT CASE
                WHEN asm.status AND asm.assign_id IN(
                  SELECT assign_id FROM assessments WHERE role = 'committee' GROUP BY assign_id HAVING COUNT(indic_id) = ?
                ) THEN a.id END
            ) AS completed
          `, [total])
      )

    const data = row.map((r) => {
      let status = 'กำลังดำเนินการ'
      if(r.completed > 0|| r.completed < r.assigned ) status
      if(r.completed === r.assigned) status = 'เสร็จสิ้น'
      return {...r  , status}
    })

    send(res, data)
  } catch (e) {
    err(res, e);
  }
};

// รายละเอียด รายบุคคล แสดงผลสรุปการประเมินรายกรรมการ
exports.getDetailSummaryEvaluator = async(req, res) => {
    try {
        const {eval_id , evaluator_id} = req.params

        const row = await db('assignments as a')
          .join('users as u', 'a.evaluatee_id', 'u.id')
          .join('indicators as i', 'a.eval_id', 'i.eval_id')
          .leftJoin('assessments as asm', q => {
            q.on('asm.assign_id', 'a.id')
              .andOn('asm.indic_id', 'i.id')
              .andOnVal('asm.role', 'committee')
          })
          .leftJoin('levels as l', 'l.id', 'asm.score')
          .where({'a.eval_id': eval_id , 'a.evaluator_id': evaluator_id})
          .groupBy('a.id')
          .select(
            'u.id as evaluatee_id',
            fn('u', 'evaluatee_name'),
            statusCase('asm.id', 'asm.status', 'i.id'),
            db.raw(`
              SUM(
                CASE
                  WHEN i.type = 'score' THEN i.weight
                  WHEN i.type = 'boolean' AND asm.bool_score = 'มี' THEN  l.level * i.weight
                  ELSE 0 END
              )  AS total_score
              
            `)
          )

        send(res , row)
    }catch(e) {
        err(res, e)
    }
}

// สามารถ Export ออกมาเป็นไฟล์ PDF ได้
exports.ExportPDF = async (req, res) => {
  try {
    const { eval_id } = req.params;
    const user_id = req.user.id

    const ev = await exist(res, 'evaluations', {id: eval_id})
    const ee = await db("users").where({ id: user_id }).first();
    const assign = await exist(res, 'assignments', {eval_id, evaluatee_id: user_id})

    const fmt = await db("indicators as i")
      .leftJoin("assessments as s", q => {
        q.on("s.indic_id", "i.id")
          .andOn("s.assign_id", "=", assign.id)
          .andOnVal("s.role", "=", "self");
      })
      .leftJoin("assessments as c", q => {
        q.on("c.indic_id", "i.id")
          .andOn("c.assign_id", "=", assign.id)
          .andOnVal("c.role", "=", "committee");
      })
      .where("i.eval_id", eval_id)
      .select("i.name as title", "i.weight","s.score as self_score","c.score as committee_score");

    const cr = await db("signatures").where({ assign_id: assign.id }).first();
    const cm = await db("users").where({ id: assign.evaluator_id }).first();

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition","attachment; filename=evaluation-report.pdf");

    doc.font('font/Kanit-Bold.ttf')
    doc.pipe(res);
    doc
      .fontSize(16)
      .text("รายงานสรุปผลการประเมิน", { align: "center" })
      .moveDown(2);

    doc
      .fontSize(12)
      .text(`ชื่อผู้รับการประเมิน : ${ee.fname} ${ee.lname}`)
      .text(`รอบการประเมิน : ${ev.title}`)
      .text(`ช่วงเวลา : ${ev.start_date} ถึง ${ev.end_date}`)
      .moveDown();

    const startY = doc.y + 10;
    const cols = [50, 260, 360, 460];
    const rowH = 25;

    ["ตัวชี้วัด", "น้ำหนัก", "คะแนนตนเอง", "คะแนนกรรมการ"].forEach((h, i) => doc.text(h, cols[i], startY));

    doc.moveTo(50, startY + 20).lineTo(550, startY + 20).stroke();

    let y = startY + 25;
    fmt.forEach(r => {
      doc
        .text(r.title, cols[0], y)
        .text(r.weight.toString(), cols[1], y)
        .text(r.self_score ?? "-", cols[2], y)
        .text(r.committee_score ?? "-", cols[3], y);
      y += rowH;
    });

    doc.moveDown(3).text("ความคิดเห็นของกรรมการผู้ประเมิน :", 50).moveDown(0.5).text(cr?.comment || "-", 50).moveDown(3)
      .text(`(ลงชื่อ) ${cm?.fname || "-"} ${cm?.lname || "-"}`, {
        align: "center",
      })
      .text(`ตำแหน่ง : ${assign.position || "-"}`, {
        align: "center",
      });
    doc.end();
  } catch (e) {
    err(res, e);
  }
};

// แสดงรายงานผลการประเมินรายบุคคลได้
exports.reportByuser = async (req, res) => {
  try {
    const {eval_id , user_id} = req.params

    const info = await db('assignments as a')
      .join('users as u', 'a.evaluatee_id', 'u.id')
      .join('users as ut', 'a.evaluator_id', 'ut.id')
      .join('evaluations as e', 'a.eval_id', 'e.id')
      .leftJoin('signedtures as s', 's.assign_id', 'a.id')
      .where({'a.eval_id': eval_id , 'a.evaluatee_id': user_id})
      .select('a.id as assign_id', 'e.id as eval_id', 'e.title', fn('u', 'evaluatee_name'), fn('ut', 'evaluator_name'), 's.comment', 's.sign_file')
      .first()


      const detail = await db('indicators as i')
        .leftJoin('assessments as self', q => {
          q.on('self.asign_id', info.assign_id
            .andOnVal('self.indic_id', 'i.id')
            .andOnVal('self.role', 'self')
          )
        })
        .leftJoin('assessments as com', q => {
          q.on('com.asign_id', info.assign_id
            .andOnVal('com.indic_id', 'i.id')
            .andOnVal('com.role', 'committee')
          )
        })
        .leftJoin('levels as l', 'l.id', 'com.scrore')
        .where('i.eval_id', eval_id)
        .select('i.name', 'i.weight', 'self.score as self_score', 'self.bool_score as self_bool', 'com.score as com_score', 'com.bool_score as com_bool')

      send(res, {info , detail})
  } catch (e) {
    err(res, e);
  }
};