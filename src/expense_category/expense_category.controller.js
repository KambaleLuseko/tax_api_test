const ExpenseCategoryService = require("./expense_category.service");

const ExpenseCategoryController = {};

ExpenseCategoryController.findAll = async (req, res) => {
    res.status(200).send({ data: await ExpenseCategoryService.findAll(req.params.value) });
}

/**
 * 
 * @returns String status
 * @returns String message
 * @returns Array data
 */
ExpenseCategoryController.create = async (req, res) => {
    if (!req.body) {
        return res.status(400).send({ data: [], message: "Invalid data submitted" });
    }
    let response = await ExpenseCategoryService.create(req.body);
    res.status(response.status).send({ data, message } = response);
}

ExpenseCategoryController.findOne = async (req, res) => {
    if (!req.params.uuid) {
        return res.status(400).send({ data: [], message: "Invalid data submitted" });
    }
    let response = await ExpenseCategoryService.findOne(req.params.uuid);
    res.status(response.status).send({ data, message } = response);
}

module.exports = ExpenseCategoryController;