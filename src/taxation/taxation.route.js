const TaxationController = require('./taxation.controller');
const router = require('express').Router();

router.get('/:value?', TaxationController.findAll);
router.get('/:uuid', TaxationController.findOne);
router.post('/', TaxationController.create);
router.post('/sync', TaxationController.sync);

module.exports = router;