const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { orderSchema } = require('../utils/validators');

/**
 * @swagger
 * /orders:
 *   get:
 *     tags: [Orders]
 *     summary: Listar órdenes del usuario/seller
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Lista de órdenes }
 */
router.get('/', auth, orderController.getAll);
router.get('/:id', auth, orderController.getById);

/**
 * @swagger
 * /orders:
 *   post:
 *     tags: [Orders]
 *     summary: Crear nueva orden
 *     security: [{ bearerAuth: [] }]
 */
router.post('/', auth, validate(orderSchema), orderController.create);
router.patch('/:id/status', auth, orderController.updateStatus);

module.exports = router;
