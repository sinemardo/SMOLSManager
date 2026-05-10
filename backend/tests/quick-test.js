// Test rápido de endpoints
const BASE_URL = 'http://localhost:3000/api/v1';

async function test() {
  console.log('🧪 Probando SMOLSManager API...\n');

  // 1. Health check
  const health = await fetch(BASE_URL + '/health');
  console.log('✅ Health:', await health.json());

  // 2. Categorías
  const categories = await fetch(BASE_URL + '/categories');
  const cats = await categories.json();
  console.log('✅ Categorías:', cats.categories?.length, 'encontradas');

  // 3. Registrar vendedor
  const register = await fetch(BASE_URL + '/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@smolsmanager.com',
      password: 'test123456',
      name: 'Test Seller',
      storeName: 'Mi Tienda Test',
      categoryId: cats.categories[0]?.id
    })
  });
  const user = await register.json();
  console.log('✅ Registro:', user.message);

  // 4. Login
  const login = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@smolsmanager.com',
      password: 'test123456'
    })
  });
  const token = await login.json();
  console.log('✅ Login:', token.message);
  console.log('🔑 Token:', token.accessToken?.substring(0, 20) + '...');

  // 5. Crear producto
  const product = await fetch(BASE_URL + '/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token.accessToken
    },
    body: JSON.stringify({
      name: 'Producto de prueba',
      description: 'Descripción del producto',
      price: 99.99,
      categoryId: cats.categories[0]?.id,
      stock: 10,
      tags: ['test', 'ejemplo']
    })
  });
  const prod = await product.json();
  console.log('✅ Producto creado:', prod.message);

  console.log('\n🎉 ¡Todos los tests pasaron! SMOLSManager API funciona correctamente.');
}

test().catch(err => console.error('❌ Error:', err.message));
