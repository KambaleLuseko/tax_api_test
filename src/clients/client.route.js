const router = require('express').Router();
const ClientController = require('./client.controller');


router.get('/', ClientController.findAll);
router.post('/', ClientController.create);
router.post('/sync', ClientController.sync);
router.put('/:uuid', ClientController.update);

module.exports = router;