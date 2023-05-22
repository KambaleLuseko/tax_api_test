module.exports = (sequelize, Sequelize) => {
    const clientTaxModel = sequelize.define('client_taxes_paid', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        taxation_uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        taxe_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amountPaid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        nextPayment: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'Constatation'
        },
        recoveryDate: {
            type: Sequelize.STRING,
            allowNull: false,
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
    return clientTaxModel;
}