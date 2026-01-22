const {  ListIndic, AddLevels, ListLevels, AddEvidence, changeLevels, delEvid, AddOrUpdateIndic } = require('../controllers/indicators')
const { AuthCheck, RoleCheck } = require('../middleware/auth')
const { upload } = require('../middleware/upload')
const router = require('express').Router()


// indicators
// เพิ่มตัวชี้วัด
router.post('/',AuthCheck,RoleCheck(['admin']), AddOrUpdateIndic)

// ดูตัวชี้วัดตามหัวข้อการประเมิน
router.get('/:eval_id',AuthCheck,RoleCheck(['admin', 'evaluator', 'evaluatee']), ListIndic)

// แก้ไขตัวชี้วัด
router.put('/:id',AuthCheck,RoleCheck(['admin']), AddOrUpdateIndic)

// levels
// เพิ่มสเกลคะแนน
router.post('/levels/:indic_id',AuthCheck,RoleCheck(['admin']), AddLevels)

// ดูสเกลคะแนตามตัวชี้วัด
router.get('/levels/:indic_id',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), ListLevels)

// แก้ไขสเกลคะแนน
router.put('/levels/:indic_id',AuthCheck,RoleCheck(['admin']), changeLevels)



// evidence
// เพิ่มหลักฐานการประเมิน
router.post('/evidence/:indic_id',AuthCheck,RoleCheck(['admin', 'evaluator']),upload.single('file'), AddEvidence)

// ยกเลิกหลักฐาน
router.delete('/evidence/:evid_id',AuthCheck,RoleCheck(['admin', 'evaluator']), delEvid)


module.exports = router