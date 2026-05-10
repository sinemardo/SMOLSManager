const router = require('express').Router();
const prisma = require('../utils/prisma');
const os = require('os');
const cache = require('../services/cacheService');

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';
  let dbResponseTime = 0;
  
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbResponseTime = Date.now() - start;
    dbStatus = 'connected';
  } catch (e) {
    dbStatus = 'error';
  }

  res.json({
    status: dbStatus === 'connected' ? 'ok' : 'error',
    timestamp: new Date().toISOString(),
    service: 'SMOLSManager API',
    version: '1.0.0',
    database: {
      status: dbStatus,
      responseTime: dbResponseTime + 'ms'
    },
    system: {
      uptime: Math.floor(process.uptime()) + 's',
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(os.totalmem() / 1024 / 1024) + 'MB'
      },
      cpu: os.cpus().length + ' cores'
    },
    cache: cache.getStats()
  });
});

router.get('/metrics', (req, res) => {
  res.json({
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    cache: cache.getStats()
  });
});

router.post('/cache/clear', (req, res) => {
  cache.clear();
  res.json({ message: 'Cache limpiada' });
});

module.exports = router;
