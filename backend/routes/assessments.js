const { giveScore, getIndicatorProgress } = require('../controllers/assessments')
const { AuthCheck } = require('../middleware/auth')

const router = require('express').Router()

// กรอกคะแนน
router.post('/give-score/:assign_id',AuthCheck, giveScore)

// ดูความคืบหน้าแต่ละตัวชี้วัด & ดูภาพรวมตัวชี้วัด
router.get('/getIndicatorProgress/:assign_id',AuthCheck, getIndicatorProgress)


module.exports = router