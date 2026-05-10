const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

exports.getAll = async (req, res, next) => {
  try {
    const { category, seller, search, page = 1, limit = 50 } = req.query;
    const where = { isActive: true };

    if (category) {
      // Buscar categoría ignorando mayúsculas/minúsculas y tildes
      const allCats = await prisma.category.findMany();
      const found = allCats.find(c => 
        c.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
        category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ||
        c.displayName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') === 
        category.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') ||
        c.id === category
      );
      
      if (found) {
        where.categoryId = found.id;
      } else {
        // Si no encuentra, devolver vacío
        return res.json({ products: [], pagination: { page: 1, limit: 50, total: 0, pages: 0 } });
      }
    }
    
    if (seller) where.sellerId = seller;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, seller: { select: { id: true, name: true, storeName: true } } },
        orderBy: { createdAt: 'desc' },
        skip: (parseInt(page) - 1) * parseInt(limit),
        take: parseInt(limit)
      }),
      prisma.product.count({ where })
    ]);

    res.json({ products, pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / parseInt(limit)) } });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { category: true, seller: { select: { id: true, name: true, storeName: true } } }
    });
    if (!product) throw new ApiError('Producto no encontrado', 404);
    
    await prisma.product.update({ where: { id: product.id }, data: { views: { increment: 1 } } });
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
    await prisma.product.updateMany({ where: { id: req.params.id, sellerId: req.user.id }, data: req.body });
    res.json({ message: 'Producto actualizado' });
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    await prisma.product.updateMany({ where: { id: req.params.id, sellerId: req.user.id }, data: { isActive: false } });
    res.json({ message: 'Producto desactivado' });
  } catch (error) { next(error); }
};
