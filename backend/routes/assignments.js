const { AddOrUpdateAssign, delAssign, AssignDetail, ListAssign } = require('../controllers/assignments')
const { AuthCheck } = require('../middleware/auth')

const router = require('express').Router()

router.post('/', AddOrUpdateAssign)
router.put('/:id', AddOrUpdateAssign)
router.delete('/:id', delAssign)
router.get('/',AuthCheck, ListAssign)

module.exports = router