const { Op, QueryTypes } = require("sequelize");
const { clients, connexion } = require("../config/dbconfig.provider");
const uuidGenerator = require('../Helpers/uuidGenerator');

const ClientService = {};

ClientService.findAll = async (value) => {
    let condition = {};
    if (value != null) {
        condition = { [Op.or]: { uuid: value, phone: value } };
    }
    let data = await connexion.query(`SELECT clients.*, radius_groups.name radiusName FROM clients LEFT JOIN radius_groups ON radius_groups.uuid=clients.radius_group_uuid`, { type: QueryTypes.SELECT });

    // await clients.findAll(value != null ? { where: condition } : {});
    return data;
}

ClientService.findOne = async (value) => {
    if (!value) {
        return {}
    }
    let data = await connexion.query(`SELECT clients.*, radius_groups.name radiusName FROM clients LEFT JOIN radius_groups ON radius_groups.uuid=clients.radius_group_uuid WHERE clients.uuid=${value}`, { type: QueryTypes.SELECT });
    // console.log(data);
    // await clients.findAll(value != null ? { where: condition } : {});
    try {
        return data[0];
    } catch (error) {
        return null;
    }
}

ClientService.create = async (data) => {

    if (!data.fullname || !data.phone) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let client = {
        "uuid": data.uuid ?? uuidGenerator(),
        "fullname": data.fullname,
        "phone": data.phone,
        "email": data.email,
        "nationalID": data.nationalID,
        "impotID": data.impotID,
        "syncStatus": data.syncStatus || 1,
        "postalCode": data.postalCode,
        "activity": data.activity,
        "radius_group_uuid": data.radius_group_uuid,
    }
    let checkDuplication = await clients.findAll({ where: { [Op.or]: { fullname: data.fullname, phone: data.phone } } });
    if (checkDuplication.length > 0) {
        return { status: 400, data: [], message: "Ce nom ou numéro de téléphone existe dans le système" };
    }
    try {
        let savedData = await clients.create(client);
        return { status: 200, data: savedData, message: "Data saved" };
    } catch (error) {
        return { status: 400, data: [], message: "Error occured while saving data" };
    }

}

ClientService.update = async (data, uuid) => {
    if (!uuid) {
        return { status: 400, data: [], message: "Unable to find requested data" };
    }
    if (!data.fullname || !data.phone) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let client = {
        "fullname": data.fullname,
        "phone": data.phone,
        "email": data.email,
        "nationalID": data.nationalID,
        "impotID": data.impotID,
        "syncStatus": data.syncStatus || 1,
        "postalCode": data.postalCode,
        "activity": data.activity,
        "radius_group_uuid": data.radius_group_uuid,
    }
    let checkDuplication = await clients.findAll({ where: { [Op.and]: { [Op.or]: { fullname: data.fullname, phone: data.phone }, uuid: { [Op.ne]: uuid } }, } });
    if (checkDuplication.length > 0) {
        return { status: 400, data: [], message: "Ce nom ou numéro de téléphone existe dans le système" };

    }
    try {
        let savedData = await clients.update(client, { where: { uuid: uuid } });
        return { status: 200, data: savedData, message: "Data saved" };
    } catch (error) {
        // console.log(error.message);
        return { status: 400, data: [], message: "Error occured while saving data" };
    }

}

ClientService.sync = async (data) => {
    let dataToSave = [];
    if (data.constructor !== Array) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let hasErrors = false;
    for (let index = 0; index < data.length; index++) {
        let client = data[index];
        if (!client.fullname || !client.phone) {
            hasErrors = true;
        }
        let checkDuplication = await clients.findAll({ where: { [Op.or]: { fullname: data.fullname, phone: data.phone } } });
        if (checkDuplication.length > 0) {
            hasErrors = true;
            continue;
        }
        dataToSave.push({
            "uuid": client.uuid ?? uuidGenerator(),
            "fullname": client.fullname,
            "phone": client.phone,
            "email": client.email,
            "nationalID": client.nationalID,
            "impotID": client.impotID,
            "syncStatus": client.syncStatus || 1,
            "postalCode": client.postalCode,
            "activity": client.activity,
            "radius_group_uuid": client.radius_group_uuid,
        });
    }
    if (hasErrors == true) {
        return { status: 400, data: [], message: "Certaines données des clients existent deja et ne peuvent être enregistrées" };
    }
    try {
        await clients.bulkCreate(dataToSave);
        return { status: 200, data: [], message: "Data saved" };
    } catch (error) {
        console.log(error.message);
        return { status: 500, data: [], message: "Error occured" };
    }
}

module.exports = ClientService;