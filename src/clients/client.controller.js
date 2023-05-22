
const ClientService = require("./client.service");

const ClientController = {};

ClientController.findAll = async (req, res) => {
    let data = await ClientService.findAll(req.params.value);
    res.status(200).send({ data: data });
}

ClientController.create = async (req, res) => {
    let result = await ClientService.create(req.body);
    res.status(result.status).send({ data, message } = result);
}
ClientController.update = async (req, res) => {
    let result = await ClientService.update(req.body, req.params.uuid);
    res.status(result.status).send({ data, message } = result);
}

ClientController.sync = async (req, res) => {
    let result = await ClientService.sync(req.body.data);
    res.status(result.status).send({ data, message } = result);
}

module.exports = ClientController;