module.exports = (connection, Sequelize) => {
    const TaxModel = connection.define('taxes', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        division_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        },
        description: {
            type: Sequelize.STRING,
            allowNull: true
        },
        montant_du: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        pourcentage: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '0'
        },
        cycle: {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: '30'
        },
        periode: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 15
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
    return TaxModel;
}