const db = require("../config/db");
const { send, err } = require("../utils/help");
const { exist } = require("../utils/query");
const { fn, statusCase} = require("../utils/query");
const PDFDocument = require("pdfkit");

// แสดงผลลัพธ์การประเมิน แต่ละตัวชี้วัด ในรูปแบบของตาราง และสรุปภาพรวมของผู้รับการประเมินรายบุคคล
exports.getSummryTableEvaluatee = async (req, res) => {
  try {
    const { assign_id } = req.params;

    await exist(res, "assignments", { id: assign_id });

    const rows = await db("assignments as a")
      .join("users as u", "a.evaluatee_id", "u.id")
      .join("users as ut", "a.evaluator_id", "ut.id")
      .join("indicators as i", "i.eval_id", "a.eval_id")
      .leftJoin("assessments as asm", (q) => {
        q.on("asm.indic_id", "i.id")
          .andOn("asm.assign_id", "a.id")
          .andOn("asm.role", db.raw("?", "self"));
      })
      .leftJoin("assessments as aa", (q) => {
        q.on("aa.indic_id", "i.id")
          .andOn("aa.assign_id", "a.id")
          .andOn("aa.role", db.raw("?", "committee"));
      })
      .where({ "a.id": assign_id })
      .select(
        "i.id as indic_id",
        "i.name as indic_name",
        fn("u", "evaluatee_name"),
        "asm.score",
        "asm.bool_score",
        fn("ut", "evaluator_name"),
        "aa.score as score_committee",
        "aa.bool_score as bool_committee",
      );
    send(res, rows);
  } catch (e) {
    err(res, e);
  }
};

// แสดงผลสรุปการประเมินรายกรรมการ
exports.SummaryEvaluator = async (req, res) => {
  try {
    const { eval_id } = req.params;
    const { total } = await db("indicators").where({ eval_id }).count("id as total").first();
    const rows = await db("assignments as a")
      .join("users as ut", "a.evaluator_id", "ut.id")
      .leftJoin("assessments as asm", q => {
        q.on("asm.assign_id", "a.id")
        .andOnVal("asm.role", "committee");
      })
      .where("a.eval_id", eval_id)
      .groupBy("ut.id")
      .select(
        'ut.id as evaluator_id',
        fn("ut", "evaluator_name"),
        db.raw("COUNT(DISTINCT a.id) as assigned"),
        db.raw(
          `
            COUNT(DISTINCT CASE
                WHEN asm.status = 'completed'
                AND asm.assign_id IN (
                SELECT assign_id
                FROM assessments
                WHERE role = 'committee'
                GROUP BY assign_id
                HAVING COUNT(indic_id) = ?
                )
                THEN a.id
            END) as completed
            `,
          [total],
        ),
      );

    const result = rows.map((r) => {
      let status = "ยังไม่เริ่ม";
      if (r.completed > 0 && r.completed < r.assigned) status = "กำลังประเมิน";
      if (r.completed === r.assigned) status = "เสร็จสิ้น";
      return { ...r, status };
    });

    send(res, result);
  } catch (e) {
    err(res, e);
  }
};

// รายละเอียด รายบุคคล แสดงผลสรุปการประเมินรายกรรมการ
exports.getDetailSummaryEvaluator = async(req, res) => {
    try {
        const {eval_id , evaluator_id} = req.params
        
        const rows = await db('assignments as asm')
        .join('users as u', 'asm.evaluatee_id', 'u.id')
        .join('indicators as i', 'i.eval_id', 'asm.eval_id')
        .leftJoin('assessments as a', q => {
            q.on('a.assign_id', '=', 'asm.id')
            .andOnVal('a.role', '=', 'committee')
        })
        .where({
            'asm.eval_id': eval_id,
            'asm.evaluator_id': evaluator_id
        })
        .groupBy('asm.id')
        .select(
            fn('u', 'evaluatee_name'),
            // สถานะ
            statusCase('a.id', 'a.status', 'i.id'),
            // คะแนนรวม
            db.raw(`
            CASE
                WHEN COUNT(a.id) = 0 THEN NULL
                ELSE SUM(a.score)
            END as total_score
            `)
        )
        send(res, rows)
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

  } catch (e) {
    err(res, e);
  }
};
