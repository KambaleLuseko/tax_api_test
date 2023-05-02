module.exports = (sequelize, Sequelize) => {
    const OverdueFeesModel = sequelize.define('overdue_fees', {
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
            allowNull: true
        },
        tax_uuid: {
            type: Sequelize.STRING,
            allowNull: false
        },
        percentage: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        countCycle: {
            type: Sequelize.INTEGER,
            allowNull: false,
            comment: "Cycle count is in days"
        },
        active: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
    });
    return OverdueFeesModel;
}