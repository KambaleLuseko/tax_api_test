const ClientTaxService = require("./client_tax.service");

const ClientTaxController = {};

ClientTaxController.findAll = async (req, res) => {
    let data = await ClientTaxService.findAll(req.params.value);
    res.status(200).send({ data: data });
}

module.exports = ClientTaxController;