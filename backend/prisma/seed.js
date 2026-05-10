const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Creando categorias...');
  
  const cats = [
    { name: 'electronics', displayName: 'Electronica' },
    { name: 'bakery', displayName: 'Reposteria' },
    { name: 'mechanic', displayName: 'Mecanica' },
    { name: 'computation', displayName: 'Computacion' },
    { name: 'fashion', displayName: 'Moda' },
    { name: 'home', displayName: 'Hogar' },
    { name: 'sports', displayName: 'Deportes' },
    { name: 'beauty', displayName: 'Belleza' },
    { name: 'food', displayName: 'Alimentacion' },
    { name: 'crafts', displayName: 'Artesanias' }
  ];

  for (const cat of cats) {
    await prisma.category.upsert({
      where: { name: cat.name },
      update: {},
      create: cat
    });
  }
  
  console.log('Categorias creadas exitosamente');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
