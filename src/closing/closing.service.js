const { Op } = require("sequelize")
const { closings } = require("../config/dbconfig.provider")
const uuidGenerator = require("../Helpers/uuidGenerator")
const dateFormator = require('../Helpers/dateFormator')
const AccountService = require("../accounts/account.service")
const PaymentService = require("../payment/payment.service")
const ExpenseService = require("../expenses/expense.service")
const TaxationService = require("../taxation/taxation.service")
const accountModel = require("../accounts/account.model")
const userModel = require("../users/user.model")
const UserService = require("../users/user.service")


const ClosingService = {}

ClosingService.findAll = async (value) => {
    let condition = {}
    if (value) {
        condition = { [Op.or]: { uuid: value, sender_account_uuid: value, receiver_account_uuid: value, status: value, date_send: value } }
    }

    let response = await closings.findAll({
        where: condition
    });
    for (let index = 0; index < response.length; index++) {
        let sender = await UserService.findAll(response[index].dataValues.sender_account_uuid);
        let receiver = await UserService.findAll(response[index].dataValues.receiver_account_uuid);
        response[index].dataValues.sender = sender.length > 0 ? sender[0] : null;
        response[index].dataValues.receiver = receiver.length > 0 ? receiver[0] : null;
    }
    return response;
}

ClosingService.create = async (data) => {
    if (!data.sender_account_uuid || !data.receiver_account_uuid || !data.montant_cloture) {
        return { status: 403, data: [], message: "Invalid data submitted" };
    }
    let closingStatus = await ClosingService.checkAccountClosing(data.sender_account_uuid);
    if (closingStatus == true) {
        return { status: 401, message: "This account is already closed", data: [] };
    }
    if (!parseFloat(data.montant_cloture) || parseFloat(data.montant_cloture) <= 0) {
        return { status: 403, data: [], message: "Invalid amount submitted" };
    }
    let uuid = data.uuid ?? uuidGenerator();
    let checkClosing = await closings.findAll({ where: { uuid: uuid } });
    if (checkClosing.length > 0) {
        return { status: 403, data: [], message: "Closing code error" };
    }

    let closing = {
        uuid: uuid,
        sender_account_uuid: data.sender_account_uuid,
        receiver_account_uuid: data.receiver_account_uuid,
        status: "Pending",
        montant_cloture: data.montant_cloture,

        date_send: dateFormator(),
    }

    try {
        let response = await closings.create(closing);
        return { status: 200, data: response, message: "Success" };
    } catch (error) {
        return { status: 400, data: [], message: "Error while saving closing data" };
    }
}

ClosingService.validate = async (data) => {
    if (!data.montant_recu || !data.uuid) {
        return { status: 403, data: [], message: "Invalid data submitted" };
    }
    if (!parseFloat(data.montant_recu) || parseFloat(data.montant_recu) <= 0) {
        return { status: 403, data: [], message: "Invalid amount submitted" };
    }
    try {
        let checkClosing = await closings.findOne({ where: { uuid: data.uuid } });
        if (!checkClosing) {
            return { status: 403, data: [], message: `Closing code error` };
        }
        if (checkClosing.status.toString().toLowerCase() == 'canceled') {
            return { status: 403, data: [], message: "This transfert has been canceled" };
        }
        if (checkClosing.status.toString().toLowerCase() == 'validated') {
            return { status: 403, data: [], message: "This transfert has been completed" };
        }
        if (parseFloat(data.montant_recu) > parseFloat(checkClosing.montant_cloture)) {
            return { status: 403, data: [], message: "Received amount is great than closing amount" };
        }
        if (parseFloat(data.montant_recu) +
            parseFloat(checkClosing.montant_recu ?? 0) >
            parseFloat(checkClosing.montant_cloture ?? 0)) {
            return { status: 403, data: [], message: "This amount cannot be added to the receiver. Please, send the exact amount remaining" };
        }
        let updateSenderBalance = await AccountService.updateBalance(data.montant_recu, 'expense', checkClosing.sender_account_uuid);
        if (updateSenderBalance.status != 200) {
            return { status: updateSenderBalance.status, message: updateSenderBalance.message, data: updateSenderBalance.data };
        }
        let updateReceiverBalance = await AccountService.updateBalance(data.montant_recu, 'payment', checkClosing.receiver_account_uuid);
        if (updateReceiverBalance.status != 200) {
            return { status: updateReceiverBalance.status, message: updateReceiverBalance.message, data: updateReceiverBalance.data };
        }
        let closingStatus =
            parseFloat(data.montant_recu) +
                parseFloat(checkClosing.montant_recu ?? 0) <
                parseFloat(checkClosing.montant_cloture ?? 0)
                ? 'Ongoing'
                : 'Validated';
        // data.montant_recu = parseFloat(data.montant_recu) + parseFloat(closing.montant_recu);
        checkClosing.montant_recu = parseFloat(data.montant_recu) + parseFloat(checkClosing.montant_recu ?? 0);
        await closings.update({ montant_recu: checkClosing.montant_recu, status: closingStatus, date_received: checkClosing.date_received ?? dateFormator() }, { where: { uuid: data.uuid } });
        return { status: 200, data: data, message: "Success" };
    } catch (error) {
        console.log(error.toString());
        return { status: 400, data: [], message: "Error while saving closing data" };
    }
}

ClosingService.cancel = async (data) => {
    if (!data.uuid) {
        return { status: 403, data: [], message: "Invalid data submitted" };
    }
    try {
        let checkClosing = await closings.findOne({ where: { uuid: data.uuid } });
        if (!checkClosing) {
            return { status: 403, data: [], message: `Closing code error` };
        }
        if (checkClosing.status.toString().toLowerCase() != 'pending') {
            return { status: 403, data: [], message: `This transfer cannot be canceled` };
        }

        await closings.update({ status: 'Canceled', }, { where: { uuid: data.uuid } });
        return { status: 200, data: data, message: "Success" };
    } catch (error) {
        console.log(error.toString());
        return { status: 400, data: [], message: "Error while saving closing data" };
    }
}

/**
 * 
 * @param {*} date 
 * @param {*} accountUUID 
 * @returns 
 */
ClosingService.getClosingData = async (date, accountUUID) => {
    if (!date || date.length < 10) {
        return null;
    }
    if (!accountUUID) return null;
    let validDate = date.length > 10 ? date.substring(0, 10) : date;
    let payments = await PaymentService.filter(validDate, accountUUID);
    let expenses = await ExpenseService.filter(validDate, accountUUID);
    let taxations = await TaxationService.filter(validDate, accountUUID);
    let response = {
        totalPayment: payments.length < 1 ? 0 : payments.map(item => item.totalAmount).reduce((prev, next) => { return parseFloat(prev) + parseFloat(next) }),
        totalExpenses: expenses.length < 1 ? 0 : expenses.map(item => item.amount).reduce((prev, next) => { return parseFloat(prev) + parseFloat(next) }),
        taxations: taxations.length
    }
    return response;
}

ClosingService.checkAccountClosing = async (accountUUID) => {
    // let closing = await closings.findAll({ where: { date_send: { [Op.substring]: dateFormator().toString().substring(0, 10) }, sender_account_uuid: accountUUID } });
    // if (closing.length > 0) {
    //     return true;
    // }
    return false;
}

module.exports = ClosingService;