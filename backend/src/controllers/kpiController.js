const prisma = require('../utils/prisma');

exports.getDashboard = async (req, res, next) => {
  try {
    const [totalProducts, totalOrders, categories] = await Promise.all([
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.count(),
      prisma.category.findMany({ where: { isActive: true } })
    ]);
    res.json({ kpis: { totalProducts, ordersToday: totalOrders, totalRevenue: 0, activeSellers: 0, productsByCategory: categories } });
  } catch (error) { next(error); }
};

exports.getFunnel = async (req, res, next) => {
  try {
    res.json({ funnel: [
      { stage: 'Publicaciones', value: 0 },
      { stage: 'Productos', value: 0 },
      { stage: 'Visitantes', value: 0 },
      { stage: 'Carritos', value: 0 },
      { stage: 'Ordenes', value: 0 }
    ]});
  } catch (error) { next(error); }
};
