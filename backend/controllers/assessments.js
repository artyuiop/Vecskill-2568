const db = require('../config/db')
const {send , err} = require('../utils/help')

// กรอกคะแนน & บันทึกคะแนน
exports.giveScore = async (req, res) => {
  try {
    const { assign_id } = req.params
    const { indic_id, score, hasIt } = req.body
    const uid = req.user.id

    const assign = await db('assignments').where({ id: assign_id }).first()
    if (!assign) return send(res, { msg: 'ไม่พบ assignment' }, 404)

    // ระบุ role
    let role = null
    if (assign.evaluatee_id === uid) role = 'self'
    else if (assign.evaluator_id === uid) role = 'committee'
    else return send(res, { msg: 'ไม่มีสิทธิ์ให้คะแนน' }, 403)


    // console.log(role)
    const ind = await db('indicators').where({ id: indic_id, eval_id: assign.eval_id }).first()
    const assess = await db('assessments').where({ indic_id , assign_id, role}).first()

    if (!ind) return send(res, { msg: 'ไม่มีตัวชี้วัด' }, 404)

    await (assess
        // update
        ? db('assessments').where({ id: assess.id}).update({
            score: ind.type === 'score' ? score : null,
            bool_score: ind.type === 'boolean' ? hasIt : null
        })
        // insert
        : db('assessments').insert({ indic_id, assign_id ,role,
            score: ind.type === 'score' ? score : null,
            bool_score: ind.type === 'boolean' ? hasIt : null,
            status: role === 'self' ? 'completed' : 'in_progress'
        })
    )
    
    send(res, {msg: 'บันทึกคะแนนสำเร็จ!!'})
  } catch (e) {
    err(res, e)
  }
}

// ดูความคืบหน้าแต่ละตัวชี้วัด & ดูภาพรวมตัวชี้วัด
exports.getIndicatorProgress = async(req, res) => {
    try {
        const { assign_id } = req.params
        const uid = req.user.id


        const rows = await db('indicators as i')
            .join('assignments as asm', 'i.eval_id', 'asm.eval_id')
            .leftJoin('assessments as a', q => {
                q.on('i.id', '=', 'a.indic_id')
                .andOn('a.assign_id', '=', 'asm.id')
                .andOn('a.role', '=', db.raw('?', ['self']))
            })
            .leftJoin('evidence as e', q => {
                q.on('i.id', '=', 'e.indic_id')
                .andOn('e.user_id', '=', 'asm.evaluatee_id')
            })
            .leftJoin('levels as l', 'l.indic_id', 'i.id')
            .where({ 'asm.id': assign_id, 'asm.evaluatee_id': uid })
            .select(
                'i.id', 'i.name', 'i.description', 'i.weight', 'i.type', 'i.allow_evidence', 'i.type_file',
                'a.score as self_score', 'a.status',
                'e.file_path', 'e.file_url',
                'l.id as level_id', 'l.level', 'l.description as level_description'
            )

        // Data indicators
        const map = {}

        rows.forEach(r => {
            if(!map[r.id]) {
                map[r.id] = {
                    ...r, level: []
                }
            }

            // push levels Data
            if(r.level_id) {
                map[r.id].level.push({
                    id: r.level_id,
                    level: r.level,
                    descripton: r.level_description
                })
            }
        })

        // console.log(map)
        const indicator = Object.values(map)
        // console.log(indicator)
        const done = indicator.filter(i => i.status === 'เสร็จสิ้น').length
        const All = indicator.length


        send(res, {
            Progress: `${done} / ${All}`,
            status: done === 0 ? 'ยังไม่ดำเนินการ' : done < All ? 'กำลังดำเนินการ' : 'เสร็จสิ้น',
            indicators: indicator
        })
    } catch(e) {
        err(res, e)
    }
}

// ลงนาม & คอมเม้น
exports.SubmitSignatures = async(req , res) => {
    try {
        const { assign_id} = req.params
        const { sign_file , comment } = req.body
        const uid = req.user.id

        if(![sign_file , comment].every(Boolean)) return send(res, {msg: "กรุณากรอกข้อมูลให้ครบ"}, 403)

        const assign = await db('assignments').where({ id: assign_id , evaluator_id: uid }).first()
        if (!assign) return send(res, { msg: 'ไม่มีสิทลงนาม!' }, 404)

        await db('signatures').insert({assign_id, sign_file , comment }).onConflict(['assign_id']).merge()
        send(res, { msg: "บันทึกลายเซ็นสำเร็จ!" })
    } catch(e) {
        err(res , e)
    }
}

// exports.getComments = async(req, res) => {
//     try {
//         const { assign_id } = req.params
//         const uid = req.user.id

        
//     }catch(e) {
//         err(res, e)
//     }
// }