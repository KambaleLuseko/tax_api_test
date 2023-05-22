const AdminDashboardService = require("./admin_dash.service")
const AgentDashboardService = require("./agent_dash.service")

const DashboardController = {}

DashboardController.getStats = async (req, res) => {
    res.status(200).send({ data: await AdminDashboardService.getWeeklyData(), message: "Success" })
}

DashboardController.getWeeklyData = async (req, res) => {
    if (!req.params.uuid) {
        res.status(400).send({ data: [], message: "Unable to find requested data" });
        return;
    }
    res.status(200).send({ data: await AgentDashboardService.getWeeklyData(req.params.uuid), message: "Success" })
}

DashboardController.getPayment = async (req, res) => {

    res.status(200).send({ data: await AdminDashboardService.getDataPerUser(), message: "Success" })
}

module.exports = DashboardController;