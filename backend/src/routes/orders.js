const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const { auth } = require('../middleware/auth');

router.get('/', auth, ctrl.getAll);
router.post('/', auth, ctrl.create);

module.exports = router;
