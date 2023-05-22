const { QueryTypes, Op } = require('sequelize');
const { connexion, users, accounts } = require('../config/dbconfig.provider')
const divisionService = require('../division/division.controller');
const AccountService = require('../accounts/account.service');

const UserService = {};

UserService.findAll = async (value) => {
    let response
    if (value && value.length > 1) {
        response = await connexion.query(`SELECT users.*, accounts.uuid accountUUID, divisions.name divisionName, radius_groups.name radiusName FROM users LEFT JOIN accounts ON accounts.user_id=users.id LEFT JOIN divisions ON divisions.id=users.division_id LEFT JOIN radius_groups ON radius_groups.uuid=users.radius_group_uuid WHERE users.active=1 AND (fullname='${value}' OR accounts.uuid='${value}')`, { type: QueryTypes.SELECT });
    } else {
        response = await connexion.query(`SELECT users.*, accounts.uuid accountUUID, divisions.name divisionName, radius_groups.name radiusName FROM users LEFT JOIN accounts ON accounts.user_id=users.id LEFT JOIN divisions ON divisions.id=users.division_id LEFT JOIN radius_groups ON radius_groups.uuid=users.radius_group_uuid`, { type: QueryTypes.SELECT });
    }
    return response;
}

UserService.login = async (data) => {
    let response = await connexion.query(`SELECT users.*, radius_groups.name radiusName FROM users LEFT JOIN radius_groups ON radius_groups.uuid=users.radius_group_uuid WHERE username='${data.username}' AND password='${data.password}' AND users.active=1`, { type: QueryTypes.SELECT });
    if (response) {
        if (response.length == 1) {
            let division = null;
            if (response[0].division_id) {
                division = await divisionService.find(response[0].division_id);
            }

            let accounts = await AccountService.findAll(response[0].id);
            let user = {
                ...response[0],
                division: division == null ? {} : division.data.length > 0 ? division.data[0] : {},
                accounts: accounts ?? []
            }
            return { status: 200, data: user, message: 'User exists' };
        }
        return { status: 401, data: {}, message: 'Username ou mot de passe incorrect' };
    }
    return { status: 403, data: {}, message: 'Aucune correspondance' };
}

UserService.create = async (data) => {
    if (!data.fullname || !data.username || !data.password || !data.level || !data.phone) {
        return { status: 403, data: {}, message: 'Invalid data submitted' };
    }
    let checkUser = await users.findAll({ where: { [Op.or]: { username: data.username, phone: data.phone } } });
    if (checkUser.length > 0) {
        return { status: 401, data: {}, message: 'The email or phone number is already used' };
    }
    let user = {
        fullname: data.fullname,
        phone: data.phone,
        username: data.username,
        password: data.password,
        level: data.level,
        active: data.active,
        division_id: data.division_id,
        radius_group_uuid: data.radius_group_uuid,
    }
    try {
        let response = await users.create(user)
        AccountService.create({ user_id: response.id });
        return { status: 200, data: response, message: 'Success' };
    } catch (error) {
        return { status: 400, data: {}, message: 'Error occured while processing data' };
    }
}

UserService.update = async (data, id) => {
    if (!id) {
        return { status: 404, data: {}, message: 'Unable to find the requested data' };
    }
    if (!data.fullname || !data.username || !data.password || !data.level || !data.phone) {
        return { status: 403, data: {}, message: 'Invalid data submitted' };
    }
    let checkUser = await users.findAll({ where: { [Op.or]: { username: data.username, phone: data.phone }, [Op.and]: { id: { [Op.ne]: id } } } });
    if (checkUser.length > 0) {
        return { status: 401, data: {}, message: 'The email or phone number is already used' };
    }
    let user = {
        fullname: data.fullname,
        phone: data.phone,
        username: data.username,
        // password: data.password,
        level: data.level,
        active: data.active,
        division_id: data.division_id,
        radius_group_uuid: data.radius_group_uuid,
    }
    try {
        let response = await users.update(user, { where: { id: id } })
        let account = await accounts.update({ active: data.active }, { where: { user_id: id } })
        return { status: 200, data: response, message: 'Success' };
    } catch (error) {
        return { status: 400, data: {}, message: 'Error occured while processing data' };
    }
}

UserService.updatePassword = async (data, id) => {
    if (!id) {
        return { status: 404, data: {}, message: 'Unable to find the requested data' };
    }
    if (!data.oldPassword || !data.newPassword) {
        return { status: 403, data: {}, message: 'Invalid data submitted' };
    }
    if (data.oldPassword == data.newPassword) {
        return { status: 403, data: {}, message: 'Choisissez un mot de passe différent de l\'ancien mot de passe' };
    }
    try {
        let response = await users.update({ password: data.newPassword }, { where: { id: id } })
        return { status: 200, data: response, message: 'Success' };
    } catch (error) {
        return { status: 400, data: {}, message: 'Error occured while processing data' };
    }
}

module.exports = UserService;