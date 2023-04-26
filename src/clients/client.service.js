const { Op } = require("sequelize");
const { clients } = require("../config/dbconfig.provider");
const uuidGenerator = require('../Helpers/uuidGenerator');

const ClientService = {};

ClientService.findAll = async (value) => {
    let condition = {};
    if (value != null) {
        condition = { [Op.or]: { uuid: value, phone: value } };
    }
    let data = await clients.findAll(value != null ? { where: condition } : {});
    return data;
}

ClientService.create = async (data) => {
    let client = {
        "uuid": data.uuid ?? uuidGenerator(),
        "fullname": data.fullname,
        "phone": data.phone,
        "email": data.email,
        "nationalID": data.nationalID,
        "impotID": data.impotID,
        "syncStatus": data.syncStatus || 1,
        "postalCode": data.postalCode,
    }
    if (!client.fullname || !client.phone) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    try {
        let savedData = await clients.create(client);
        return { status: 200, data: savedData, message: "Data saved" };
    } catch (error) {
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
        dataToSave.push({
            "uuid": client.uuid ?? uuidGenerator(),
            "fullname": client.fullname,
            "phone": client.phone,
            "email": client.email,
            "nationalID": client.nationalID,
            "impotID": client.impotID,
            "syncStatus": client.syncStatus || 1,
            "postalCode": client.postalCode,
        });
    }
    if (hasErrors == true) {
        return { status: 400, data: [], message: "Some submitted data are invalid" };
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