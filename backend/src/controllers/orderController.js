const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

exports.getAll = async (req, res, next) => {
  try {
    const where = req.user.role === 'seller' ? { sellerId: req.user.id } : { buyerId: req.user.id };
    const orders = await prisma.order.findMany({ where, include: { items: { include: { product: true } } } });
    res.json({ orders });
  } catch (error) { next(error); }
};

exports.create = async (req, res, next) => {
  try {
    const { products: items, shippingAddress, notes } = req.body;
    const productIds = items.map(i => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds }, isActive: true } });

    if (products.length !== items.length) throw new ApiError('Productos no disponibles', 400);

    const sellerId = products[0].sellerId;
    let totalAmount = 0;
    const orderItems = products.map(p => {
      const item = items.find(i => i.productId === p.id);
      totalAmount += p.price * item.quantity;
      return { productId: p.id, quantity: item.quantity, price: p.price };
    });

    const order = await prisma.order.create({
      data: { buyerId: req.user.id, sellerId, totalAmount, shippingAddress: shippingAddress || {}, notes, items: { create: orderItems } }
    });

    logger.info('Orden creada: ' + order.id);
    res.status(201).json({ message: 'Orden creada', order });
  } catch (error) { next(error); }
};
