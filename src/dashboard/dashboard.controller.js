const AdminDashboardService = require("./admin_dash.service")
const AgentDashboardService = require("./agent_dash.service")

const DashboardController = {}

DashboardController.getStats = async (req, res) => {
    res.status(200).send({ data: await AdminDashboardService.getWeeklyData(), message: "Success" })
}

DashboardController.getWeeklyData = async (req, res) => {
    res.status(200).send({ data: await AgentDashboardService.getWeeklyData(), message: "Success" })
}

module.exports = DashboardController;