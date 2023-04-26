const { Op } = require("sequelize");
const { expenses } = require('../config/dbconfig.provider');
const AccountService = require("../accounts/account.service");
const ExpenseCategoryService = require('../expense_category/expense_category.service');
const checkAccountStatus = require('../Helpers/checkAccountStatus');

const ExpenseService = {};

ExpenseService.findAll = async (value) => {
    let condition = {}
    if (value) {
        condition = { [Op.or]: { expense_category_uuid: value, account_uuid: value, createdAt: { [Op.substring]: value } } };
    }

    let response = await expenses.findAll({ where: condition });
    for (let index = 0; index < response.length; index++) {
        let category = await ExpenseCategoryService.findAll(response[index].dataValues.expense_category_uuid);
        response[index].dataValues.categoryName = category[0].name;
        response[index].dataValues.categoryDescription = category[0].description;
    }
    return response;
}

ExpenseService.filter = async (date, accountUUID) => {
    let condition = { account_uuid: accountUUID, createdAt: { [Op.substring]: date } };
    if (!date && !accountUUID) {
        return []
    }

    let response = await expenses.findAll({ where: condition });
    for (let index = 0; index < response.length; index++) {
        let category = await ExpenseCategoryService.findAll(response[index].dataValues.expense_category_uuid);
        response[index].dataValues.categoryName = category[0].name;
        response[index].dataValues.categoryDescription = category[0].description;
    }
    return response;
}

ExpenseService.create = async (data) => {

    if (!data.expense_category_uuid || !data.amount || !data.account_uuid) {
        return { status: 403, data: [], message: "Invalid data submitted" };
    }
    let expense = {
        expense_category_uuid: data.expense_category_uuid,
        amount: data.amount,
        account_uuid: data.account_uuid,
        motif: data.motif ?? 'RAS',
    }
    try {
        let closing = await checkAccountStatus(data.account_uuid);
        if (closing == true) {
            return { status: 401, message: "This account is already closed", data: [] };
        }
        let updateAccount = await AccountService.updateBalance(data.amount, 'expense', data.account_uuid);
        if (updateAccount.status != 200) {
            return { status: updateAccount.status, message: updateAccount.message, data: updateAccount.data };
        }
        let response = await expenses.create(expense);
        return { status: 200, data: response, message: "Success" };
    } catch (error) {
        console.log(error.message);
        return { status: 400, data: [], message: "Error occured while saving data" };
    }
}

module.exports = ExpenseService;