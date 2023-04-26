const ClosingController = require('./closing.controller');

const router = require('express').Router();

router.get('/:value?', ClosingController.findAll)
router.post('/', ClosingController.create)
router.post('/validate', ClosingController.validate)
router.post('/cancel', ClosingController.cancel)
router.get('/closing-data/:date/:accountUUID', ClosingController.getClosingData)

module.exports = router;