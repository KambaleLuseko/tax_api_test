const OverdueFeesService = require('./overdue_fees.service');
const OverdueFeesController = {}

OverdueFeesController.findAll = async (req, res) => {
    res.status(200).send({ data: await OverdueFeesService.findAll(req.params.value), message: "Success" });
}

OverdueFeesController.create = async (req, res) => {
    let response = await OverdueFeesService.create(req.body);
    res.status(response.status).send({ data, message } = response);
}
OverdueFeesController.update = async (req, res) => {
    if (!req.params.uuid) {
        res.status(400).send({ data: [], message: "Unable to find requested data" });
    }
    let response = await OverdueFeesService.update(req.body, req.params.uuid);
    res.status(response.status).send({ data, message } = response);
}

module.exports = OverdueFeesController;