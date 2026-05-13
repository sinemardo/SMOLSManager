const router = require('express').Router();
const ctrl = require('../controllers/paymentsController');
const { auth } = require('../middleware/auth');

router.post('/create-intent', auth, ctrl.createPaymentIntent);
router.post('/confirm', auth, ctrl.confirmPayment);
router.get('/methods', auth, ctrl.getPaymentMethods);
router.post('/methods', auth, ctrl.addPaymentMethod);
router.put('/methods/:methodId/default', auth, ctrl.setDefaultPaymentMethod);
router.delete('/methods/:methodId', auth, ctrl.deletePaymentMethod);

module.exports = router;
