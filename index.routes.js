const router = require('express').Router();

router.use('/clients', require('./clients/client.route'));
router.use('/clients-taxes', require('./client_taxes/client_tax.route'));
router.use('/divisions', require('./division/division.route'));
router.use('/taxes', require('./taxes/tax.route'));
router.use('/taxe-inputs', require('./taxes_inputs/taxe_inputs.route'));
router.use('/taxation', require('./taxation/taxation.route'));
router.use('/users', require('./users/user.route'));
router.use('/payment', require('./payment/payment.route'));
router.use('/expense-categories', require('./expense_category/expense_category.route'));
router.use('/expenses', require('./expenses/expense.route'));
router.use('/accounts', require('./accounts/account.route'));
router.use('/closings', require('./closing/closing.route'));
router.use('/radius-group', require('./radius_group/radius_group.route'));
router.use('/overdue-fees', require('./overduesFees/overdue_fees.route'));
router.use('/stats', require('./dashboard/dashboard.route'));

module.exports = router;