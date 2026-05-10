const prisma = require('../utils/prisma');
const logger = require('../config/logger');
const { notifyUser } = require('../config/socket');

exports.importPost = async (req, res, next) => {
  try {
    const { platform, postUrl, caption } = req.body;

    const socialPost = await prisma.socialPost.create({
      data: {
        userId: req.user.id,
        platform: platform || 'instagram',
        postId: 'sim_' + Date.now(),
        caption: caption || 'Producto desde ' + platform,
        mediaUrl: 'https://picsum.photos/400/400',
        permalink: postUrl || 'https://instagram.com/p/simulado',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100)
      }
    });

    notifyUser(req.user.id, 'post:imported', {
      postId: socialPost.id,
      platform: socialPost.platform
    });

    logger.info('Post importado: ' + socialPost.id);
    res.status(201).json({ message: 'Post importado exitosamente', post: socialPost });
  } catch (error) { next(error); }
};

exports.convertToProduct = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { name, price, categoryId } = req.body;

    const socialPost = await prisma.socialPost.findUnique({ where: { id: postId } });
    if (!socialPost || socialPost.userId !== req.user.id) {
      return res.status(404).json({ message: 'Post no encontrado' });
    }

    const product = await prisma.product.create({
      data: {
        name: name || 'Producto importado',
        description: socialPost.caption,
        price: parseFloat(price) || 0,
        sellerId: req.user.id,
        categoryId: categoryId,
        postUrl: socialPost.permalink,
        socialPlatform: socialPost.platform,
        images: socialPost.mediaUrl ? [{ url: socialPost.mediaUrl, alt: name }] : []
      }
    });

    await prisma.socialPost.update({
      where: { id: postId },
      data: { isConverted: true, convertedProductId: product.id }
    });

    notifyUser(req.user.id, 'post:converted', {
      productId: product.id,
      name: product.name
    });

    logger.info('Post convertido a producto: ' + product.id);
    res.status(201).json({ message: 'Producto creado desde post', product });
  } catch (error) { next(error); }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await prisma.socialPost.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ posts });
  } catch (error) { next(error); }
};
