const {  ListIndic, AddLevels, ListLevels, AddEvidence, changeLevels, delEvid, AddOrUpdateIndic } = require('../controllers/indicators')
const { AuthCheck, RoleCheck } = require('../middleware/auth')
const router = require('express').Router()


// indicators
router.post('/',AuthCheck,RoleCheck(['admin']), AddOrUpdateIndic)
router.get('/:eval_id',AuthCheck,RoleCheck(['admin', 'evaluator', 'evaluatee']), ListIndic)
router.put('/:id',AuthCheck,RoleCheck(['admin']), AddOrUpdateIndic)

// levels
router.post('/levels/:indic_id',AuthCheck,RoleCheck(['admin']), AddLevels)
router.get('/levels/:indic_id',AuthCheck,RoleCheck(['admin', 'evaluatee', 'evaluator']), ListLevels)
router.put('/levels/:indic_id',AuthCheck,RoleCheck(['admin']), changeLevels)

// evidence

// อย่าลืมเอา upload มาใส่
router.post('/evidence/:indic_id',AuthCheck,RoleCheck(['admin', 'evaluator']), AddEvidence)
router.delete('/evidence/:evid_id',AuthCheck,RoleCheck(['admin', 'evaluator']), delEvid)


module.exports = router