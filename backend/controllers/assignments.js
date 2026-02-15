const db = require("../config/db");
const { send, err } = require("../utils/help");
const { fn, exist } = require("../utils/query");

// มอยหมาย & แก้ไขมอบหมาย
exports.AddOrUpdateAssign = async (req, res) => {
  try {
    const { id } = req.params;
    const { eval_id, evaluatee_id, evaluator_id, position } = req.body;

    if (![eval_id, evaluatee_id, evaluator_id, position].every(Boolean))
      return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403);

    const [ee, et] = await Promise.all([
      db("users").where({ id: evaluatee_id }).first(),
      db("users").where({ id: evaluator_id }).first(),
    ]);

    if (!ee || !et || ee.role !== "evaluatee" || et.role !== "evaluator")
      return send(res, { msg: "Role ไม่ถูกต้อง!" }, 403);

    const dup = await db("assignments")
      .where({ eval_id, evaluatee_id, evaluator_id })
      .first();

    if (dup) return send(res, { msg: "มีการมอบหมายแล้ว!" }, 403);

    await (id
      ? db("assignments")
        .where({ id })
        .update({ eval_id, evaluatee_id, evaluator_id, position })
      : db("assignments").insert({
        eval_id,
        evaluatee_id,
        evaluator_id,
        position,
      }));

    send(res, { msg: "มอบหมายสำเร็จ!!" });
  } catch (e) {
    err(res, e);
  }
};

// ยกเลิกการมอบหมาย
exports.delAssign = async (req, res) => {
  try {
    const { id } = req.params;

    await exist(res,'assignments', {id})

    await db("assignments").where({ id }).del();
    send(res, { msg: "ยกเลิกการมอบหมายสำเร้จ!!" });
  } catch (e) {
    err(res, e);
  }
};

// แสดงข้เอมูลที่ต้องประเมิน
exports.ListAssign = async (req, res) => {
  try {
    const user = req.user

    const row = await db('assignmetns as a')
      .join('users as u', 'a.evaluatee_id', 'u.id')
      .join('users as ut', 'a.evaluator_id', 'ut.id')
      .join('evaluations as e', 'a.eval_id', 'e.id')
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
      .groupBy('a.id')
      .modify(q => {
        if(user.role === 'evaluatee') q.where('a.evaluatee_id', user.id)
        else if(user.role === 'evaluator') q.where('a.evaluator_id', user.id)
      })
      .select(
        'a.id as assign_id',
        'a.position',
        'self.status as self_status',
        'com.status as com_status',
        'u.id as evaluatee_id',
        fn('u', 'evaluatee_name'),
        'ut.id as evaluator_id',
        fn('ut', 'evaluator_name'),
        'e.id as eval_id',
        'e.title'
      )

    send(res, row)

  } catch (e) {
    err(res, e);
  }
};
