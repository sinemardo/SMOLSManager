const prisma = require('../utils/prisma');

exports.getDashboard = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const filter = req.user.role === 'seller' ? { sellerId: req.user.id } : {};

    const [totalProducts, ordersToday, totalRevenue, activeSellers, productsByCategory, recentOrders] = await Promise.all([
      prisma.product.count({ where: { isActive: true, ...filter } }),
      prisma.order.count({ where: { ...filter, createdAt: { gte: today } } }),
      prisma.order.aggregate({ where: { status: 'delivered', ...filter }, _sum: { totalAmount: true } }),
      prisma.user.count({ where: { role: 'seller', isActive: true } }),
      prisma.category.findMany({ where: { isActive: true }, include: { _count: { select: { products: true } } } }),
      prisma.order.findMany({ where: filter, orderBy: { createdAt: 'desc' }, take: 5, include: { buyer: { select: { name: true } }, items: { include: { product: { select: { name: true } } } } } })
    ]);

    res.json({ kpis: { totalProducts, ordersToday, totalRevenue: totalRevenue._sum.totalAmount || 0, activeSellers, productsByCategory: productsByCategory.map(c => ({ name: c.displayName, count: c._count.products })), recentOrders } });
  } catch (error) { next(error); }
};

exports.getFunnel = async (req, res, next) => {
  try {
    const [totalPosts, activeProducts, totalViews, totalOrders] = await Promise.all([
      prisma.socialPost.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.event.count({ where: { type: 'product:viewed' } }),
      prisma.order.count()
    ]);
    res.json({ funnel: [
      { stage: 'Publicaciones', value: totalPosts },
      { stage: 'Productos Activos', value: activeProducts },
      { stage: 'Vistas', value: totalViews },
      { stage: 'Ordenes', value: totalOrders }
    ]});
  } catch (error) { next(error); }
};

exports.getNotifications = async (req, res) => {
  const notifications = [
    { id: 1, type: 'order', title: 'Nueva orden', message: 'Cliente compro un producto', time: 'Ahora', read: false, icon: '📋', color: '#4f46e5' },
    { id: 2, type: 'post', title: 'Post importado', message: 'Post convertido exitosamente', time: 'Hace 1h', read: false, icon: '📷', color: '#059669' },
    { id: 3, type: 'system', title: 'Bienvenido', message: 'Configura tu tienda', time: 'Hace 2h', read: true, icon: '🏪', color: '#7c3aed' }
  ];
  res.json({ notifications, unreadCount: notifications.filter(n => !n.read).length });
};
