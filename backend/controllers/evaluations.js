const db = require('../config/db')
const { err, send } = require('../utils/help')


exports.AddEval = async (req, res) => {
  try {
    const { title, start_date, end_date } = req.body

    if (![title, start_date, end_date].every(Boolean)) return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403)

    await db('evaluations').insert({title,start_date,end_date})
    send(res, { msg: "เพิ่มรอบการประเมินสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}


exports.listEval = async (req, res) => {
  try {
    const rows = await db('evaluations')
    send(res, rows)
  } catch (e) {
    err(res, e)
  }
}


exports.listEvalID = async (req, res) => {
  try {
    const { id } = req.params

    const row = await db('evaluations').where({ id }).first()
    send(res, row)
  } catch (e) {
    err(res, e)
  }
}


exports.changeEval = async (req, res) => {
  try {
    const { id } = req.params
    const { title, start_date, end_date } = req.body

    const evalRow = await db('evaluations').where({ id }).first()
    if (!evalRow) return send(res, { msg: "ไม่มีรอบการประเมิน" }, 403)

    await db('evaluations').where({ id }).update({title,start_date,end_date})

    send(res, { msg: "แก้ไขรอบการประเมินสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}


exports.delEval = async (req, res) => {
  try {
    const { id } = req.params

    const evalRow = await db('evaluations').where({ id }).first()
    if (!evalRow) return send(res, { msg: "ไม่มีรอบการประเมิน" }, 403)
    
    await db('evaluations').where({ id }).del()
    send(res, { msg: "ลบรอบการประเมินสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}
