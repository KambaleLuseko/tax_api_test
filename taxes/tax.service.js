const { Op } = require("sequelize");
const { taxes } = require("../config/dbconfig.provider");
const TaxeInputsService = require("../taxes_inputs/taxe_inputs.service");
const uuidGenerator = require("../Helpers/uuidGenerator");

let TaxService = {};

TaxService.findAll = async (value, getSpecs = true) => {
    let searchValue = value;
    let condition = {};
    if (searchValue) {
        condition = { [Op.or]: { name: searchValue, division_id: searchValue, uuid: searchValue } };
    }
    let data = await taxes.findAll(value ? { where: condition } : {});
    // let data = await divisions.findAll(searchValue ? { where: condition } : {});
    // if (getSpecs.toString() == 'true') {
    //     for (let index = 0; index < data.length; index++) {
    //         data[index].dataValues.inputs = await TaxeInputsService.findAll(data[index].dataValues.id);
    //     }
    // }

    return data;
}

TaxService.create = async (data) => {
    if (!data.division_id || !data.name || !data.cycle || !data.periode) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    if ((!data.montant_du && !data.pourcentage) || (parseFloat(data.montant_du.toString()) <= 0 && parseFloat(data.pourcentage.toString()) <= 0)) {
        return { status: 400, data: [], message: "Please, specify either amount or percentage" };
    }
    let checkTaxe = await taxes.findAll({ where: { name: data.name, division_id: data.division_id } });
    if (checkTaxe.length > 0) {
        return { status: 403, data: [], message: "Thix tax already exists" };
    }
    let tax = {
        uuid: data.uuid ?? uuidGenerator(),
        division_id: data.division_id,
        name: data.name,
        description: data.description,
        montant_du: data.montant_du,
        pourcentage: data.pourcentage,
        cycle: data.cycle,
        periode: data.periode,
    }
    try {
        let response = await taxes.create(tax);
        return { status: 200, data: response, message: "success" };
    } catch (error) {
        return { status: 400, data: [], message: "Error occured while saving data" };
    }
}

TaxService.update = async (data, id) => {
    if (!id) {
        return { status: 404, data: [], message: "Unable to find the target data" };
    }
    if (!data.division_id || !data.name || !data.cycle || !data.periode || !data.name) {
        return { status: 403, data: [], message: "Invalid data submitted" };
    }

    if ((!data.montant_du && !data.pourcentage) || (parseFloat(data.montant_du.toString()) <= 0 && parseFloat(data.pourcentage.toString()) <= 0)) {
        return { status: 403, data: [], message: "Please, specify either amount or percentage" };
    }
    let checkDuplication = await taxes.findAll({ where: { name: data.name, id: { [Op.ne]: id } } });
    if (checkDuplication.length > 0) {
        return { status: 403, data: [], message: "Cette taxe existe déjà dans le système" };
    }
    let tax = {
        division_id: data.division_id,
        name: data.name,
        description: data.description,
        montant_du: data.montant_du,
        pourcentage: data.pourcentage,
        cycle: data.cycle,
        periode: data.periode,
        acive: data.active,
    }
    try {
        let response = await taxes.update(tax, { where: { id: id } });
        return { status: 200, data: response, message: "success" };
    } catch (error) {
        return { status: 400, data: [], message: "Error occured while saving data" };
    }

}

module.exports = TaxService;