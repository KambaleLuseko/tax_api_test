const TaxationService = require("./taxation.service");

const TaxationController = {};

TaxationController.findAll = async (req, res) => {
    res.status(200).send({ data: await TaxationService.findAll(req.params.value) });
}

/**
 * 
 * @returns String status
 * @returns String message
 * @returns Array data
 */
TaxationController.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ data: [], message: "Invalid data submitted" });

    }
    let response = await TaxationService.create(req.body);
    res.status(response.status).send({ data, message } = response);
}

TaxationController.findOne = async (req, res) => {
    if (!req.params.uuid) {
        return res.status(404).send({ data: [], message: "Unable to find the requested data" });
    }
    let response = await TaxationService.findOne(req.params.uuid);
    res.status(200).send({ data: response });
}

TaxationController.sync = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ data: [], message: "Invalid data submitted" });

    }
    let response = await TaxationService.sync(req.body.data);
    res.status(response.status).send({ data, message } = response);
}

module.exports = TaxationController;