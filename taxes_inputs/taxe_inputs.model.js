module.exports = (sequelize, Sequelize) => {
    const TaxInputModel = sequelize.define('taxe_inputs', {
        taxe_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        type: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: 'String'
        },
        required: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
    });
    return TaxInputModel;
}