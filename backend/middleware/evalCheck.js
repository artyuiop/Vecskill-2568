const db = require('../config/db')
const { send, err } = require('../utils/help')

exports.EvaluationCheck = async (req, res, next) => {
    try {
        const today = new Date().toLocaleDateString('en-CA');
        const id = req.params.assign_id
        const ev = await db('assignments as a')
            .join('evaluations as e', 'a.eval_id', 'e.id')
            .where('a.id', id)
            .select('e.start_date', 'e.end_date').first();

        if (!ev) return send(res, { msg: "ไม่พบข้อมูล!" }, 403);
        if (today < ev.start_date || today > ev.end_date) return send(res, { msg: "ไม่อยู่ในช่วงเวลาประเมิน!" }, 403);

        next();
    } catch (e) { err(res, e); }
}