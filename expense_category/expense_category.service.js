const { Op } = require('sequelize');
const { expenseCategories } = require('../config/dbconfig.provider');
const uuidGenerator = require('../Helpers/uuidGenerator');


const ExpenseCategoryService = {};

ExpenseCategoryService.findAll = async (value) => {
    let condition = {};
    if (value) {
        condition = { [Op.or]: { uuid: value, name: value } };
    }
    let response = await expenseCategories.findAll(value ? { where: condition } : {});
    return response;
}

ExpenseCategoryService.findOne = async (uuid) => {
    if (!uuid) {
        return { status: 404, data: [], message: "Unable to find the requested data" };
    }
    let responseData = await expenseCategories.findOne({ where: { uuid: uuid } });
    return responseData;
}

/**
 * 
 * @param Object data:{uuid, amount, client, taxes}
 * @returns String status
 * @returns String message
 * @returns Array data
 */
ExpenseCategoryService.create = async (data) => {
    let uuid = data.uuid || uuidGenerator();
    if (!data.description || !data.name) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let checkExpense = await expenseCategories.findAll({ where: { name: data.name, } });
    if (checkExpense.length > 0) {
        return { status: 403, data: [], message: "Thix expense category already exists" };
    }
    let dataToSave = {
        uuid: uuid,
        name: data.name,
        description: data.description,
    }
    try {
        let response = await expenseCategories.create(dataToSave);
        return { status: 200, data: response, message: "Data saved" };
    } catch (error) {
        console.log(error.message);
        return { status: 500, data: [], message: "Error occured" };
    }
}

ExpenseCategoryService.update = async (data, uuid) => {
    if (!uuid) {
        return { status: 400, data: [], message: "Nous ne parvenons pas à trouver l'élément recherché" };
    }
    if (!uuid || !data.name) {
        return { status: 400, data: [], message: "Invalid data submitted" };
    }
    let checkExpense = await expenseCategories.findAll({ where: { name: data.name, uuid: { [Op.ne]: uuid } } });
    if (checkExpense.length > 0) {
        return { status: 403, data: [], message: "Thix expense category already exists" };
    }
    let dataToSave = {
        name: data.name,
        description: data.description,
    }
    try {
        let response = await expenseCategories.update(dataToSave, { where: { uuid: uuid } });
        return { status: 200, data: response, message: "Data saved" };
    } catch (error) {
        console.log(error.message);
        return { status: 500, data: [], message: "Error occured" };
    }
}



module.exports = ExpenseCategoryService;