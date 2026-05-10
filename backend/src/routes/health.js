const router = require('express').Router();

router.get('/', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SMOLSManager API',
    version: '1.0.0'
  });
});

module.exports = router;
