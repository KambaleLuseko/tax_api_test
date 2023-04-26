module.exports = (sequelize, Sequelize) => {
    const AccountModel = sequelize.define('accounts', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        user_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        sold: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '0'
        },
        currency: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "FC"
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
    });
    return AccountModel;
}