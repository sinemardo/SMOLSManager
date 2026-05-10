const alertService = require('../services/alertService');
const logger = require('../config/logger');

function performanceMonitor(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    alertService.checkResponseTime(duration, req.path);
    
    if (res.statusCode >= 500) {
      alertService.trackError({ path: req.path, status: res.statusCode });
    }
    
    logger.info(`${req.method} ${req.path} ${res.statusCode} ${duration}ms`);
  });
  
  next();
}

module.exports = performanceMonitor;
