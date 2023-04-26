const PaymentController = require('./payment.controller');

const router = require('express').Router();

router.get('/:value?', PaymentController.findAll);
router.post('/', PaymentController.create);

module.exports = router;