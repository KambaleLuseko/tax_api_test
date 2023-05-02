const { QueryTypes } = require('sequelize');
const { connexion } = require('../config/dbconfig.provider')
const AgentDashboardService = {}
AgentDashboardService.getWeeklyData = async (accountUUID) => {
    let weeklyStats = await connexion.query(`SELECT SUBSTR(taxations.createdAt, 1,10) date, taxations.totalAmount totalTaxation,(SELECT SUM(payments.totalAmount) FROM payments WHERE payments.taxation_uuid=taxations.uuid) totalPayment from taxations WHERE createdAt BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) AND NOW() AND taxations.accountUUID='20230425120800112'`, { type: QueryTypes.SELECT });
    let groupData = [];

    const dates = [...Array(7)].map((_, i) => {
        const d = new Date()
        d.setDate(d.getDate() - i)
        groupData.push({ "date": d.toISOString().substring(0, 10), payments: weeklyStats.filter(item => item.date.substring(0, 10) == d.toISOString().substring(0, 10)).map(item => !parseFloat(item.totalPayment) ? 0 : parseFloat(item.totalPayment)).reduce((prev, next) => { return prev + next }, 0), declarations: weeklyStats.filter(item => item.date.substring(0, 10) == d.toISOString().substring(0, 10)).map(item => !parseFloat(item.totalTaxation) ? 0 : parseFloat(item.totalTaxation)).reduce((prev, next) => { return prev + next }, 0) });
        return d.toISOString().substring(0, 10)
    })
    return { weekStats: groupData }
}


module.exports = AgentDashboardService;