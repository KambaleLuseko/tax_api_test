const TaxationController = require('./taxation.controller');
const router = require('express').Router();

router.get('/:value?', TaxationController.findAll);
router.get('/find-one/:uuid', TaxationController.findOne);
router.get('/find-by-client/:uuid', TaxationController.findByClient);
router.post('/', TaxationController.create);
router.post('/sync', TaxationController.sync);

module.exports = router;