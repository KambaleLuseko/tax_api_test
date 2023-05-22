module.exports = (sequelize, Sequelize) => {
    const ClosingModel = sequelize.define('closings', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        sender_account_uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        receiver_account_uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        montant_cloture: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        montant_recu: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        date_send: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        date_received: {
            type: Sequelize.STRING,
            allowNull: true,
        },
    });

    return ClosingModel;
}