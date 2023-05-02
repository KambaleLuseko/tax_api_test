const OverdueFeesController = require('./overdue_fees.controller')

const router = require('express').Router()


router.get('/:value?', OverdueFeesController.findAll);
router.post('/', OverdueFeesController.create);
router.put('/:uuid', OverdueFeesController.update);

module.exports = router;