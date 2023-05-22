const { Op } = require("sequelize");
const { accounts } = require("../config/dbconfig.provider");
const uuidGenerator = require("../Helpers/uuidGenerator");
const checkAccountStatus = require("../Helpers/checkAccountStatus");

const AccountService = {};

AccountService.findAll = async (value) => {
    let condition = {};
    if (value) {
        condition = { [Op.or]: { user_id: value, currency: value, uuid: value }, }
    }

    let response = await accounts.findAll({ where: condition });
    return response;
}

AccountService.create = async (data) => {
    if (!data.user_id) {
        return { status: 403, data: [], message: "Invalid data submitted" };
    }
    let checkExpense = await accounts.findAll({ where: { user_id: data.user_id, currency: data.currency ?? "FC" } });
    if (checkExpense.length > 0) {
        return { status: 403, data: [], message: "This account already exists" };
    }
    let account = {
        uuid: data.uuid ?? uuidGenerator(),
        user_id: data.user_id,
        sold: data.sold ?? '0',
        currency: data.currency ?? "FC",
    }
    try {
        let response = await accounts.create(account);
        return { status: 200, data: response, message: "Success" };
    } catch (error) {
        return { status: 400, data: [], message: "Error occured while saving data" };
    }
}


/**
 * 
 * @param {*} amount 
 * @param {*} transaction 
 * @param {*} id 
 */


AccountService.updateBalance = async (amount, transaction, id) => {
    let closing = await checkAccountStatus(id);
    if (closing == false) {
        return { status: 401, message: "Ce compte n'existe pas dans le système ou il a été désactivé", data: [] };
    }
    if (!amount || !transaction || !id) {
        return { status: 401, data: [], message: 'Invalid account data submitted' };
    }
    if (!parseFloat(amount) || parseFloat(amount) <= 0) {
        return { status: 401, data: [], message: 'Invalid amount submitted' };
    }
    if (transaction.toLowerCase() != 'payment' && transaction.toLowerCase() != 'expense') {
        return { status: 401, data: [], message: 'Invalid transaction' };
    }
    let account = await accounts.findOne({ where: { [Op.or]: { id: id, uuid: id } } });
    if (!account) {
        return { status: 404, data: [], message: 'Unable to find your account' };
    }
    let sold = 0.0;
    if (transaction.toLowerCase() == 'payment') {
        sold = parseFloat(account.sold) + parseFloat(amount);
    } else if (transaction.toLowerCase() == 'expense') {
        if ((parseFloat(account.sold) - parseFloat(amount)) < 0) {
            return { status: 401, data: [], message: 'The transaction amount is great than the account balance' };
        }
        sold = parseFloat(account.sold) - parseFloat(amount);
    }
    try {
        accounts.update({ sold: sold.toString() }, { where: { [Op.or]: { id: id, uuid: id } } });
        return { status: 200, data: account, message: 'Transaction saved' };
    } catch (error) {
        return { status: 400, data: [], message: 'Error occured while updating balance' };
    }

}

AccountService.checkAccount = async (accountUUID) => {
    let closing = await accounts.findOne({ where: { uuid: accountUUID, active: 1 } });
    if (closing) {
        return true;
    }
    return false;
}

module.exports = AccountService;