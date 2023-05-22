const ClosingService = require("./closing.service")

const ClosingController = {}

ClosingController.findAll = async (req, res) => {
    if (req.params.value && req.params.value.toString().toLowerCase() == 'admin') {
        res.status(200).send({ data: await ClosingService.findAllForAdmin(), message: "Success" });
        return;
    }
    res.status(200).send({ data: await ClosingService.findAll(req.params.value), message: "Success" });
}
ClosingController.create = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ data: [], message: "Invalid data submitted" });
        return;
    }
    let response = await ClosingService.create(req.body);
    res.status(response.status).send({ data, message } = response);
}

ClosingController.validate = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ data: [], message: "Invalid data submitted" });
        return;
    }
    let response = await ClosingService.validate(req.body);
    res.status(response.status).send({ data, message } = response);
}

ClosingController.cancel = async (req, res) => {
    if (!req.body) {
        res.status(400).send({ data: [], message: "Invalid data submitted" });
        return;
    }
    let response = await ClosingService.cancel(req.body);
    res.status(response.status).send({ data, message } = response);
}

ClosingController.getClosingData = async (req, res) => {
    // print(req.params);
    if (!req.params.date || !req.params.accountUUID) {
        res.status(400).send({ data: [], message: "Invalid data submitted" });
        return;
    }
    let response = await ClosingService.getClosingData(req.params.date, req.params.accountUUID);
    if (response == null) {
        return res.status(400).send({ data: [], message: "Invalid data submitted" });
    }
    return res.status(200).send({ data: response, message: "Success" });
}

module.exports = ClosingController;