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
            bool_score: ind.type === 'boolean' ? hasIt : null
        })
    )
    
    send(res, {msg: 'บันทึกคะแนนสำเร็จ!!'})
  } catch (e) {
    err(res, e)
  }
}

exports.getIndicatorProgress = async(req, res) => {
    try {
        const { assign_id } = req.params
        // const uid = req.user.id

        const row = await db('indicators as i')
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
            .where('asm.id', assign_id)
            .select(
                'i.id', 'i.name', 'i.description', 'i.weight', 'i.allow_evidence',
                'a.score as self_score', 'a.status',
                'e.description', 'e.file_path', 'e.file_url'
            )


        // const indicator = row.map(r => {
        //     let status = 'ยังไม่ดำเนินการ'

        //     if(r.self_score !== null) {
                
        //     }
        // }) 
        send(res, row)
    } catch(e) {
        err(res, e)
    }
}