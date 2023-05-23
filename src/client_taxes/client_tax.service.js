const { Op } = require("sequelize");
const { clients_taxes } = require("../config/dbconfig.provider");
const uuidGenerator = require("../Helpers/uuidGenerator");
const TaxService = require("../taxes/tax.service");
const client_taxModel = require("./client_tax.model");
const InfoTaxePaymentService = require('../info_taxe_payment/info_taxe_payment.service');

const ClientTaxService = {};

ClientTaxService.findAll = async (value) => {
    let condition = {};
    if (value) {
        condition = { [Op.or]: { uuid: value, status: value, taxation_uuid: value } };
    }
    let data = await clients_taxes.findAll(value ? { where: condition } : {});
    for (let index = 0; index < data.length; index++) {
        let taxe = await TaxService.findOne(data[index].dataValues.taxe_id);
        data[index].dataValues.taxName = taxe?.name;
        data[index].dataValues.taxDescription = taxe?.description;
    }
    return data;
}

ClientTaxService.create = async (data) => {
    if (!data.taxation_uuid || !data.taxe_id || !data.amountPaid || !data.nextPayment || !data.recoveryDate) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    return { status: 200, data: client_taxModel.create(data), message: 'Data saved' }
}

/**
 * 
 * @param Array data 
 * @returns String status
 * @returns String message
 * @returns Array data
 */
ClientTaxService.saveMultiple = async (data) => {
    let hasErrors = false;
    let saveTaxes = [], taxeInfos = [];
    for (let index = 0; index < data.length; index++) {
        if (!data[index].taxation_uuid || !data[index].taxe_id || !data[index].amountPaid || !data[index].nextPayment || !data[index].recoveryDate) {
            hasErrors = true;
            continue;
        }
        let uuid = data[index].uuid || `${uuidGenerator()}${index}`;
        saveTaxes.push({
            uuid: uuid,
            taxation_uuid: data[index].taxation_uuid,
            taxe_id: data[index].taxe_id,
            amountPaid: data[index].amountPaid,
            nextPayment: data[index].nextPayment,
            recoveryDate: data[index].recoveryDate,
            status: data[index].status,
        });
        // for (let indexInfo = 0; indexInfo < data[index].inputsData.length; indexInfo++) {
        //     taxeInfos.push({
        //         taxe_id: uuid,
        //         name: data[index].inputsData[indexInfo].name,
        //         value: data[index].inputsData[indexInfo].value,
        //     });
        // }
    }
    if (hasErrors == true) {
        return { status: 400, data: [], message: "Invalid tax data submitted" };
    }
    try {
        await clients_taxes.bulkCreate(saveTaxes);
        // await InfoTaxePaymentService.create(taxeInfos);
        return { status: 200, data: [], message: "Data saved" };
    } catch (error) {
        console.log(error.message);
        return { status: 500, data: [], message: "Error occured" };
    }

}

module.exports = ClientTaxService;