const { AddIndic, ListIndic, changeInc, AddLevels, ListLevels, listLevelID, AddEvidence, delEvid } = require('../controllers/indicators')

const router = require('express').Router()


// indicators
router.post('/', AddIndic)
router.get('/:eval_id', ListIndic)
router.put('/:id', changeInc)

// levels
router.post('/levels/:indic_id', AddLevels)
router.get('/levels/:indic_id', ListLevels)
router.get('/levels/:level_id', listLevelID)

// evidence

// อย่าลืมเอา upload มาใส่
router.post('/evidence/:indic_id', AddEvidence)
router.delete('/evidence/:evid_id', delEvid)


module.exports = router