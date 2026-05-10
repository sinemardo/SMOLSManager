const router = require('express').Router();
const mongoose = require('mongoose');

/**
 * @swagger
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Verificar estado del servidor
 *     responses:
 *       200: { description: Servidor saludable }
 */
router.get('/', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStates = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SMOLSManager API',
    version: '1.0.0',
    database: dbStates[dbState],
    uptime: process.uptime()
  });
});

module.exports = router;
