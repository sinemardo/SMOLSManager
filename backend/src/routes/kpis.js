const router = require('express').Router();
const ctrl = require('../controllers/kpiController');
const { auth } = require('../middleware/auth');

router.get('/dashboard', auth, ctrl.getDashboard);
router.get('/funnel', auth, ctrl.getFunnel);

module.exports = router;
