const AccountService = require("./account.service")

const AccountController = {}

AccountController.findAll = async (req, res) => {
    res.status(200).send({ data: await AccountService.findAll(req.params.value) });
}

AccountController.create = async (req, res) => {
    let response = await AccountService.create(req.body);
    res.status(response.status).send({ data, message } = response);
}

module.exports = AccountController;