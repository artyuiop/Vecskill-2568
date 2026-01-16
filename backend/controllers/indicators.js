const db = require('../config/db')
const { send, err } = require('../utils/help')

// เพิ่มตัวชี้วัด && แก้ไข
exports.AddOrUpdateIndic = async (req, res) => {
    try {
        const { id } = req.params
        const { eval_id, name, description, weight, type } = req.body

        if (![name, eval_id, description, weight, type].every(Boolean)) return send(res, { msg: "กรุณากรอกข้อมูลให้ครบ" }, 403)
        if (!['score', 'boolean'].includes(type)) return send(res, { msg: "type ไม่ถูกต้อง!" }, 403)

        // evalCheck
        const [Eval] = await db.query('SELECT id FROM evaluations WHERE id = ?', [eval_id])

        if (Eval.length === 0) return send(res, { msg: "ไม่มีรอบการประเมินนี้!!" }, 403)

        if (id) {
            // UPDATE
            const [indic] = await db.query('SELECT id FROM indicators WHERE id = ?', [id])
            if (indic.length === 0) return send(res, { msg: "ไม่พบตัวชี้วัด!" }, 403)

            await db.query(
                'UPDATE indicators SET eval_id = ?, name = ?, description = ?, weight = ?, type = ? WHERE id = ?',
                [eval_id, name, description, weight, type, id]
            )

            send(res, { msg: "แก้ไขตัวชี้วัดสำเร็จ" })
        } else {
            // INSERT
            await db.query(
                'INSERT INTO indicators (eval_id, name, description, weight, type) VALUES (?, ?, ?, ?, ?)',
                [eval_id, name, description, weight, type]
            )

            send(res, { msg: "เพิ่มตัวชี้วัดสำเร็จ" })
        }
    } catch (e) {
        err(res, e)
    }
}

// ดูตัวชี้วัดตามรอบประเมิน
exports.ListIndic = async(req , res) => {
    try {
        const { eval_id } = req.params
        const [rows] = await db.query('SELECT * FROM indicators WHERE eval_id = ?', [eval_id])
        send(res , rows)
    } catch(e) {
        err(res, e)
    }
}


//  Levels
exports.AddLevels = async(req ,res) => {
    try {
        const { indic_id } = req.params

        const [Indic] = await db.query('SELECT * FROM indicators WHERE id = ?', [indic_id])
        const [Level] = await db.query('SELECT indic_id FROM levels WHERE indic_id  = ?', [indic_id])

        const indicator = Indic[0]

        // console.log(Level)

        if(Level.length > 0) return send(res, {msg: "มีตัวชี้วัดอยู่แล้ว!"}, 403)
        
        if(!indicator) return send(res, {msg: "ไม่มีตัวชี้วัด"}, 403)
        if(indicator.type !== 'score') return send(res, {msg: "type ไม่ถูกต้อง"}, 403)
        
        // Loop 1-4 Levels
        for(const {level , description} of req.body) {
            if(!level || level < 1 || level > 4) return send(res, {msg: "ระดับคะแนนต้อง 1-4"}, 403)
            await db.query('INSERT INTO levels (indic_id , level , description) VALUES (?,?,?)', [indic_id , level , description])
        }

        send(res, {msg: "เพิ่มระดับคะแนนสำเร็จ"}, 403)
    } catch(e) {
        err(res , e)
    }
}

exports.ListLevels = async (req, res) => {
    try {
        const { indic_id } = req.params

        const [levels] = await db.query('SELECT level , description FROM levels WHERE indic_id = ? ORDER BY level ASC',[indic_id])

        if (levels.length === 0) {
            return send(res, { msg: "ไม่พบระดับคะแนน" }, 404)
        }

        send(res, {
            indicator: +indic_id,
            levels: levels
        })

    } catch (e) {
        err(res, e)
    }
}

exports.changeLevels = async (req, res) => {
    try {
        const { indic_id } = req.params

        for (const { level, description } of req.body) {
            await db.query('UPDATE levels SET description = ? WHERE indic_id = ? AND level = ?',
                [description, indic_id, level]
            )
        }

        send(res, { msg: "แก้ไขสเกลคะแนนสำเร็จ!!" })
    } catch (e) {
        err(res, e)
    }
}


// evidence
exports.AddEvidence = async(req , res) => {
    try {
        const { indic_id } = req.params
        const uid = req.user.id
        const file = req.file
        const {file_url, description} = req.body
        
        const [indic] = await db.query('SELECT id FROM indicators WHERE id = ?', [indic_id])

        const [evidence] = await db.query('SELECT id FROM evicence WHERE indic_id = ? AND user_id = ?',
            [indic_id , uid]
        )

        if(evidence) return send(res, {msg: "มีหลักฐานแล้วกรุณาลบก่อน"}, 403)
        if(!indic) return send(res, {msg: "ไม่พบตัวชี้วัด"}, 401)

        // file
        if(file) {
            await db.query('INSERT INTO evidence(indic_id , user_id, file_path, description) VALUES (?, ? ,? ,?)',
                [indic_id, uid, file , description]
            )
            return send(res, {msg: "เพิ่มหลักฐานสำเร็จ"})
        }

        // url
        if(file_url) {
            await db.query('INSERT INTO evidence(indic_id , user_id, file_url, description) VALUES (?,?,?,?)',
                [indic_id , uid , file_url, description]
            )
            return send(res, {msg: "เพิ่มหลักฐานสำเร็จ"})
        }

        send(res, {msg: "กรุณากรอกหลักฐาน"}, 403)
    } catch(e)  {
        err(res , e)
    }
}

exports.delEvid = async(req ,res) => {
    try {
        const { evid_id } = req.params

        const [row] = await db.query('SELECT id FROM evidence WHERE id = ?', [evid_id])
        if(!row) return send(res, {msg: "ไม่พบหลักฐาน"}, 403)

        await db.query('DELETE FROM evidence WHERE id = ?', [evid_id])

        send(res, {msg: "ลบหลักฐานสำเร็จ!"})
    } catch(e) {
        err(res, e)
    }
}