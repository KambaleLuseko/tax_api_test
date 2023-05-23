const TaxController = require('./tax.controller');
const router = require('express').Router();

router.get('/:value?', TaxController.findAll);
router.get('/find-one/:value', TaxController.findOne);
router.post('/', TaxController.create);
router.put('/:id', TaxController.update);

module.exports = router;