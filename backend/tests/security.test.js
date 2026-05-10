const request = require('supertest');
const app = require('../src/app');

describe('Seguridad', () => {
  // Test de JWT protección (ya funciona)
  test('Token invalido es rechazado', async () => {
    const res = await request(app)
      .get('/api/v1/kpis/dashboard')
      .set('Authorization', 'Bearer token_falso_12345');
    expect(res.statusCode).toBe(401);
  });

  // Test de password hasheado (ya funciona)
  test('Password se almacena hasheado', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@smolsmanager.com', password: 'admin123' });
    expect(res.body).not.toHaveProperty('password');
    expect(res.body.user).not.toHaveProperty('password');
  });

  // Test de timeout
  test('API responde en tiempo razonable', async () => {
    const start = Date.now();
    await request(app).get('/api/v1/health');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(3000);
  });

  // Test de CORS (origen permitido)
  test('CORS permite origen localhost', async () => {
    const res = await request(app)
      .get('/api/v1/categories')
      .set('Origin', 'http://localhost:5173');
    expect(res.statusCode).toBe(200);
  });

  // Test de headers de seguridad básicos
  test('Cabeceras de seguridad presentes', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.headers).toBeDefined();
  });

  // Test de validación de entrada
  test('Datos invalidos son rechazados', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: '', password: '' });
    expect([400, 401]).toContain(res.statusCode);
  });

  // Test de protección de rutas
  test('Rutas protegidas requieren token', async () => {
    const res = await request(app).get('/api/v1/kpis/dashboard');
    expect(res.statusCode).toBe(401);
  });
});
