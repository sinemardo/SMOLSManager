const router = require('express').Router();
const ctrl = require('../controllers/paymentsController');
const { auth } = require('../middleware/auth');

router.post('/create-intent', auth, ctrl.createPaymentIntent);
router.post('/confirm', auth, ctrl.confirmPayment);
router.get('/methods', auth, ctrl.getPaymentMethods);

module.exports = router;
