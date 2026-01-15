const db =  require('../config/db')
const { send, err } = require('../utils/help')

exports.createUser = async(req , res) => {
    try {
        const {fname, lname, username, password, role} = req.body

        if(![fname ,lname ,username, password, role].every(Boolean)) return send(res, {msg: "กรุณากรอกข้อมูลให้ครบ"}, 403)

        if(!['evaluatee', 'evaluator'].includes(role)) return send(res, {msg: " Role ไม่ถูกต้อง"}, 403)

        const [row] = await db.query('SELECT id FROM users WHERE username = ?', [username])

        if(row.length > 0) return send(res, {msg: "ชื่อผู้ใช้งานซํ้า"}, 403)

        await db.query('INSERT INTO users(fname, lname, username, password, role) VALUES (?,?,?,?,?)', [fname, lname, username, password, role])

        send(res, {msg: "เพิ่มผู้ใช้งานสำเร็จ"})
    } catch(e) {
        err(res, e)
    }
}

exports.listUserRole = async(req ,res) => {
    try {
       const {role} = req.query

       const [rows] = await db.query('SELECT * FROM users WHERE role = ?', [role])
       send(res, rows)
    } catch(e) {
        err(res, e)
    }
}

exports.listUserID = async(req ,res) => {
    try {
        const {id} = req.params

        const [row] = await db.query('SELECT * FROM users WHERE id = ?', [id])
        send(res, row)
    }catch(e) {
        err(res, e)
    }
}

exports.getDetailMe = async(req, res) => {
    try {
        const id = req.user.id

        const [row] = await db.query('SELECT * FROM users WHERE id = ?', [id])
        send(res, row)
    } catch(e) {
        err(res, e)
    }
}

exports.changeUser = async(req, res) => {
    try {
        const {id} = req.params
        const {fname, lname , username , password} = req.body

        const [user] = await db.query('SELECT id FROM users WHERE username = ? AND id != ? ', [username, id])

        if(user.length > 0) return send(res, {msg: "มีชื่อผู่ใช้แล้ว"}, 403)

        await db.query('UPDATE users SET fname = ? , lname = ? , username = ? , password = ? WHERE id = ?', [fname, lname, username, password, id])
        send(res, {msg: "แก้ไขสำเร็จ"})
    } catch(e) {
        err(res, e)
    }
}