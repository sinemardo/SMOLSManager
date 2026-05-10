const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');
const appEvents = require('../events/eventEmitter');
const ApiError = require('../utils/ApiError');

const generateTokens = async (userId) => {
  const accessToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
  );
  
  const refreshToken = jwt.sign(
    { userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
  );

  return { accessToken, refreshToken };
};

exports.register = async (req, res, next) => {
  try {
    const { email, password, name, storeName, categoryId } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new ApiError('El email ya está registrado', 400);
    }

    const user = new User({
      email,
      password,
      name,
      storeName,
      category: categoryId || null,
      role: storeName ? 'seller' : 'user'
    });

    await user.save();

    const tokens = await generateTokens(user._id);
    user.refreshTokens.push({
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    appEvents.emitEvent('user:registered', user._id, {}, { source: req.get('X-Client-Type') || 'web' });
    logger.info(Nuevo usuario registrado: );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: user.toPublicProfile(),
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new ApiError('Credenciales inválidas', 401);
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new ApiError('Credenciales inválidas', 401);
    }

    const tokens = await generateTokens(user._id);
    user.refreshTokens.push({
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    appEvents.emitEvent('user:login', user._id, {}, { source: req.get('X-Client-Type') || 'web' });
    logger.info(Usuario logueado: );

    res.json({
      message: 'Login exitoso',
      user: user.toPublicProfile(),
      ...tokens
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || !user.refreshTokens.find(rt => rt.token === refreshToken)) {
      throw new ApiError('Refresh token inválido', 401);
    }

    user.refreshTokens = user.refreshTokens.filter(rt => rt.token !== refreshToken);
    const tokens = await generateTokens(user._id);
    user.refreshTokens.push({
      token: tokens.refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    });
    await user.save();

    res.json(tokens);
  } catch (error) {
    next(new ApiError('Refresh token inválido o expirado', 401));
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    req.user.refreshTokens = req.user.refreshTokens.filter(rt => rt.token !== refreshToken);
    await req.user.save();
    res.json({ message: 'Sesión cerrada exitosamente' });
  } catch (error) {
    next(error);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user.toPublicProfile() });
};
