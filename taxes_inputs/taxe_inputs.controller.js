const TaxeInputsService = require("./taxe_inputs.service");

const TaxeInputsController = {};

TaxeInputsController.findAll = async (req, res) => {
    let data = await TaxeInputsService.findAll(req.params.value);
    res.status(200).send({ data: data, message: "Success" });
}

TaxeInputsController.create = async (req, res) => {
    let data = await TaxeInputsService.create(req.body.data);
    res.status(data.status).send({ data, message } = data);
}

module.exports = TaxeInputsController;