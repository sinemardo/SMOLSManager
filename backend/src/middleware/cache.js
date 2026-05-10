const cache = require('../services/cacheService');
const logger = require('../config/logger');

function cacheMiddleware(ttlSeconds = 300) {
  return (req, res, next) => {
    // Solo cachear GET
    if (req.method !== 'GET') return next();
    
    const key = req.originalUrl;
    const cached = cache.get(key);
    
    if (cached) {
      logger.info('Cache HIT: ' + key);
      return res.json(cached);
    }
    
    logger.info('Cache MISS: ' + key);
    
    // Interceptar res.json para guardar en caché
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      cache.set(key, body, ttlSeconds);
      originalJson(body);
    };
    
    next();
  };
}

module.exports = cacheMiddleware;
