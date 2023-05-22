const { Op, QueryTypes } = require("sequelize");
const { radius_groups, connexion } = require("../config/dbconfig.provider");
const uuidGenerator = require("../Helpers/uuidGenerator");

let RadiusGroupController = {};

RadiusGroupController.findAll = async (req, res) => {
    let searchValue = req.params.value;
    let condition = {};
    if (searchValue) {
        condition = { [Op.or]: { name: searchValue, id: searchValue } };
    }
    let data = await connexion.query(`SELECT radius_groups.*, (SELECT COUNT(*) FROM clients WHERE radius_group_uuid=radius_groups.uuid) clientCount FROM radius_groups`, { type: QueryTypes.SELECT })
    //  await radius_groups.findAll(searchValue ? { where: condition } : {});
    res.status(200).send({ data: data });
}

RadiusGroupController.find = async (value) => {
    let searchValue = value;
    let condition = {};
    if (searchValue) {
        condition = { [Op.or]: { name: searchValue, id: searchValue } };
    }
    let data = await radius_groups.findAll(searchValue ? { where: condition } : {});

    return ({ data: data });
}

RadiusGroupController.create = async (req, res) => {
    let data = req.body;
    if (!data.name) {
        res.status(403).send({ data: [], message: "Invalid data submitted" });
    }
    let checkDuplication = await radius_groups.findAll({ where: { name: data.name, } });
    if (checkDuplication.length > 0) {
        res.status(400).send({ data: [], message: "Ce rayon existe dans le système" });
        return;
    }
    let radius = {
        uuid: data.uuid ?? uuidGenerator(),
        name: data.name,
        description: data.description
    }
    try {
        let response = await radius_groups.create(radius);
        return res.status(200).send({ data: response, message: "Success" });
    } catch (error) {
        return res.status(400).send({ data: [], message: "Error occured while saving data" });
    }
}

RadiusGroupController.update = async (req, res) => {
    let data = req.body;
    if (!data.name) {
        res.status(403).send({ data: [], message: "Invalid data submitted" });
    }
    if (!req.params.uuid) {
        res.status(404).send({ data: [], message: "Unable to find the requested data" });
    }
    let checkDuplication = await radius_groups.findAll({ where: { name: data.name, uuid: { [Op.ne]: req.params.uuid } } });
    if (checkDuplication.length > 0) {
        res.status(400).send({ data: [], message: "Ce rayon existe dans le système" });
        return;
    }
    let radius = {
        name: data.name,
        description: data.description,
        active: data.active
    }
    try {
        let response = await radius_groups.update(radius, { where: { uuid: req.params.uuid } });
        return res.status(200).send({ data: response, message: "Success" });
    } catch (error) {
        return res.status(400).send({ data: [], message: "Error occured while saving data" });
    }
}

module.exports = RadiusGroupController;