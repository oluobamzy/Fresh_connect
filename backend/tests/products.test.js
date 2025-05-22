const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/products', require('../routes/products'));
const { Product } = require('../models');

describe('Products Endpoints', () => {
  beforeAll(async () => {
    await Product.destroy({ where: {} });
  });

  it('should get all products (empty)', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
