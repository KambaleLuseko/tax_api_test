const ExpenseCategoryController = require('./expense_category.controller');

const router = require('express').Router();

router.get('/', ExpenseCategoryController.findAll);
router.get('/:uuid', ExpenseCategoryController.findOne);
router.post('/', ExpenseCategoryController.create);
router.put('/:uuid', ExpenseCategoryController.update);

module.exports = router;