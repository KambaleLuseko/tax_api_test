const DashboardController = require('./dashboard.controller');

const router = require('express').Router();

router.get('/admin', DashboardController.getStats);
router.get('/agent', DashboardController.getWeeklyData);

module.exports = router;