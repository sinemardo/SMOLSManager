const prisma = require('../utils/prisma');
const ApiError = require('../utils/ApiError');
const logger = require('../config/logger');

exports.getAll = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    
    // Filtro por usuario
    if (req.user.role === 'seller') {
      where.sellerId = req.user.id;
    } else {
      where.buyerId = req.user.id;
    }
    
    // Filtro por estado (opcional)
    if (status && status !== 'all') {
      where.status = status;
    }

    const orders = await prisma.order.findMany({
      where,
      include: {
        items: {
          include: {
            product: {
              select: { name: true, images: true }
            }
          }
        },
        buyer: { select: { name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json({ orders });
  } catch (error) { next(error); }
};

exports.getById = async (req, res, next) => {
  // ... igual que antes (detalle de orden)
};

exports.create = async (req, res, next) => {
  // ... igual que antes
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await prisma.order.findUnique({ where: { id: req.params.id } });

    if (!order) throw new ApiError('Orden no encontrada', 404);

    // Validar transiciones de estado permitidas
    const validTransitions = {
      'pending': ['confirmed', 'cancelled'],
      'confirmed': ['shipped', 'cancelled'],
      'shipped': ['delivered'],
      'delivered': ['returned'],
      'cancelled': [],
      'returned': []
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new ApiError('Transición de estado no permitida', 400);
    }

    const updated = await prisma.order.update({
      where: { id: req.params.id },
      data: { status }
    });

    logger.info(`Orden ${order.id}: ${order.status} -> ${status}`);
    res.json({ order: updated, message: 'Estado actualizado' });
  } catch (error) { next(error); }
};
