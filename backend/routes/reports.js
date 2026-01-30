const { getSummryTableEvaluatee, SummaryEvaluator, getDetailSummaryEvaluator, ExportPDF, reportByuser } = require('../controllers/reports')
const { AuthCheck, RoleCheck } = require('../middleware/auth')



const router = require('express').Router()

// แสดงผลลัพธ์การประเมิน แต่ละตัวชี้วัด ในรูปแบบของตาราง และสรุปภาพรวมของผู้รับการประเมินรายบุคคล
router.get('/result-Table/:assign_id',AuthCheck,RoleCheck(['evaluator']), getSummryTableEvaluatee)

// สามารถ Export ออกมาเป็นไฟล์ PDF ได้
router.get('/export-pdf/:eval_id/',AuthCheck,RoleCheck(['evaluatee']),AuthCheck, ExportPDF)

// แสดงผลสรุปการประเมินรายกรรมการ (ประเมินผู้รับการประเมินแต่ละคน)
router.get('/summary-assign/:eval_id',AuthCheck,RoleCheck(['admin']), SummaryEvaluator)
router.get('/detail-score/:eval_id/:evaluator_id',AuthCheck,RoleCheck(['admin']), getDetailSummaryEvaluator)

// แสดงรายงานผลการประเมินรายบุคคลได้
router.get('/reportByuser/:eval_id/:user_id',AuthCheck,RoleCheck(['admin']), reportByuser)


module.exports = router