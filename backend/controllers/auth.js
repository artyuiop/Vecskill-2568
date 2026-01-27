const jwt = require('jsonwebtoken')
const { err, send } = require('../utils/help')
const db = require('../config/db')


exports.register = async (req, res) => {
  try {
    const { fname, lname, username, password } = req.body

    if (![fname, lname, username, password].every(Boolean)) return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403)

    const user = await db('users').where({ username }).first()
    if (user) return send(res, { msg: "ชื่อผู้ใช้ซ้ำ" }, 403)

    await db('users').insert({ fname, lname, username, password })
    send(res, { msg: "สมัครสมาชิกสำเร็จ" })
  } catch (e) {
    err(res, e)
  }
}

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body

    if (![username, password].every(Boolean)) return send(res, { msg: " " }, 403)

    const user = await db('users').select('id', 'username', 'password', 'role').where({ username }).first()

    if (!user) return send(res, { msg: "ไม่มีชื่อผู้ใช้" }, 403)
    if (password !== user.password) return send(res, { msg: "รหัสผ่านไม่ถูกต้อง" }, 403)

    const payload = {
      id: user.id,
      username: user.username,
      role: user.role
    }

    const token = jwt.sign({ payload }, process.env.KEY, { expiresIn: '1d' })

    send(res, { msg: "เข้าสู่ระบบสำเร็จ", token })
  } catch (e) {
    err(res, e)
  }
}
