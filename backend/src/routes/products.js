const router = require('express').Router();
const ctrl = require('../controllers/productController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', auth, requireRole('seller', 'admin'), ctrl.create);
router.put('/:id', auth, requireRole('seller', 'admin'), ctrl.update);
router.delete('/:id', auth, requireRole('seller', 'admin'), ctrl.delete);

module.exports = router;
