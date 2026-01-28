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
    const user = req.user;

    const rows = await db("assignments as a")
      .join("users as u", "a.evaluatee_id", "u.id")
      .join("users as ut", "a.evaluator_id", "ut.id")
      .join("evaluations as e", "a.eval_id", "e.id")
      .leftJoin("assessments as asm_self", (q) => {
        q.on("a.id", "asm_self.assign_id").andOn("asm_self.role", db.raw("'self'"));
      })
      .leftJoin("assessments as asm_committee", (q) => {
        q.on("a.id", "asm_committee.assign_id").andOn("asm_committee.role", db.raw("'committee'"));
      })
      .modify((q) => {
        if (user.role === "evaluator") q.where("a.evaluator_id", user.id);
        else if (user.role === "evaluatee") q.where("a.evaluatee_id", user.id);
      })
      .select(
        "asm_self.status as self_status",
        "asm_committee.status as committee_status",
        "a.id as assign_id",
        "a.position",
        "a.evaluatee_id",
        fn("u", "evaluatee_name"),
        "a.evaluator_id",
        fn("ut", "evaluator_name"),
        "e.id as eval_id",
        "e.title",
      )
      .groupBy("a.id");
    send(res, rows);
  } catch (e) {
    err(res, e);
  }
};
