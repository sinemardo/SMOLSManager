const Category = require('../models/Category');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');
const appEvents = require('../events/eventEmitter');

exports.getAll = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayName: 1 });
    res.json({ categories });
  } catch (error) {
    next(error);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw new ApiError('Categoría no encontrada', 404);
    }
    res.json({ category });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    const category = new Category(req.body);
    await category.save();
    
    logger.info(Categoría creada: );
    res.status(201).json({ message: 'Categoría creada exitosamente', category });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!category) {
      throw new ApiError('Categoría no encontrada', 404);
    }
    logger.info(Categoría actualizada: );
    res.json({ message: 'Categoría actualizada', category });
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!category) {
      throw new ApiError('Categoría no encontrada', 404);
    }
    logger.info(Categoría desactivada: );
    res.json({ message: 'Categoría desactivada exitosamente' });
  } catch (error) {
    next(error);
  }
};

exports.seed = async (req, res, next) => {
  try {
    const defaultCategories = [
      { name: 'electronics', displayName: 'Electrónica', description: 'Dispositivos y gadgets electrónicos' },
      { name: 'bakery', displayName: 'Repostería', description: 'Pasteles, panes y postres artesanales' },
      { name: 'mechanic', displayName: 'Mecánica', description: 'Servicios y productos mecánicos' },
      { name: 'computation', displayName: 'Computación', description: 'Software, hardware y servicios IT' },
      { name: 'fashion', displayName: 'Moda', description: 'Ropa, accesorios y calzado' },
      { name: 'home', displayName: 'Hogar', description: 'Decoración y artículos para el hogar' },
      { name: 'sports', displayName: 'Deportes', description: 'Equipamiento y ropa deportiva' },
      { name: 'beauty', displayName: 'Belleza', description: 'Cosméticos y cuidado personal' },
      { name: 'food', displayName: 'Alimentación', description: 'Comida y productos gourmet' },
      { name: 'crafts', displayName: 'Artesanías', description: 'Productos hechos a mano' }
    ];

    const categories = await Category.insertMany(defaultCategories, { ordered: false });
    logger.info(${categories.length} categorías seed creadas);
    res.status(201).json({ message: 'Categorías iniciales creadas', categories });
  } catch (error) {
    if (error.code === 11000) {
      return res.json({ message: 'Las categorías ya existen' });
    }
    next(error);
  }
};
