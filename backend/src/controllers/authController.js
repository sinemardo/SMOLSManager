const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const generateTokens = async (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1h' });
  const refreshToken = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' });
  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, storeName, categoryId } = req.body;
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) throw new ApiError('El email ya esta registrado', 400);

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, name, storeName, categoryId: categoryId || null, role: storeName ? 'seller' : 'user' }
    });

    const tokens = await generateTokens(user.id);
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), userId: user.id }
    });

    await prisma.event.create({
      data: { type: 'user:registered', userId: user.id, metadata: { source: req.get('X-Client-Type') || 'web' } }
    });

    logger.info('Usuario registrado: ' + user.email);
    res.status(201).json({ message: 'Usuario registrado exitosamente', user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens });
  } catch (error) { next(error); }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new ApiError('Credenciales invalidas', 401);

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new ApiError('Credenciales invalidas', 401);

    const tokens = await generateTokens(user.id);
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), userId: user.id }
    });

    await prisma.event.create({
      data: { type: 'user:login', userId: user.id, metadata: { source: req.get('X-Client-Type') || 'web' } }
    });

    logger.info('Login: ' + user.email);
    res.json({ message: 'Login exitoso', user: { id: user.id, email: user.email, name: user.name, role: user.role }, ...tokens });
  } catch (error) { next(error); }
};

exports.me = async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id }, include: { category: true } });
  const { password, ...userWithoutPassword } = user;
  res.json({ user: userWithoutPassword });
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const stored = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
    if (!stored || stored.userId !== decoded.userId) throw new ApiError('Token invalido', 401);

    await prisma.refreshToken.delete({ where: { id: stored.id } });
    const tokens = await generateTokens(decoded.userId);
    await prisma.refreshToken.create({
      data: { token: tokens.refreshToken, expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), userId: decoded.userId }
    });
    res.json(tokens);
  } catch (error) { next(new ApiError('Refresh token invalido', 401)); }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    await prisma.refreshToken.deleteMany({ where: { token: refreshToken, userId: req.user.id } });
    res.json({ message: 'Sesion cerrada' });
  } catch (error) { next(error); }
};
