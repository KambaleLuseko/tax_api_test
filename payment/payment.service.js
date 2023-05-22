const { Op } = require("sequelize");
const uuidGenerator = require("../Helpers/uuidGenerator");
const { payments, taxations } = require("../config/dbconfig.provider");
const AccountService = require('../accounts/account.service');
const checkAccountStatus = require("../Helpers/checkAccountStatus");
const TaxationService = require("../taxation/taxation.service");

const PaymentService = {}

PaymentService.create = async (data) => {
    if (!data.taxation_uuid || !data.totalAmount || !data.accountUUID) {
        return { status: 400, data: [], message: "Invalid payment data submitted" };
    }
    if (data.totalAmount <= 0) {
        return { status: 400, data: [], message: "Invalid amount" };
    }
    try {
        let closing = await checkAccountStatus(data.accountUUID);
        if (closing == false) {
            return { status: 401, message: "Ce compte n'existe pas dans le système ou il a été désactivé", data: [] };
        }
        if (data.uuid) {
            let checkPayment = await payments.findAll({ where: { uuid: data.uuid } });
            if (checkPayment.length > 0) {
                return { status: 400, message: "Payment code error", data: [] };
            }
        }
        let checkDeclaraton = await taxations.findOne({ where: { uuid: data.taxation_uuid } });
        if (!checkDeclaraton && checkDeclaraton.status.toString().toLowerCase() == 'completed') {
            return { status: 400, message: "The declaration was closed", data: [] };
        }

        let totalPayments = await payments.findAll({ where: { taxation_uuid: data.taxation_uuid } });
        let totalPaid = totalPayments.map(item => item.totalAmount).reduce((prev, next) => { return parseFloat(prev) + parseFloat(next) }, 0);
        if ((totalPaid + parseFloat(data.totalAmount)) > checkDeclaraton.totalAmount) {
            return { status: 400, message: "The amount sent cannot be saved because it's great than the remaining amount", data: [] };
        }
        let addAmount = await AccountService.updateBalance(data.totalAmount, 'payment', data.accountUUID);
        if (addAmount.status != 200) {
            return { status: addAmount.status, message: addAmount.message, data: addAmount.data };
        }
        if ((totalPaid + parseFloat(data.totalAmount)) == checkDeclaraton.totalAmount) {
            taxations.update({ status: 'Completed' }, { where: { uuid: checkDeclaraton.uuid } });
        }
        let savedData = await payments.create({
            "uuid": data.uuid ?? uuidGenerator(),
            "taxation_uuid": data.taxation_uuid,
            "accountUUID": data.accountUUID,
            "totalAmount": data.totalAmount,
            "type": data.type ?? "taxe",
        });

        return { status: 200, message: "Payment saved", data: savedData }
    } catch (error) {
        console.log(error.message);
        return { status: 400, data: [], message: "Error occured while saving payment" };
    }
}

PaymentService.findAll = async (value) => {
    let condition = {};
    if (value != null) {
        condition = { [Op.or]: { taxation_uuid: value, accountUUID: value, createdAt: { [Op.substring]: value } } }
    }

    let data = await payments.findAll(value != null ? { where: condition } : {});
    return data
}
/**
 * 
 * @param {*} date 
 * @param {*} accountUUID 
 * @returns 
 */
PaymentService.filter = async (date, accountUUID) => {
    let condition = {};
    if (date && accountUUID) {
        condition = { accountUUID: accountUUID, createdAt: { [Op.substring]: date } }
    } else {
        return []
    }

    let data = await payments.findAll({ where: condition });
    return data
}

module.exports = PaymentService;