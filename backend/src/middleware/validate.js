const logger = require('../config/logger');

const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));
      
      logger.warn('Error de validación:', { errors });
      return res.status(400).json({ message: 'Datos inválidos', errors });
    }
    
    next();
  };
};

module.exports = validate;
