const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

exports.getAll = async (req, res, next) => {
  try {
    const where = { isActive: true };
    const products = await prisma.product.findMany({
      where,
      include: { category: true, seller: { select: { id: true, name: true, storeName: true } } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ products });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, seller: { select: { id: true, name: true, storeName: true } } }
    });
    if (!product) throw new ApiError('Producto no encontrado', 404);
    res.json({ product });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const product = await prisma.product.create({
      data: { ...req.body, sellerId: req.user.id, images: req.body.images || [] }
    });
    logger.info('Producto creado: ' + product.name);
    res.status(201).json({ message: 'Producto creado', product });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    await prisma.product.updateMany({
      where: { id: req.params.id, sellerId: req.user.id },
      data: req.body
    });
    res.json({ message: 'Producto actualizado' });
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    await prisma.product.updateMany({
      where: { id: req.params.id, sellerId: req.user.id },
      data: { isActive: false }
    });
    res.json({ message: 'Producto desactivado' });
  } catch (error) { next(error); }
};
