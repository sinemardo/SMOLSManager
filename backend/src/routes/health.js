const router = require('express').Router();
const prisma = require('../utils/prisma');

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'error';
  }

  res.json({
    status: dbStatus === 'connected' ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    service: 'SMOLSManager API',
    version: '1.0.0',
    database: dbStatus,
    uptime: process.uptime(),
    memory: process.memoryUsage().heapUsed / 1024 / 1024
  });
});

module.exports = router;
