const router = require('express').Router();
const productController = require('../controllers/productController');
const { auth, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { productSchema } = require('../utils/validators');

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Listar productos con filtros
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 20 }
 *     responses:
 *       200: { description: Lista paginada de productos }
 */
router.get('/', productController.getAll);
router.get('/:id', productController.getById);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Crear producto (vendedor)
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', auth, requireRole('seller', 'admin'), validate(productSchema), productController.create);
router.put('/:id', auth, requireRole('seller', 'admin'), validate(productSchema), productController.update);
router.delete('/:id', auth, requireRole('seller', 'admin'), productController.delete);

module.exports = router;
