const TaxeInputsController = require('./taxe_inputs.controller');

const router = require('express').Router();

router.get('/', TaxeInputsController.findAll);
router.post('/', TaxeInputsController.create);

module.exports = router;