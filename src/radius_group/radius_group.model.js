module.exports = (connection, Sequelize) => {
    const RadiusGroupModel = connection.define('radius_groups', {
        uuid: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
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
        active: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 1
        },
    });
    return RadiusGroupModel;
}