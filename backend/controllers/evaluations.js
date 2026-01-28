const db = require("../config/db");
const { err, send } = require("../utils/help");
const { exist } = require("../utils/query");

// เพิ่มรอบการประเมิน
exports.AddEval = async (req, res) => {
  try {
    const { title, start_date, end_date } = req.body;

    if (![title, start_date, end_date].every(Boolean))
      return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403);

    await db("evaluations").insert({ title, start_date, end_date });
    send(res, { msg: "เพิ่มรอบการประเมินสำเร็จ" });
  } catch (e) {
    err(res, e);
  }
};

// ดูรอบการประเมิน
exports.listEval = async (req, res) => {
  try {
    const rows = await db("evaluations");
    send(res, rows);
  } catch (e) {
    err(res, e);
  }
};

// ดูรอบการประเมินทีละอัน
exports.listEvalID = async (req, res) => {
  try {
    const { id } = req.params;

    await exist(res, 'evaluations', {id})
    const row = await db("evaluations").where({ id }).first();
    send(res, row);
  } catch (e) {
    err(res, e);
  }
};

// แก้ไขรอบการประเมิน
exports.changeEval = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, start_date, end_date } = req.body;

    await exist(res, 'evaluations', {id})

    await db("evaluations")
      .where({ id })
      .update({ title, start_date, end_date });

    send(res, { msg: "แก้ไขรอบการประเมินสำเร็จ" });
  } catch (e) {
    err(res, e);
  }
};

// ลบรอบการประเมิน
exports.delEval = async (req, res) => {
  try {
    const { id } = req.params;

    await exist(res, 'evaluations', {id})

    await db("evaluations").where({ id }).del();
    send(res, { msg: "ลบรอบการประเมินสำเร็จ" });
  } catch (e) {
    err(res, e);
  }
};