const db = require("../config/db");
const { send, err } = require("../utils/help");
const { fn } = require("../utils/query");

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

    const row = await db("assignments").where({ id }).first();
    if (!row) return send(res, { msg: "ไม่มีการมอบหมาย!!" }, 403);

    await db("assignments").where({ id }).del();
    send(res, { msg: "ยกเลิกการมอบหมายสำเร้จ!!" });
  } catch (e) {
    err(res, e);
  }
};

// แสดงข้อมูลที่ต้องประเมิน
exports.ListAssign = async (req, res) => {
  try {
    const { id, role } = req.user;
    const isEvaluator = role === "evaluator";

    const rows = await db("assignments as a")
      .join("users as u", "a.evaluatee_id", "u.id")
      .join("users as ut", "a.evaluator_id", "ut.id")
      .join("evaluations as e", "a.eval_id", "e.id")
      .join("indicators as i", "i.eval_id", "a.eval_id")
      .leftJoin("assessments as asm", function () {
        this.on("asm.assign_id", "a.id")
          .andOn("asm.indic_id", "i.id")
          .andOn(
            "asm.role",
            db.raw("?", [isEvaluator ? "committee" : "self"])
          );
      })
      .where(isEvaluator ? "a.evaluator_id" : "a.evaluatee_id", id)
      .groupBy("a.id")
      .select(
        "a.id as assign_id",
        "a.position",
        'u.id as evalautee_id',
        'ut.id as evaluator_id',
        fn("u", "evaluatee_name"),
        fn("ut", "evaluator_name"),
        "e.id as eval_id",
        "e.title",
        "asm.id as assess_id",
        "asm.status"
      );

    send(res, rows);
  } catch (e) {
    err(res, e);
  }
};