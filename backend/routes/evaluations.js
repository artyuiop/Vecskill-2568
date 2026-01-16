const { AddEval, listEval, listEvalID, changeEval, delEval } = require('../controllers/evaluations')
const { AuthCheck, RoleCheck } = require('../middleware/auth')
const router = require('express').Router()

router.post('/',AuthCheck,RoleCheck(['admin']), AddEval)
router.get('/',AuthCheck,RoleCheck(['admin', 'evaluator', 'evaluatee']), listEval)
router.get('/detail/:id',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), listEvalID)
router.put('/:id',AuthCheck,RoleCheck(['admin']), changeEval)
router.delete('/:id',AuthCheck,RoleCheck(['admin']), delEval)

module.exports = router