const jwt = require('jsonwebtoken');
const prisma = require('../utils/prisma');
const logger = require('../config/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Token no proporcionado' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) return res.status(401).json({ message: 'Usuario no encontrado' });

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth error:', error);
    res.status(401).json({ message: 'Token invalido' });
  }
};

const requireRole = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: 'No autorizado' });
  next();
};

module.exports = { auth, requireRole };
