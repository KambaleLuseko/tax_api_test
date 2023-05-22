module.exports = (sequelize, Sequelize) => {
    const ExpenseModel = sequelize.define('expenses', {
        expense_category_uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount: {
            type: Sequelize.STRING,
            allowNull: false
        },
        account_uuid: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        motif: {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: 'RAS'
        },

    });
    return ExpenseModel;
}