const { register, login } = require('../controllers/auth')
const { EvaluationCheck } = require('../middleware/evalCheck')

const router = require('express').Router()

router.post('/register/:eval_id',EvaluationCheck, register)
router.post('/login', login)

module.exports = router