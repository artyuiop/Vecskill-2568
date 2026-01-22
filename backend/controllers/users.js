const db = require('../config/db')
const { send, err } = require('../utils/help')

exports.createUser = async (req, res) => {
  try {
    const { fname, lname, username, password, role } = req.body

    if (![fname, lname, username, password, role].every(Boolean)) return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403)

    if (!['evaluatee', 'evaluator'].includes(role)) return send(res, { msg: "Role ไม่ถูกต้อง" }, 403)
    
    const user = await db('users').where({ username }).first()
    if (user) return send(res, { msg: "ชื่อผู้ใช้งานซ้ำ" }, 403)

    await db('users').insert({fname,lname,username,password,role })

    send(res, { msg: "เพิ่มผู้ใช้งานสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}

exports.listUserRole = async (req, res) => {
  try {
    const { role } = req.query

    const rows = await db('users').where({ role })
    send(res, rows)
  } catch (e) {
    err(res, e)
  }
}

exports.listUserID = async (req, res) => {
  try {
    const { id } = req.params

    const row = await db('users').where({ id }).first()
    send(res, row)
  } catch (e) {
    err(res, e)
  }
}

exports.getDetailMe = async (req, res) => {
  try {
    const id = req.user.id

    const row = await db('users').where({ id }).first()
    send(res, row)
  } catch (e) {
    err(res, e)
  }
}

exports.changeUser = async (req, res) => {
  try {
    const { id } = req.params
    const { fname, lname, username, password } = req.body

    const dup = await db('users').where('username', username).first()

    if (dup) return send(res, { msg: "มีชื่อผู้ใช้แล้ว" }, 403)

    await db('users').where({ id }).update({fname, lname, username,password})
    send(res, { msg: "แก้ไขสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}
