const AccountController = require('./account.controller');


const router = require('express').Router();

router.get('/:value?', AccountController.findAll)
router.post('/', AccountController.create)

module.exports = router;