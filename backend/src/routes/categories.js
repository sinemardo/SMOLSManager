const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { auth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { categorySchema } = require('../utils/validators');

/**
 * @swagger
 * /categories:
 *   get:
 *     tags: [Categories]
 *     summary: Obtener todas las categorías activas
 *     responses:
 *       200: { description: Lista de categorías }
 */
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     summary: Crear nueva categoría (admin)
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', auth, requireRole('admin'), validate(categorySchema), categoryController.create);
router.put('/:id', auth, requireRole('admin'), validate(categorySchema), categoryController.update);
router.delete('/:id', auth, requireRole('admin'), categoryController.delete);
router.post('/seed', auth, requireRole('admin'), categoryController.seed);

module.exports = router;
