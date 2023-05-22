const { Op } = require("sequelize");
const { infoTaxePayment } = require("../config/dbconfig.provider");

const InfoTaxePaymentService = {};

InfoTaxePaymentService.findAll = async (value) => {
    let condition = {};
    if (value) {
        condition = { [Op.or]: { taxe_id: value } };
    }
    let data = await infoTaxePayment.findAll(value ? { where: condition } : {});
    return data;
}


InfoTaxePaymentService.create = async (data, taxe_id) => {
    if (data.constructor !== Array) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let inputs = [];
    let hasErrors = false;
    for (let index = 0; index < data.length; index++) {
        if ((!data[index].taxe_id && !taxe_id) || !data[index].name || !data[index].value) {
            hasErrors = true;
        }
        inputs.push({
            taxe_id: data[index].taxe_id || taxe_id,
            name: data[index].name,
            value: data[index].value,
        });
    }
    if (hasErrors == true) {
        return { status: 400, data: [], message: "Some of required fields was not submitted" };
    }
    await infoTaxePayment.bulkCreate(inputs);
    return { status: 200, data: [], message: "Data saved" };
}

module.exports = InfoTaxePaymentService;