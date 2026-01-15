const { AddEval, listEval, listEvalID, changeEval, delEval } = require('../controllers/evaluations')

const router = require('express').Router()

router.post('/', AddEval)
router.get('/', listEval)
router.get('/detail/:id', listEvalID)
router.put('/:id', changeEval)
router.delete('/:id', delEval)

module.exports = router