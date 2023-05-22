const { Op } = require("sequelize");
const { divisions } = require("../config/dbconfig.provider");
const TaxService = require("../taxes/tax.service");
const uuidGenerator = require("../Helpers/uuidGenerator");

let DivisionController = {};

DivisionController.findAll = async (req, res) => {
    let searchValue = req.params.value;
    let condition = {};
    if (searchValue) {
        condition = { [Op.or]: { name: searchValue, id: searchValue } };
    }
    let data = await divisions.findAll(searchValue ? { where: condition } : {});
    for (let index = 0; index < data.length; index++) {
        data[index].dataValues.taxes = await TaxService.findAll(data[index].dataValues.id);
    }
    res.status(200).send({ data: data });
}

DivisionController.find = async (value) => {
    let searchValue = value;
    let condition = {};
    if (searchValue) {
        condition = { [Op.or]: { name: searchValue, id: searchValue } };
    }
    let data = await divisions.findAll(searchValue ? { where: condition } : {});
    for (let index = 0; index < data.length; index++) {
        data[index].dataValues.taxes = await TaxService.findAll(data[index].dataValues.id, false);
    }
    return ({ data: data });
}

DivisionController.create = async (req, res) => {
    let data = req.body;
    if (!data.name) {
        res.status(403).send({ data: [], message: "Invalid data submitted" });
    }
    let checkDuplication = await divisions.findAll({ where: { name: data.name, } });
    if (checkDuplication.length > 0) {
        res.status(400).send({ data: [], message: "Cette division existe dans le système" });
        return;
    }
    let division = {
        uuid: data.uuid ?? uuidGenerator(),
        name: data.name,
        description: data.description
    }
    try {
        let response = await divisions.create(division);
        return res.status(200).send({ data: response, message: "Success" });
    } catch (error) {
        return res.status(400).send({ data: [], message: "Error occured while saving data" });
    }
}

DivisionController.update = async (req, res) => {
    let data = req.body;
    if (!data.name) {
        res.status(403).send({ data: [], message: "Invalid data submitted" });
    }
    if (!req.params.uuid) {
        res.status(404).send({ data: [], message: "Unable to find the requested data" });
    }
    let checkDuplication = await divisions.findAll({ where: { name: data.name, uuid: { [Op.ne]: req.params.uuid } } });
    if (checkDuplication.length > 0) {
        res.status(400).send({ data: [], message: "Cette division existe dans le système" });
        return;
    }
    let division = {
        name: data.name,
        description: data.description,
        active: data.active
    }
    try {
        let response = await divisions.update(division, { where: { uuid: req.params.uuid } });
        return res.status(200).send({ data: response, message: "Success" });
    } catch (error) {
        return res.status(400).send({ data: [], message: "Error occured while saving data" });
    }
}

module.exports = DivisionController;