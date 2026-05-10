const prisma = require('../utils/prisma');
const logger = require('../config/logger');
const { notifyUser } = require('../config/socket');

exports.importPost = async (req, res, next) => {
  try {
    const { platform, postUrl, caption, images } = req.body;
    const socialPost = await prisma.socialPost.create({
      data: {
        userId: req.user.id,
        platform: platform || 'instagram',
        postId: 'sim_' + Date.now(),
        caption: caption || 'Producto desde ' + platform,
        mediaUrl: images?.[0]?.url || 'https://picsum.photos/400/400',
        permalink: postUrl || 'https://instagram.com/p/simulado',
        likes: Math.floor(Math.random() * 1000),
        comments: Math.floor(Math.random() * 100)
      }
    });
    notifyUser(req.user.id, 'post:imported', { postId: socialPost.id, platform: socialPost.platform });
    logger.info('Post importado: ' + socialPost.id);
    res.status(201).json({ message: 'Post importado', post: socialPost });
  } catch (error) { next(error); }
};

exports.convertToProduct = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { name, price, categoryId, images } = req.body;
    const socialPost = await prisma.socialPost.findUnique({ where: { id: postId } });
    if (!socialPost || socialPost.userId !== req.user.id) return res.status(404).json({ message: 'Post no encontrado' });

    const validImages = (images || []).slice(0, 6).map(img => ({
      url: img.url || 'https://picsum.photos/400/400',
      alt: img.alt || name
    }));

    const product = await prisma.product.create({
      data: {
        name: name || 'Producto importado',
        description: socialPost.caption,
        price: parseFloat(price) || 0,
        sellerId: req.user.id,
        categoryId: categoryId,
        postUrl: socialPost.permalink,
        socialPlatform: socialPost.platform,
        images: validImages
      }
    });
    await prisma.socialPost.update({ where: { id: postId }, data: { isConverted: true, convertedProductId: product.id } });
    notifyUser(req.user.id, 'post:converted', { productId: product.id, name: product.name });
    logger.info('Post convertido: ' + product.id);
    res.status(201).json({ message: 'Producto creado', product });
  } catch (error) { next(error); }
};

exports.getMyPosts = async (req, res, next) => {
  try {
    const posts = await prisma.socialPost.findMany({ where: { userId: req.user.id }, orderBy: { createdAt: 'desc' } });
    res.json({ posts });
  } catch (error) { next(error); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await prisma.socialPost.findUnique({ where: { id: req.params.postId } });
    if (!post || post.userId !== req.user.id) return res.status(404).json({ message: 'Post no encontrado' });
    await prisma.socialPost.delete({ where: { id: req.params.postId } });
    res.json({ message: 'Post eliminado' });
  } catch (error) { next(error); }
};

// NUEVO: Publicar en redes sociales
exports.publishToSocial = async (req, res, next) => {
  try {
    const { productId, platforms, message } = req.body;
    
    // Validar que el producto existe y pertenece al usuario
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product || product.sellerId !== req.user.id) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const results = [];
    
    // Simular publicación en cada plataforma
    for (const platform of platforms) {
      const socialPost = await prisma.socialPost.create({
        data: {
          userId: req.user.id,
          platform: platform,
          postId: 'pub_' + Date.now() + '_' + platform,
          caption: message || product.description || product.name,
          mediaUrl: product.images?.[0]?.url || 'https://picsum.photos/400/400',
          permalink: 'https://' + platform + '.com/p/' + Date.now(),
          likes: 0,
          comments: 0,
          isConverted: true,
          convertedProductId: product.id
        }
      });
      
      results.push({ platform, success: true, postId: socialPost.id });
      
      notifyUser(req.user.id, 'post:published', { 
        platform, 
        productId: product.id,
        productName: product.name 
      });
    }

    logger.info('Producto publicado en: ' + platforms.join(', '));
    res.json({ 
      message: 'Publicado en ' + results.length + ' plataforma(s)', 
      results 
    });
  } catch (error) { next(error); }
};
