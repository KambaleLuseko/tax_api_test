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

    let goodClientStats = await connexion.query(`SELECT MAX(taxations.totalAmount) totalTaxation, (SELECT clients.fullname FROM clients WHERE clients.uuid=taxations.client_uuid) clientName from taxations WHERE (SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid)-taxations.totalAmount=0 GROUP BY taxations.client_uuid LIMIT 5`, { type: QueryTypes.SELECT });

    let badClientStats = await connexion.query(`SELECT MAX(taxations.totalAmount) totalTaxation, (SELECT clients.fullname FROM clients WHERE clients.uuid=taxations.client_uuid) clientName from taxations WHERE taxations.totalAmount>IFNULL((SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid),0)  GROUP BY taxations.client_uuid LIMIT 5`, { type: QueryTypes.SELECT });
    return { weekStats: groupData, goodClients: goodClientStats, badClients: badClientStats }
}


module.exports = AdminDashboardService;