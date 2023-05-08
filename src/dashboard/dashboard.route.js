const DashboardController = require('./dashboard.controller');

const router = require('express').Router();

router.get('/admin', DashboardController.getStats);
router.get('/admin/payments', DashboardController.getPayment);
router.get('/agent/:uuid', DashboardController.getWeeklyData);

module.exports = router;