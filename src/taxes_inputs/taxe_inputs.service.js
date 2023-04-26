const { Op } = require("sequelize");
const { taxeInputs } = require("../config/dbconfig.provider");

const TaxeInputsService = {};

TaxeInputsService.findAll = async (value) => {
    let searchValue = value;
    let condition = {};
    if (searchValue) {
        condition = { [Op.or]: { name: searchValue, taxe_id: searchValue } };
    }
    let data = await taxeInputs.findAll(value ? { where: condition } : {});
    return data;
}

TaxeInputsService.create = async (data, taxe_id) => {
    if (data.constructor !== Array) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let inputs = [];
    let hasErrors = false;
    for (let index = 0; index < data.length; index++) {
        if ((!data[index].taxe_id && !taxe_id) || !data[index].name) {
            hasErrors = true;
        }
        inputs.push({
            taxe_id: data[index].taxe_id || taxe_id,
            name: data[index].name,
            type: data[index].type ?? 'String',
            required: data[index].required ?? 1,
        });
    }
    if (hasErrors == true) {
        return { status: 400, data: [], message: "Some of required fields was not submitted" };
    }
    await taxeInputs.bulkCreate(inputs);
    return { status: 200, data: [], message: "Data saved" };
}

module.exports = TaxeInputsService;