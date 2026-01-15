const { createUser, listUserID, listUserRole, getDetailMe, changeUser } = require('../controllers/users')
const { AuthCheck } = require('../middleware/auth')

const router = require('express').Router()

router.post('/',AuthCheck, createUser)
router.get('/getUserRole/', listUserRole)
router.get('/:id', listUserID)
router.get('/detail/:id', getDetailMe)
router.put('/:id', changeUser)

module.exports = router