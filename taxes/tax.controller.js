const TaxService = require("./tax.service");

let TaxController = {};

TaxController.findAll = async (req, res) => {
    let data = await TaxService.findAll(req.params.value);
    res.status(200).send({ data: data });
}

TaxController.create = async (req, res) => {
    let data = await TaxService.create(req.body);
    res.status(data.status).send({ data, message } = data);
}
TaxController.update = async (req, res) => {
    let data = await TaxService.update(req.body, req.params.id);
    res.status(data.status).send({ data, message } = data);
}


module.exports = TaxController;