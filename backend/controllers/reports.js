const db = require('../config/db')
const { send, err } = require("../utils/help");


// แสดงผลลัพธ์การประเมิน แต่ละตัวชี้วัด ในรูปแบบของตาราง และสรุปภาพรวมของผู้รับการประเมินรายบุคคล
exports.getSummryTableEvaluatee = (req ,res) => {
    try {
        const { assign_id } = req.params
        
    }catch(e) {
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