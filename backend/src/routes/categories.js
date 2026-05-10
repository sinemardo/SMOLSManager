const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const { auth, requireRole } = require('../middleware/auth');
const cacheMiddleware = require('../middleware/cache');

router.get('/', cacheMiddleware(600), ctrl.getAll);
router.get('/:id', cacheMiddleware(300), ctrl.getById);
router.post('/', auth, requireRole('admin'), ctrl.create);
router.put('/:id', auth, requireRole('admin'), ctrl.update);
router.delete('/:id', auth, requireRole('admin'), ctrl.delete);
router.post('/seed', auth, requireRole('admin'), ctrl.seed);

module.exports = router;
