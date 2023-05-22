const router = require('express').Router();
const ClientTaxController = require('./client_tax.controller');


router.get('/', ClientTaxController.findAll)

module.exports = router;