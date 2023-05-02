module.exports = (sequelize, Sequelize) => {
    const RecoveryModel = sequelize.define('recoveries', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        taxation_uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        paid_tax_uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: false
        },
        percentage: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        paid_amount: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        due_date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        recovery_uuid: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'Pending'
        },
    });
    return RecoveryModel;
}