const { Op } = require("sequelize");
const { overdueFees } = require("../config/dbconfig.provider");
const uuidGenerator = require('../Helpers/uuidGenerator');

const OverdueFeesService = {};

OverdueFeesService.findAll = async (value) => {
    let condition = {}
    if (value) {
        condition = {
            [Op.or]: {
                tax_uuid: value,
                countCycle: value,
                active: value
            }
        };
    }
    let data = await overdueFees.findAll({ where: condition });
    return data;
}

OverdueFeesService.create = async (data) => {
    if (!data.tax_uuid || !data.countCycle || !data.percentage) {
        return { status: 400, data: [], message: "Invalid overdue fees data submitted" };
    }
    if (!parseInt(data.percentage) || parseInt(data.percentage) <= 0) {
        return { status: 400, data: [], message: "Invalid percentage submitted" };
    }
    if (!parseInt(data.countCycle) || parseInt(data.countCycle) <= 0) {
        return { status: 400, data: [], message: "Invalid cycle count submitted" };
    }
    let overdue = {
        uuid: data.uuid ?? uuidGenerator(),
        name: data.name,
        description: data.description,
        tax_uuid: data.tax_uuid,
        percentage: parseInt(data.percentage),
        countCycle: parseInt(data.countCycle),
        active: data.active ?? 1,
    }
    try {
        let response = await overdueFees.create(overdue);
        return { status: 200, data: response, message: "Data saved successfuly" };
    } catch (error) {
        console.log(error.toString())
        return { status: 500, data: [], message: "Error occured while saving overdue fees data" };
    }
}

OverdueFeesService.update = async (data, uuid) => {
    if (!uuid) {
        return { status: 400, data: [], message: "Unable to find the requested data" };
    }
    if (!data.tax_uuid || !data.countCycle || !data.percentage) {
        return { status: 400, data: [], message: "Invalid overdue fees data submitted" };
    }
    if (!parseInt(data.percentage) || parseInt(data.percentage) <= 0) {
        return { status: 400, data: [], message: "Invalid percentage submitted" };
    }
    if (!parseInt(data.countCycle) || parseInt(data.countCycle) <= 0) {
        return { status: 400, data: [], message: "Invalid cycle count submitted" };
    }
    let overdue = {
        name: data.name,
        description: data.description,
        tax_uuid: data.tax_uuid,
        percentage: parseInt(data.percentage),
        countCycle: parseInt(data.countCycle),
        active: data.active ?? 1,
    }
    try {
        let response = await overdueFees.update(overdue, { where: { uuid: uuid } });
        return { status: 200, data: response, message: "Data updated successfuly" };
    } catch (error) {
        return { status: 500, data: [], message: "Error occured while saving overdue fees data" };
    }
}
module.exports = OverdueFeesService;