const { QueryTypes } = require('sequelize');
const { connexion } = require('../config/dbconfig.provider');
const AdminDashboardService = {}


AdminDashboardService.getWeeklyData = async (value) => {
    let weeklyStats = await connexion.query(`SELECT SUBSTR(taxations.createdAt, 1,10) date, taxations.totalAmount totalTaxation,(SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid) totalPayment from taxations WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW()`, { type: QueryTypes.SELECT });
    let groupData = [];

    const dates = [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        groupData.push({ "date": d.toISOString().substring(0, 10), payments: weeklyStats.filter(item => item.date.substring(0, 10) == d.toISOString().substring(0, 10)).map(item => !parseFloat(item.totalPayment) ? 0 : parseFloat(item.totalPayment)).reduce((prev, next) => { return prev + next }, 0), declarations: weeklyStats.filter(item => item.date.substring(0, 10) == d.toISOString().substring(0, 10)).map(item => !parseFloat(item.totalTaxation) ? 0 : parseFloat(item.totalTaxation)).reduce((prev, next) => { return prev + next }, 0) });
        return d.toISOString().substring(0, 10)
    })

    let goodClientStats = await connexion.query(`SELECT MAX(taxations.totalAmount) totalTaxation, (SELECT clients.fullname FROM clients WHERE clients.uuid=taxations.client_uuid) clientName from taxations WHERE (SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid)-taxations.totalAmount=0 GROUP BY taxations.client_uuid LIMIT 10`, { type: QueryTypes.SELECT });

    let badClientStats = await connexion.query(`SELECT MAX(taxations.totalAmount) totalTaxation, (SELECT clients.fullname FROM clients WHERE clients.uuid=taxations.client_uuid) clientName from taxations WHERE taxations.totalAmount>IFNULL((SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid),0)  GROUP BY taxations.client_uuid LIMIT 10`, { type: QueryTypes.SELECT });
    return { weekStats: groupData, goodClients: goodClientStats, badClients: badClientStats }
}

AdminDashboardService.getDataPerUser = async (value) => {
    let groupedData = [];
    let divisionData = [];
    let dataPerUser = await connexion.query(`SELECT SUM(taxations.totalAmount) totalTaxation, (SELECT users.fullname FROM users INNER JOIN accounts ON accounts.user_id=users.id WHERE accounts.uuid=taxations.accountUUID) username,(SELECT SUM(payments.totalAmount) FROM payments WHERE payments.accountUUID=taxations.accountUUID AND SUBSTR(payments.createdAt, 1,10)=SUBSTR(NOW(), 1,10)) totalPayment from taxations INNER JOIN accounts on accounts.uuid=taxations.accountUUID INNER JOIN users ON users.id=accounts.user_id WHERE SUBSTR(taxations.createdAt, 1,10)=SUBSTR(NOW(), 1,10) GROUP BY taxations.accountUUID, users.fullname`, { type: QueryTypes.SELECT });
    let dataPerDivision = await connexion.query(`SELECT divisions.id,divisions.name divisionName, (SELECT COALESCE(SUM(payments.totalAmount),0) FROM payments WHERE payments.accountUUID=(accounts.uuid) AND SUBSTR(payments.createdAt, 1,10)=SUBSTR(NOW(), 1,10)) totalPayment,(SELECT COALESCE(SUM(taxations.totalAmount),0) FROM taxations WHERE taxations.accountUUID=ANY_VALUE(accounts.uuid) AND SUBSTR(taxations.createdAt, 1,10)=SUBSTR(NOW(), 1,10)) totalTaxation FROM divisions LEFT JOIN users ON users.division_id=divisions.id LEFT JOIN accounts ON accounts.user_id=users.id GROUP BY divisions.id, accounts.uuid`, { type: QueryTypes.SELECT });
    divisionData = Array.from(new Set(dataPerDivision.map(item => item.id)));
    for (let index = 0; index < divisionData.length; index++) {
        groupedData.push(
            {
                division: divisionData[index],
                divisionName: dataPerDivision.find(item => item.id == divisionData[index]).divisionName,
                payments: dataPerDivision.filter(item => item.id == divisionData[index]).map(item => parseFloat(item.totalPayment)).reduce((prev, next) => { return prev + next }, 0),
                declarations: dataPerDivision.filter(item => item.id == divisionData[index]).map(item => parseFloat(item.totalTaxation)).reduce((prev, next) => { return prev + next }, 0)
            }
        )
    }
    return { userStats: dataPerUser, divisionStats: groupedData }
}


module.exports = AdminDashboardService;