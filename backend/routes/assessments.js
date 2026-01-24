const { giveScore, getIndicatorProgress } = require('../controllers/assessments')
const { AuthCheck } = require('../middleware/auth')

const router = require('express').Router()

router.post('/give-score/:assign_id',AuthCheck, giveScore)
router.get('/getIndicatorProgress/:assign_id', getIndicatorProgress)

module.exports = router