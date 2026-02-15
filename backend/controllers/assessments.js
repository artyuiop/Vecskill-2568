const db = require("../config/db");
const { send, err } = require("../utils/help");
const { fn, trackStatusFuc, mapIndicators, exist } = require("../utils/query");

// กรอกคะแนน & บันทึกคะแนน
exports.giveScore = async (req, res) => {
  try {
    const { assign_id } = req.params;
    const { indic_id, score, hasIt } = req.body;
    const uid = req.user.id;

    const assign = await exist(res, "assignments", { id: assign_id });

    // ระบุ role
    let role = null;
    if (assign.evaluatee_id === uid) role = "self";
    else if (assign.evaluator_id === uid) role = "committee";
    else return send(res, { msg: "ไม่มีสิทธิ์ให้คะแนน" }, 403);

    // console.log(assign.evaluatee_id)
    const ind = await exist(res, "indicators", {
      id: indic_id,
      eval_id: assign.eval_id,
    });
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
    const {assign_id} = req.params
    const uid = req.user.id

    const row = await db('assignments as a')
      .join('indicators as i', 'a.eval_id', 'i.eval_id')
      .leftJoin('levels as l', 'l.indic_id', 'i.id')
      .leftJoin('assessments as asm', q =>{
        q.on('asm.assing_id', 'a.id')
          .andOn('asm.indic_id', 'i.id')
          .andOnVal('asm.role', 'self')
      })
      .leftJoin('evidence as e', q => {
        q.on('e.indic_id', 'i.id')
          .andOn('e.user_id', 'a.evaluatee_id')
      })
      .where({'a.id': assign_id , 'a.evaluatee_id': uid})
      .select(
        'i.*',
        'l.id as level_id',
        'l.level',
        'l.description as level_desc',
        'e.file_path',
        'e.file_url',
        'asm.status'
      )

    const indicators = mapInidcaotrs(row)

    const done = indicator.filter((i) => i.status === 'completed').length
    const all = indicator.length

    send(res, {
      progress: `${done} / ${all}`,
      status: done === 0 ? 'ยังไม่ดำเนินการ' : done < all ? 'กำลังดำเนินการ' : 'เสร็จสิ้น',
      indicators
    })

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

    await exist(res, "assignments", { id: assign_id, evaluator_id: uid });

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

    const assign = await exist(res, "assignments", {
      id: assign_id,
      evaluatee_id: uid,
    });

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
    const {eval_id , type} = req.params

    const data = {
      self: ['self', 'evaluatee_id'],
      committee: ['committee', 'evaluator_id'],
    }

    const [role , field] = data[type]

    const row = await trackStatusFn(eval_id , role , field)

    send(res , row)

  } catch (e) {
    err(res, e);
  }
};

// แสดงคะแนนที่ผู้รับการประเมิน ประเมินตนเอง & หัวข้อ ตัวชี้วัด รายละเอียดข้อมูล และหลักฐาน
exports.getEvaluationDetail = async (req, res) => {
  try {
      const {assign_id , user_id} = req.params
      const utid = req.user.id

      const row = await db('assignments as a')
      .join('indicators as i', 'a.eval_id', 'i.eval_id')
      .leftJoin('levels as l', 'l.indic_id', 'i.id')
      .leftJoin('assessments as asm', q =>{
        q.on('asm.assing_id', 'a.id')
          .andOn('asm.indic_id', 'i.id')
          .andOnVal('asm.role', 'self')
      })
      .leftJoin('evidence as e', q => {
        q.on('e.indic_id', 'i.id')
          .andOn('e.user_id', 'a.evaluatee_id')
      })
      .where({'a.id': assign_id , 'a.evaluatee_id': uid})
      .select(
        'i.*',
        'l.id as level_id',
        'l.level',
        'l.description as level_desc',
        'e.file_path',
        'e.file_url',
        'e.description as evid_desc'
        'asm.status'
      )


      const indicator = mapInidcaotrs(row)
      send(res , indicator)
  } catch (e) {
    err(res, e);
  }
};

// ยืนยันและส่งผลการประเมิน
exports.submitAssess = async (req, res) => {
  try {
    const {assign_id} = req.params
    const uid = req.user.id

    const assign = await exist(res, 'assignments', {id: assign_id , evaluator_id: uid})

    const [{total}] = await db('indicators').where({eval_id: assign.eval_id}).count('* as total')
    const [{done}] = await db('assessments').where({assign_id , role: 'committee'}).countDistinct('indic_id as done')

    if(done < total) return send(res , {msg: "กรอกให้ครบ"}, 403)

    send(res, {msg: "ok"})
  } catch (e) {
    err(res, e);
  }
};