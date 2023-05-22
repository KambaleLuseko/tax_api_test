module.exports = (sequelize, Sequelize) => {
    let UserModel = sequelize.define('users', {
        fullname: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        level: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'guichetier'
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        division_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        radius_group_uuid: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });
    return UserModel;
}