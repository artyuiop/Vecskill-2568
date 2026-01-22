const db = require('../config/db')
const { send, err } = require('../utils/help')

exports.EvaluationCheck = async(req , res, next) => {
    try {
        const id = req.params.eval_id

        const evalDate = await db('evaluations').where({id}).first()
        if(!evalDate) return send(res, {msg: "ไม่มี Eval_id"}, 400)

        const today = new Date().toLocaleDateString('en-CA')
        const {start_date: start, end_date: end} = evalDate

        console.log(evalDate)
        if(today < start) return send(res, {msg: "ยังไม่ถึงวันปรเมิน!!"}, 403)
        if(today > end) return send(res, {msg: "เลยกำหนด!!"}, 403)
        next()
    } catch(e) {
        err(res, e) 
    }
}