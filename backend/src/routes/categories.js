const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { auth, requireRole } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', auth, requireRole('admin'), ctrl.create);
router.put('/:id', auth, requireRole('admin'), ctrl.update);
router.delete('/:id', auth, requireRole('admin'), ctrl.delete);
router.post('/seed', auth, requireRole('admin'), ctrl.seed);

module.exports = router;
