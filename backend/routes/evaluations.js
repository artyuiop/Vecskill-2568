const { AddEval, listEval, listEvalID, changeEval, delEval } = require('../controllers/evaluations')
const { AuthCheck, RoleCheck } = require('../middleware/auth')
const router = require('express').Router()


// เพิ่มรอบประเมิน
router.post('/',AuthCheck,RoleCheck(['admin']), AddEval)

// ดูทุกรอบประเมิน
router.get('/',AuthCheck,RoleCheck(['admin', 'evaluator', 'evaluatee']), listEval)

// ดูรรอบระเมินทีละอัน
router.get('/detail/:id',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), listEvalID)

// แก้ไขรอบการประเมิน
router.put('/:id',AuthCheck,RoleCheck(['admin']), changeEval)

// ลบรอบการประเมิน
router.delete('/:id',AuthCheck,RoleCheck(['admin']), delEval)

module.exports = router