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
      prisma.order.aggregate({ where: { status: 'delivered', ...filter }, _sum: { totalAmount: true } }),
      prisma.user.count({ where: { role: 'seller', isActive: true } }),
      prisma.category.findMany({ where: { isActive: true }, include: { _count: { select: { products: true } } } }),
      prisma.order.findMany({ where: filter, orderBy: { createdAt: 'desc' }, take: 5, include: { buyer: { select: { name: true } }, items: { include: { product: { select: { name: true } } } } } })
    ]);

    res.json({
      kpis: {
        totalProducts,
        ordersToday,
        totalRevenue: totalRevenue._sum.totalAmount || 0,
        activeSellers,
        productsByCategory: productsByCategory.map(c => ({ name: c.displayName, count: c._count.products })),
        recentOrders
      }
    });
  } catch (error) { next(error); }
};

exports.getFunnel = async (req, res, next) => {
  try {
    const totalPosts = await prisma.socialPost.count();
    const activeProducts = await prisma.product.count({ where: { isActive: true } });
    const totalViews = await prisma.event.count({ where: { type: 'product:viewed' } });
    const totalOrders = await prisma.order.count();

    res.json({
      funnel: [
        { stage: 'Publicaciones', value: totalPosts },
        { stage: 'Productos Activos', value: activeProducts },
        { stage: 'Vistas', value: totalViews },
        { stage: 'Órdenes', value: totalOrders }
      ]
    });
  } catch (error) { next(error); }
};
