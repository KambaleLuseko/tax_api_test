const DivisionController = require('./division.controller');
const router = require('express').Router();

router.get('/', DivisionController.findAll);
router.post('/', DivisionController.create);
router.put('/', DivisionController.update);

module.exports = router;