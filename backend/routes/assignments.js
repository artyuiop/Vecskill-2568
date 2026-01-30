const { AddOrUpdateAssign, delAssign, AssignDetail, ListAssign } = require('../controllers/assignments')
const { AuthCheck, RoleCheck } = require('../middleware/auth')


const router = require('express').Router()

// มอบหมาย
router.post('/', AuthCheck,RoleCheck(['admin']),AddOrUpdateAssign)

// แก้ไขมอบหมาย
router.put('/:id',AuthCheck,RoleCheck(['admin']), AddOrUpdateAssign)

// ยกเลิกมอบหมาย
router.delete('/:id',AuthCheck,RoleCheck(['admin']), delAssign)

// แสดงข้อมูลที่ต้องประเมิน
router.get('/',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), ListAssign)



module.exports = router