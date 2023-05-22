const ExpenseController = require('./expense.controller')

const router = require('express').Router()


router.get('/:value?', ExpenseController.findAll)
router.post('/', ExpenseController.create)


module.exports = router;