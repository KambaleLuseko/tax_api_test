module.exports = (sequelize, Sequelize) => {
    const ExpenseCategoryModel = sequelize.define('expense_categories', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
    });
    return ExpenseCategoryModel;
}