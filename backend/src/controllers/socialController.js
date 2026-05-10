const prisma = require('../utils/prisma');
const logger = require('../config/logger');

// Simular importaci?n desde Instagram/TikTok
exports.importPost = async (req, res, next) => {
  try {
    const { platform, postUrl, caption } = req.body;

    // Simulaci?n de datos del post
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

    await prisma.event.create({
      data: {
        type: 'social:post_imported',
        userId: req.user.id,
        data: { postId: socialPost.id, platform },
        metadata: { source: 'pwa' }
      }
    });

    logger.info('Post importado: ' + socialPost.id);
    res.status(201).json({ message: 'Post importado exitosamente', post: socialPost });
  } catch (error) { next(error); }
};

// Convertir post en producto
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
        name: name || socialPost.caption?.substring(0, 100) || 'Producto importado',
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

    await prisma.event.create({
      data: {
        type: 'product:created_from_social',
        userId: req.user.id,
        data: { productId: product.id, postId: socialPost.id },
        metadata: { source: 'pwa' }
      }
    });

    logger.info('Post convertido a producto: ' + product.id);
    res.status(201).json({ message: 'Producto creado desde post', product });
  } catch (error) { next(error); }
};

// Obtener posts importados
exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await prisma.socialPost.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ posts });
  } catch (error) { next(error); }
};
