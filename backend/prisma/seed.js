const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const categories = [
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

async function main() {
  console.log('🌱 Iniciando seed de categorías...');
  
  for (const category of categories) {
    await prisma.category.upsert({
      where: { name: category.name },
      update: {},
      create: category
    });
  }
  
  console.log('✅ Categorías creadas exitosamente');
}

main()
  .catch((e) => {
    console.error('Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.\();
  });
