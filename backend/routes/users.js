const { createUser, listUserID, listUserRole, getDetailMe, changeUser, deluser } = require('../controllers/users')
const { AuthCheck, RoleCheck } = require('../middleware/auth')

const router = require('express').Router()

// เพิ่มผู้ใช้
router.post('/',AuthCheck,RoleCheck(['admin']), createUser)

// ดูผู้ใช้ตาม Role
router.get('/getUserRole',AuthCheck,RoleCheck(['admin']), listUserRole)

// ดูผู้ใช้ทีละคน
router.get('/:id',AuthCheck,RoleCheck(['admin']), listUserID)

// ดูโปรไฟล์ตัวเอง
router.get('/detail',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), getDetailMe)

// แก้ไขโปรไฟล์์หรือผู้ใช่งาน
router.put('/:id',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), changeUser)

// ลบผู้ใมช้งาน
router.delete('/:id',AuthCheck,RoleCheck(['admin']), deluser)

module.exports = router