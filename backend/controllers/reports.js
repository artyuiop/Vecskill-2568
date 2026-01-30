const db = require('../config/db')
const { send, err } = require("../utils/help");
const { exist } = require('../utils/query');
const { fn } = require("../utils/query");


// แสดงผลลัพธ์การประเมิน แต่ละตัวชี้วัด ในรูปแบบของตาราง และสรุปภาพรวมของผู้รับการประเมินรายบุคคล
exports.getSummryTableEvaluatee = async (req, res) => {
  try {
    const { assign_id} = req.params

    const assign = await exist(res, 'assignments', { id: assign_id })

    const rows = await db('assignments as a')
        .join('users as u', 'a.evaluatee_id', 'u.id')
        .join('users as ut', 'a.evaluator_id', 'ut.id')
        .join('indicators as i', 'i.eval_id', 'a.eval_id')
        .leftJoin('assessments as asm' , q => {
            q.on('asm.indic_id', 'i.id')
                .andOn('asm.assign_id', 'a.id')
                .andOn('asm.role', db.raw('?', 'self'))
        })
        .leftJoin('assessments as aa' , q => {
            q.on('aa.indic_id', 'i.id')
                .andOn('aa.assign_id', 'a.id')
                .andOn('aa.role', db.raw('?', 'committee'))
        })
        .where({'a.id': assign_id})
        .select(
            'i.id as indic_id', 'i.name as indic_name',fn('u', 'evaluatee_name'), 'asm.score', 'asm.bool_score',
            fn('ut', 'evaluator_name'), 'aa.score as score_committee', 'aa.bool_score as bool_committee',
        )
    send(res, rows)
  } catch (e) {
    err(res, e)
  }
}

// สามารถ Export ออกมาเป็นไฟล์ PDF ได้
exports.ExportPDF = async(req ,res) => {
    try {
    
    }catch(e) {
        err(res, e)
    }
}

// แสดงผลสรุปการประเมินรายกรรมการ (ประเมินผู้รับการประเมินแต่ละคน)
exports.SummaryEvaluator = async(req ,res) => {
    try {

    }catch(e) {
        err(res ,e)
    }
}

// แสดงรายงานผลการประเมินรายบุคคลได้
exports.reportByuser = async(req , res) => {
    try {

    }catch(e) {
        err(res, e)
    }
}