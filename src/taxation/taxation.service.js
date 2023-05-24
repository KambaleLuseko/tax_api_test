const { Op, QueryTypes } = require('sequelize');
const ClientService = require('../clients/client.service');
const ClientTaxService = require('../client_taxes/client_tax.service');
const { taxations, connexion } = require('../config/dbconfig.provider');
const TaxationService = {};
const uuidGenerator = require('../Helpers/uuidGenerator');
const PaymentService = require('../payment/payment.service');
const checkAccountStatus = require('../Helpers/checkAccountStatus');

TaxationService.findAll = async (value) => {
    let condition = {};
    if (value) {
        condition = { [Op.or]: { uuid: value, status: value, client_uuid: value, accountUUID: value } };
    }
    let taxationsData = await taxations.findAll(value ? { where: condition } : {});
    for (let index = 0; index < taxationsData.length; index++) {
        let clients = await ClientService.findOne(taxationsData[index].dataValues.client_uuid);
        // let payments = await PaymentService.findAll(taxationsData[index].dataValues.uuid);
        // taxationsData[index].dataValues.payments = payments;
        taxationsData[index].dataValues.client = clients;
        // taxationsData[index].dataValues.taxes = await ClientTaxService.findAll(taxationsData[index].dataValues.uuid);
    }
    return taxationsData;
}

TaxationService.findByClient = async (value) => {
    let condition = {};
    if (value) {
        condition = { [Op.or]: { uuid: value, status: value, client_uuid: value, accountUUID: value } };
    }
    let taxationsData = await taxations.findAll(value ? { where: condition } : {});
    for (let index = 0; index < taxationsData.length; index++) {
        // let clients = await ClientService.findAll(taxationsData[index].dataValues.client_uuid);
        let payments = await PaymentService.findAll(taxationsData[index].dataValues.uuid);
        taxationsData[index].dataValues.payments = payments;
        // taxationsData[index].dataValues.client = clients[0];
        taxationsData[index].dataValues.taxes = await ClientTaxService.findAll(taxationsData[index].dataValues.uuid);
    }
    return taxationsData;
}

TaxationService.clientDebt = async (value) => {
    let taxationsData = await connexion.query(`SELECT taxations.*, IFNULL((SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid),0) totalPayment from taxations WHERE taxations.totalAmount>IFNULL((SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid),0) AND taxations.client_uuid='${value}'`, { type: QueryTypes.SELECT });
    for (let index = 0; index < taxationsData.length; index++) {
        // let clients = await ClientService.findAll(taxationsData[index].dataValues.client_uuid);
        let payments = await PaymentService.findAll(taxationsData[index].uuid);
        taxationsData[index].payments = payments;
        // taxationsData[index].dataValues.client = clients[0];
        taxationsData[index].taxes = await ClientTaxService.findAll(taxationsData[index].uuid);
    }
    return taxationsData;
}

TaxationService.filter = async (value, accountUUID) => {
    let condition = {};
    if (value && accountUUID) {
        condition = { [Op.or]: { uuid: value, status: value, client_uuid: value, accountUUID: accountUUID, createdAt: { [Op.substring]: value } } };
    } else {
        return []
    }
    let taxationsData = await taxations.findAll(value ? { where: condition } : {});
    return taxationsData;
}

TaxationService.findOne = async (uuid) => {
    if (!uuid) {
        return { status: 404, data: [], message: "Unable to find the requested data" };
    }
    let taxationsData = await taxations.findOne({ where: { uuid: uuid } });
    if (taxationsData) {
        let clients = await ClientService.findOne(taxationsData.dataValues.client_uuid);
        let payments = await PaymentService.findAll(taxationsData.dataValues.uuid);
        taxationsData.dataValues.client = clients;
        taxationsData.dataValues.taxes = await ClientTaxService.findAll(taxationsData.dataValues.uuid);
        taxationsData.dataValues.payments = payments;
    }
    return taxationsData ?? {};
}

/**
 * 
 * @param Object data:{uuid, amount, client, taxes}
 * @returns String status
 * @returns String message
 * @returns Array data
 */
TaxationService.create = async (data) => {
    let uuid = data.uuid || uuidGenerator();
    let client = data.client;
    let taxes = data.taxes;
    let payments = data.payments ?? [];
    if (!client || !client.uuid || !data.totalAmount || !data.accountUUID) {
        return { status: 400, data: [], message: "Invalid declaration data submitted" };
    }
    let closing = await checkAccountStatus(data.accountUUID);
    if (closing == false) {
        return { status: 401, message: "Ce compte n'existe pas dans le système ou il a été désactivé", data: [] };
    }
    let saveTaxation = {
        accountUUID: data.accountUUID,
        uuid: uuid,
        client_uuid: client.uuid,
        totalAmount: data.totalAmount,
        status: 'Pending',
    }
    let hasErrors = false;
    let saveTaxes = [], savePayments = [];
    for (let index = 0; index < taxes.length; index++) {
        if (!taxes[index].taxe_id || !taxes[index].amountPaid || !taxes[index].nextPayment) {
            hasErrors = true;
            continue;
        }
        saveTaxes.push({
            taxation_uuid: uuid,
            taxe_id: taxes[index].taxe_id,
            amountPaid: taxes[index].amountPaid,
            nextPayment: taxes[index].nextPayment,
            recoveryDate: taxes[index].recoveryDate,
            status: taxes[index].status,
        });
    }
    for (let index = 0; index < payments.length; index++) {
        if (!payments[index].totalAmount || !payments[index].type) {
            hasErrors = true;
            continue;
        }
        savePayments.push({
            uuid: payments[index].uuid ?? uuidGenerator(),
            taxation_uuid: uuid,
            totalAmount: payments[index].totalAmount,
            type: payments[index].type,
            accountUUID: data.accountUUID,
        });
    }
    if (hasErrors == true) {
        return { status: 400, data: [], message: "Invalid payment or tax data submitted" };
    }
    try {
        await taxations.create(saveTaxation);
        await ClientTaxService.saveMultiple(saveTaxes);
        for (let index = 0; index < savePayments.length; index++) {
            await PaymentService.create(savePayments[index]);
        }
        return { status: 200, data: [], message: "Data saved" };
    } catch (error) {
        console.log(error.message);
        return { status: 500, data: [], message: "Error occured while saving declaration data" };
    }
}

TaxationService.sync = async (data) => {
    let taxationToSave = [];
    let taxesToSave = [], savePayments = [];
    if (data.constructor !== Array) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let hasErrors = false;

    for (let index = 0; index < data.length; index++) {
        let client = data[index].client;
        let uuid = data[index].uuid ?? uuidGenerator();
        if (!client.uuid || !data[index].totalAmount) {
            hasErrors = true;
        }
        let closing = await checkAccountStatus(data.accountUUID);
        if (closing == true) {
            return { status: 401, message: "This account is already closed", data: [] };
        }
        taxationToSave.push({
            accountUUID: data[index].accountUUID,
            uuid: uuid,
            client_uuid: client.uuid,
            totalAmount: data[index].totalAmount,
            status: data[index].status ?? 'Pending',
        })
        let taxes = data[index].taxes;
        let payments = data[index].payments ?? [];
        for (let taxIndex = 0; taxIndex < taxes.length; taxIndex++) {
            if (!taxes[taxIndex].taxe_id || !taxes[taxIndex].amountPaid) {
                hasErrors = true;
                continue;
            }
            taxesToSave.push({
                taxation_uuid: uuid,
                taxe_id: taxes[taxIndex].taxe_id,
                amountPaid: taxes[taxIndex].amountPaid,
                nextPayment: taxes[taxIndex].nextPayment,
                recoveryDate: taxes[taxIndex].recoveryDate,
                status: taxes[taxIndex].status || 'Pending',
                // inputsData: taxes[index].inputsData
            });
        }
        for (let paymentIndex = 0; paymentIndex < payments.length; paymentIndex++) {
            if (!payments[paymentIndex].totalAmount || !payments[paymentIndex].type) {
                hasErrors = true;
                continue;
            }
            savePayments.push({
                uuid: payments[paymentIndex].uuid ?? uuidGenerator(),
                taxation_uuid: uuid,
                totalAmount: payments[paymentIndex].totalAmount,
                type: payments[paymentIndex].type,
                accountUUID: data[paymentIndex].accountUUID,
            });
        }
    }
    if (hasErrors == true) {
        return { status: 400, data: [], message: "Some submitted data are invalid" };
    }
    try {
        await taxations.bulkCreate(taxationToSave);
        console.log('taxation saved');
        await ClientTaxService.saveMultiple(taxesToSave);
        console.log('taxes saved');
        for (let index = 0; index < savePayments.length; index++) {
            await PaymentService.create(savePayments[index]);
        }
        console.log('payments saved');
        return { status: 200, data: [], message: "Data saved" };
    } catch (error) {
        console.log(error.message);
        return { status: 500, data: [], message: "Error occured" };
    }
}

module.exports = TaxationService;