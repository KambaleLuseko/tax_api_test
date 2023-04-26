module.exports = (sequelize, Sequelize) => {
    const clientModel = sequelize.define('clients', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        fullname: {
            type: Sequelize.STRING,
            allowNull: false
        },
        phone: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        email: {
            type: Sequelize.STRING,
            allowNull: true,
            unique: true
        },
        nationalID: {
            type: Sequelize.STRING,
            allowNull: true
        },
        impotID: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        postalCode: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        syncStatus: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
    });
    return clientModel;
}