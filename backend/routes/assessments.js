const { giveScore, getIndicatorProgress, SubmitSignatures, getComments, submitAssess, trackStatus,getEvaluationDetail } = require('../controllers/assessments')
const { AuthCheck } = require('../middleware/auth')

const router = require('express').Router()

// กรอกคะแนน
router.post('/give-score/:assign_id',AuthCheck, giveScore)

// ดูความคืบหน้าแต่ละตัวชี้วัด & ดูภาพรวมตัวชี้วัด
router.get('/getIndicatorProgress/:assign_id',AuthCheck, getIndicatorProgress)

// ลงนาม & คอมเม้น
router.post('/sign-commnents/:assign_id', AuthCheck, SubmitSignatures)

// ดูความเห็นกรรมการ
router.get('/get-comment/:assign_id', AuthCheck, getComments)

// ติดตามสถานะของ ผู้รับประเมิน
router.get('/track-status/:eval_id/:type', AuthCheck , trackStatus)

// แสดงคะแนนที่ผู้รับการประเมิน ประเมินตนเอง & หัวข้อ ตัวชี้วัด รายละเอียดข้อมูล และหลักฐาน
router.get('/indicators-detail/:assign_id/:user_id', AuthCheck, getEvaluationDetail)

// ยืนยันและส่งผลการประเมิน
router.post('/submitAssess/:assign_id', AuthCheck, submitAssess)

module.exports = router