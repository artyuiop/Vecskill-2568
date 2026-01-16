const jwt = require('jsonwebtoken')
const { err, send } = require('../utils/help')
const db = require('../config/db')


exports.register = async(req , res) => {
    try {
        const {fname , lname , username , password} = req.body

        if(![fname , lname , username , password].every(Boolean)) return send(res, {msg: "กรุณากรอกข้อมูลให้ครบ"}, 403)

        const [row] = await db.query('SELECT id FROM users WHERE username = ?', [username])

        if(row.length > 0) return send(res, {msg: 'ชื่อผู้ใช้ซํ้า'}, 403)
        
        await db.query('INSERT INTO users(fname , lname ,username ,password) VALUES (?, ?, ?, ?)', [fname, lname, username, password])

        send(res, {msg: "สมัครสมาชิกสำเร็จ"})
    } catch(e) {
        err(res, e)
    }
}

exports.login = async(req, res) => {
    try {
        const {username , password} = req.body

        if(![username, password].every(Boolean)) return send(res, {msg: "กรุณากรอกข้อมูลให้ครบ"}, 403)
        // console.log(username);
        
        const [row] = await db.query('SELECT id, username, password, role FROM users WHERE username = ?', [username])
        const user = row[0]
        
        if(!user) return send(res, {msg: "ไม่มีชื่อผู้ใช้"}, 403)

        if(password !== user.password) return send(res, {msg: "รหัสผ่านไม่ถูกต้อง"}, 403)

        const payload = {
            id: user.id,
            username: user.username,
            role: user.role
        }

        console.log(payload)
        const token = jwt.sign({payload}, process.env.KEY , {expiresIn: '1d'})

        send(res, {msg: "เข้าสู่ระบบสำเร็จ", token})
    } catch(e) {
        err(res, e)
    }
}

