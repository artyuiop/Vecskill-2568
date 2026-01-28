const { AddOrUpdateAssign, delAssign, AssignDetail, ListAssign } = require('../controllers/assignments')
const { AuthCheck } = require('../middleware/auth')

const router = require('express').Router()

// มอบหมาย
router.post('/', AddOrUpdateAssign)

// แก้ไขมอบหมาย
router.put('/:id', AddOrUpdateAssign)

// ยกเลิกมอบหมาย
router.delete('/:id', delAssign)

// แสดงข้อมูลที่ต้องประเมิน
router.get('/',AuthCheck, ListAssign)



module.exports = router