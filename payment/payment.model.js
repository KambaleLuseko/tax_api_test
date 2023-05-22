module.exports = (connection, Sequelize) => {
    const PaymentModel = connection.define('payments', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        taxation_uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        totalAmount: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'taxe'
        },
        syncStatus: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
        accountUUID: {
            type: Sequelize.STRING,
            allowNull: false,
        }
    });
    return PaymentModel;
}