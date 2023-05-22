const RadiusGroupController = require('./radius_group.controller');

const router = require('express').Router();

router.get('/', RadiusGroupController.findAll);
router.post('/', RadiusGroupController.create);
router.put('/:uuid', RadiusGroupController.update);

module.exports = router;