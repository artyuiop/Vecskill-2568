const db = require('../config/db')
const { err, send } = require('../utils/help')


exports.AddEval = async(req ,res) => {
    try {
        const {title , start_date , end_date} = req.body
        if(![title , start_date , end_date].every(Boolean)) return send(res, {msg: "กรุณากรอกข้อมูลให้ครบ"}, 403)

        await db.query('INSERT INTO evaluations(title, start_date, end_date) VALUES (?,?,?)', [title, start_date ,end_date])

        send(res, {msg: "เพิ่มรอบการประเมินสำเร็จ"})
    } catch(e) {
        err(res, e)
    }
}

exports.listEval = async(req ,res) => {
    try {
        const [rows] = await db.query('SELECT * FROM evaluations')
        send(res, rows)
    } catch(e) {
        err(res ,e)
    }
}

exports.listEvalID = async(req ,res) => {
    try {
        const {id} = req.params
        const [row] = await db.query('SELECT * FROM evaluations WHERE id = ?', [id])

        send(res, row)
    } catch(e) {
        err(res, e)
    }
}

exports.changeEval = async(req, res) => {
    try {
        const {id} = req.params
        const {title, start_date , end_date} = req.body

        const [eval_id] = await db.query('SELECT id FROM evaluations WHERE id = ?', [id])

        if(!eval_id) return send(res, {msg: "ไม่มีรอบการประเมิน"}, 403)

        await db.query('UPDATE evaluations SET title = ? , start_date = ?, end_date = ? WHERE id = ?', [title ,start_date ,end_date ,id])

        send(res, {msg: "แก้ไขรอบการประเมินสำเร็จ"})
    }catch(e) {
        err(res, e)
    }
}

exports.delEval = async(req, res) => {
    try {
        const {id} = req.params
        const [eval_id] = await db.query('SELECT id FROM evaluations WHERE id = ?', [id])

        if(!eval_id) return send(res, {msg: "ไม่มีรอบการประเมิน"}, 403)

        await db.query('DELETE FROM evaluations WHERE id = ?', [id])

        send(res, {msg: "ลบรอบการประเมินสำเร็จ"})
    } catch(e) {
        err(res ,e)
    }
}