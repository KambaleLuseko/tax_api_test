module.exports = (sequelize, Sequelize) => {
    const InfoTaxePayment = sequelize.define('info_taxe_payment', {
        taxe_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        value: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });
    return InfoTaxePayment;
}