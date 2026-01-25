const { giveScore, getIndicatorProgress, SubmitSignatures, getComments } = require('../controllers/assessments')
const { AuthCheck } = require('../middleware/auth')

const router = require('express').Router()

// กรอกคะแนน
router.post('/give-score/:assign_id',AuthCheck, giveScore)

// ดูความคืบหน้าแต่ละตัวชี้วัด & ดูภาพรวมตัวชี้วัด
router.get('/getIndicatorProgress/:assign_id',AuthCheck, getIndicatorProgress)

// ลงนาม & คอมเม้น
router.post('/sign-commnents/:assign_id', AuthCheck, SubmitSignatures)

// ดูความเห็นกรรมการ
// router.get('/get-comment', AuthCheck, getComments)



module.exports = router