const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayName: 'asc' },
      include: { _count: { select: { products: true } } }
    });
    res.json({ categories });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  try {
    const category = await prisma.category.findUnique({ where: { id: req.params.id } });
    if (!category) throw new ApiError('Categoria no encontrada', 404);
    res.json({ category });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const category = await prisma.category.create({ data: req.body });
    logger.info('Categoria creada: ' + category.displayName);
    res.status(201).json({ message: 'Categoria creada', category });
  } catch (error) { next(error); }
};

exports.update = async (req, res, next) => {
  try {
    const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
    res.json({ message: 'Categoria actualizada', category });
  } catch (error) { next(error); }
};

exports.delete = async (req, res, next) => {
  try {
    await prisma.category.update({ where: { id: req.params.id }, data: { isActive: false } });
    res.json({ message: 'Categoria desactivada' });
  } catch (error) { next(error); }
};

exports.seed = async (req, res, next) => {
  try {
    const cats = [
      { name: 'electronics', displayName: 'Electronica' },
      { name: 'bakery', displayName: 'Reposteria' },
      { name: 'mechanic', displayName: 'Mecanica' },
      { name: 'computation', displayName: 'Computacion' },
      { name: 'fashion', displayName: 'Moda' },
      { name: 'home', displayName: 'Hogar' },
      { name: 'sports', displayName: 'Deportes' },
      { name: 'beauty', displayName: 'Belleza' },
      { name: 'food', displayName: 'Alimentacion' },
      { name: 'crafts', displayName: 'Artesanias' }
    ];
    for (const cat of cats) {
      await prisma.category.upsert({ where: { name: cat.name }, update: {}, create: cat });
    }
    res.json({ message: 'Categorias creadas' });
  } catch (error) { next(error); }
};
