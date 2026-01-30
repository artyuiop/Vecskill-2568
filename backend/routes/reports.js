const { getSummryTableEvaluatee, SummaryEvaluator, getDetailSummaryEvaluator } = require('../controllers/reports')


const router = require('express').Router()

// แสดงผลลัพธ์การประเมิน แต่ละตัวชี้วัด ในรูปแบบของตาราง และสรุปภาพรวมของผู้รับการประเมินรายบุคคล
router.get('/result-Table/:assign_id', getSummryTableEvaluatee)

// สามารถ Export ออกมาเป็นไฟล์ PDF ได้

// แสดงผลสรุปการประเมินรายกรรมการ (ประเมินผู้รับการประเมินแต่ละคน)
router.get('/summary-assign/:eval_id', SummaryEvaluator)
router.get('/detail-score/:eval_id/:evaluator_id', getDetailSummaryEvaluator)

// แสดงรายงานผลการประเมินรายบุคคลได้

module.exports = router