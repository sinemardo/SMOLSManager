const request = require('supertest');
const app = require('../src/app');

describe('Categories', () => {
  test('GET /api/v1/categories devuelve lista', async () => {
    const res = await request(app).get('/api/v1/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('categories');
    expect(Array.isArray(res.body.categories)).toBe(true);
  });

  test('Categorías tienen estructura correcta', async () => {
    const res = await request(app).get('/api/v1/categories');
    if (res.body.categories.length > 0) {
      const cat = res.body.categories[0];
      expect(cat).toHaveProperty('id');
      expect(cat).toHaveProperty('name');
      expect(cat).toHaveProperty('displayName');
      expect(cat).toHaveProperty('isActive');
    }
  });
});
