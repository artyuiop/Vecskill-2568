const { getSummryTableEvaluatee, SummaryEvaluator, getDetailSummaryEvaluator, ExportPDF } = require('../controllers/reports')
const { AuthCheck } = require('../middleware/auth')


const router = require('express').Router()

// แสดงผลลัพธ์การประเมิน แต่ละตัวชี้วัด ในรูปแบบของตาราง และสรุปภาพรวมของผู้รับการประเมินรายบุคคล
router.get('/result-Table/:assign_id', getSummryTableEvaluatee)

// สามารถ Export ออกมาเป็นไฟล์ PDF ได้
router.get('/export-pdf/:eval_id/',AuthCheck, ExportPDF)

// แสดงผลสรุปการประเมินรายกรรมการ (ประเมินผู้รับการประเมินแต่ละคน)
router.get('/summary-assign/:eval_id', SummaryEvaluator)
router.get('/detail-score/:eval_id/:evaluator_id', getDetailSummaryEvaluator)

// แสดงรายงานผลการประเมินรายบุคคลได้



module.exports = router