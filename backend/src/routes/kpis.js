const router = require('express').Router();
const kpiController = require('../controllers/kpiController');
const { auth } = require('../middleware/auth');

/**
 * @swagger
 * /kpis/dashboard:
 *   get:
 *     tags: [KPIs]
 *     summary: Obtener KPIs del dashboard
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Datos del dashboard }
 */
router.get('/dashboard', auth, kpiController.getDashboard);
router.get('/funnel', auth, kpiController.getFunnel);

module.exports = router;
