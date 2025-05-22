const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/orders', require('../routes/orders'));
const { Order } = require('../models');

describe('Orders Endpoints', () => {
  beforeAll(async () => {
    await Order.destroy({ where: {} });
  });

  it('should not allow unauthenticated order placement', async () => {
    const res = await request(app).post('/api/orders').send({ productItems: [] });
    expect(res.statusCode).toBe(401);
  });
});
