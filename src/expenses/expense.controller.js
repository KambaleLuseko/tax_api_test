const ExpenseService = require("./expense.service")


const ExpenseController = {}

ExpenseController.findAll = async (req, res) => {
    let response = await ExpenseService.findAll(req.params.value);
    res.status(200).send({ data: response, message: 'Success' });
}

ExpenseController.create = async (req, res) => {
    let response = await ExpenseService.create(req.body);
    res.status(response.status).send({ data, message } = response);
}

module.exports = ExpenseController;