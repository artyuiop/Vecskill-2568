const db = require("../config/db");
const { send, err } = require("../utils/help");
const { fn, trackStatusFuc, mapIndicators, exist } = require("../utils/query");

// กรอกคะแนน & บันทึกคะแนน
exports.giveScore = async (req, res) => {
  try {
    const { assign_id } = req.params;
    const { indic_id, score, hasIt } = req.body;
    const uid = req.user.id;

    const assign = await exist(res,'assignments', {id: assign_id})

    // ระบุ role
    let role = null;
    if (assign.evaluatee_id === uid) role = "self";
    else if (assign.evaluator_id === uid) role = "committee";
    else return send(res, { msg: "ไม่มีสิทธิ์ให้คะแนน" }, 403);

    // console.log(assign.evaluatee_id)
    const ind = await exist(res, 'indicators', {id: indic_id, eval_id: assign.eval_id })
    const assess = await db("assessments")
      .where({ indic_id, assign_id, role })
      .first();

    if (!ind) return send(res, { msg: "ไม่มีตัวชี้วัด" }, 404);

    await (assess
      ? // update
        db("assessments")
          .where({ id: assess.id })
          .update({
            score: ind.type === "score" ? score : null,
            bool_score: ind.type === "boolean" ? hasIt : null,
          })
      : // insert
        db("assessments").insert({
          indic_id,
          assign_id,
          role,
          score: ind.type === "score" ? score : null,
          bool_score: ind.type === "boolean" ? hasIt : null,
          status: role === "self" ? "completed" : "in_progress",
        }));

    send(res, { msg: "บันทึกคะแนนสำเร็จ!!" });
  } catch (e) {
    err(res, e);
  }
};

// ดูความคืบหน้าแต่ละตัวชี้วัด & ดูภาพรวมตัวชี้วัด
exports.getIndicatorProgress = async (req, res) => {
  try {
    const { assign_id } = req.params;
    const uid = req.user.id;


    const rows = await db("indicators as i")
      .join("assignments as asm", "i.eval_id", "asm.eval_id")
      .leftJoin("assessments as a", (q) => {
        q.on("i.id", "=", "a.indic_id")
          .andOn("a.assign_id", "=", "asm.id")
          .andOn("a.role", "=", db.raw("?", ["self"]));
      })
      .leftJoin("evidence as e", (q) => {
        q.on("i.id", "=", "e.indic_id").andOn(
          "e.user_id",
          "=",
          "asm.evaluatee_id",
        );
      })                                                                                                                                                                                                                                                                                                                                                                                                                                                                      
      .leftJoin("levels as l", "l.indic_id", "i.id")
      .where({ "asm.id": assign_id, "asm.evaluatee_id": uid })
      .select(
        "i.id",
        "i.name",
        "i.description",
        "i.weight",
        "i.type",
        "i.allow_evidence",
        "i.type_file",
        "a.score as self_score",
        "a.status",
        "e.file_path",
        "e.file_url",
        "l.id as level_id",
        "l.level",
        "l.description as level_description",
      );


    const indicator = mapIndicators(rows);

    console.log(indicator)
    const done = indicator.filter((i) => i.status === "completed").length;
    const All = indicator.length;

    send(res, {
      Progress: `${done} / ${All}`,
      status:
        done === 0
          ? "ยังไม่ดำเนินการ"
          : done < All
            ? "กำลังดำเนินการ"
            : "เสร็จสิ้น",
      indicators: indicator,
    });
  } catch (e) {
    err(res, e);
  }
};

// ลงนาม & คอมเม้น
exports.SubmitSignatures = async (req, res) => {
  try {
    const { assign_id } = req.params;
    const { sign_file, comment } = req.body;
    const uid = req.user.id;

    if (![sign_file, comment].every(Boolean))
      return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403);

    await exist(res, 'assignments', { id: assign_id, evaluator_id: uid })

    await db("signatures")
      .insert({ assign_id, sign_file, comment })
      .onConflict(["assign_id"])
      .merge();
    send(res, { msg: "บันทึกลายเซ็นสำเร็จ!" });
  } catch (e) {
    err(res, e);
  }
};

// ดูความเห็นกรรมการ
exports.getComments = async (req, res) => {
  try {
    const { assign_id } = req.params;
    const uid = req.user.id;

    const assign = await exist(res, 'assignments', { id: assign_id, evaluatee_id: uid })

    const row = await db("signatures as si")
      .join("assignments as a", "si.assign_id", "a.id")
      .where({ "a.eval_id": assign.eval_id, "a.evaluatee_id": uid })
      .select("si.comment");

    send(res, row);
  } catch (e) {
    err(res, e);
  }
};

// ติดตามสถานะของ ผู้รับประเมิน
exports.trackStatus = async (req, res) => {
  try {
    const { eval_id, type } = req.params;

    const data = {
      self: ['self', 'evaluatee_id'],
      committee: ['committee', 'evaluator_id']
    };

    // console.log(data[type]);
    
    if (!data[type]) return send(res, { msg: 'type ไม่ถูกต้อง' }, 400);
    const [role, field] = data[type];

    send(res, { [type]: await trackStatusFuc(eval_id, role, field) });
  } catch (e) {
    err(res, e);
  }
};


// แสดงคะแนนที่ผู้รับการประเมิน ประเมินตนเอง & หัวข้อ ตัวชี้วัด รายละเอียดข้อมูล และหลักฐาน
exports.getEvaluationDetail = async (req, res) => {
  try {
    const { assign_id, user_id } = req.params;
    const etid = req.user.id

    const assign = await exist(res, 'assignments', {id: assign_id, evaluatee_id: user_id, evaluator_id: etid})
    const rows = await db("assignments as a")
      .join('indicators as i', 'i.eval_id', 'a.eval_id')
      .leftJoin('levels as lv', 'lv.indic_id', 'i.id')
      .leftJoin('evidence as ed', q => {
        q.on('ed.indic_id', '=', 'i.id')
          .andOn('ed.user_id', '=', db.raw('?', [user_id]))
      })
      .where({ 'a.id': assign_id})
      .select(
        "i.id",
        "i.name",
        "i.description",
        'i.type',
        "ed.file_path",
        "ed.file_url",
        "ed.description as evidence_desc",
        'lv.id as level_id',
        'lv.level',
        'lv.description as level_description'
      );


    const indicators = mapIndicators(rows);
    res.json({ indicators });
  } catch (e) {
    err(res, e)
  }
};

// ยืนยันและส่งผลการประเมิน
exports.submitAssess = async(req , res) => { 
  try {
    const { assign_id } = req.params
    const uid = req.user.id

    const [assign] = await exist(res, 'assignments', {id: assign_id, evaluator_id: uid})
      
    // console.log(assign)
    const [{total}] = await db('indicators').where({ eval_id: assign.eval_id }).count('* as total')
    const [{done}] = await db('assessments').where({assign_id , role: 'committee'}).countDistinct('indic_id as done')
    
    // console.log( total)
    if(total > done) return send(res, {msg: "กรอกตัวชี้วัดยังไม่ครบ!!"}, 403)

    await db('assessments').where({assign_id , role: 'committee'}).update({'status': 'completed'})
    send(res, 'ok')
    } catch(e) {
    err(res, e) 
  }
}