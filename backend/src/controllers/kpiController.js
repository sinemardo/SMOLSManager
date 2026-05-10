const prisma = require('../utils/prisma');

exports.getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const filter = req.user.role === 'seller' ? { sellerId: req.user.id } : {};

    const [
      totalProducts,
      ordersToday,
      totalRevenue,
      activeSellers,
      productsByCategory,
      recentOrders
    ] = await Promise.all([
      prisma.product.count({ where: { isActive: true, ...filter } }),
      prisma.order.count({ where: { ...filter, createdAt: { gte: today } } }),
      prisma.order.aggregate({
        where: { status: 'delivered', ...filter },
        _sum: { totalAmount: true }
      }),
      prisma.user.count({ where: { role: 'seller', isActive: true } }),
      prisma.category.findMany({
        where: { isActive: true },
        include: { _count: { select: { products: true } } }
      }),
      prisma.order.findMany({
        where: filter,
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: { buyer: { select: { name: true } } }
      })
    ]);

    res.json({
      kpis: {
        totalProducts,
        ordersToday,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        activeSellers,
        productsByCategory: productsByCategory.map(c => ({
          name: c.displayName,
          count: c._count.products
        })),
        recentOrders
      }
    });
  } catch (error) { next(error); }
};

exports.getFunnel = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filter = req.user.role === 'seller' ? { sellerId: req.user.id } : {};

    const [productsActive, productsViewed, ordersCompleted] = await Promise.all([
      prisma.product.count({ where: { isActive: true, ...filter } }),
      prisma.event.count({ where: { type: 'product:viewed', createdAt: { gte: today } } }),
      prisma.order.count({ where: { ...filter, status: { not: 'cancelled' }, createdAt: { gte: today } } })
    ]);

    res.json({
      funnel: [
        { stage: 'Productos Activos', value: productsActive },
        { stage: 'Vistas Hoy', value: productsViewed },
        { stage: '?rdenes Completadas', value: ordersCompleted },
        { stage: 'Tasa Conversi?n', value: productsViewed > 0 ? ((ordersCompleted / productsViewed) * 100).toFixed(1) + '%' : '0%' }
      ]
    });
  } catch (error) { next(error); }
};
