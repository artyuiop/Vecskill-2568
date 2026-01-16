const { createUser, listUserID, listUserRole, getDetailMe, changeUser } = require('../controllers/users')
const { AuthCheck, RoleCheck } = require('../middleware/auth')

const router = require('express').Router()

router.post('/',AuthCheck,RoleCheck(['admin']), createUser)
router.get('/getUserRole',AuthCheck,RoleCheck(['admin']), listUserRole)
router.get('/:id',AuthCheck,RoleCheck(['admin']), listUserID)
router.get('/detail',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), getDetailMe)
router.put('/:id',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), changeUser)

module.exports = router