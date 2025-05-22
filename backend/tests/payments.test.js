const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/payments', require('../routes/payments'));

describe('Payments Endpoint', () => {
  it('should not allow unauthenticated payment creation', async () => {
    const res = await request(app).post('/api/payments').send({ orderId: 1, amount: 10, method: 'card' });
    expect(res.statusCode).toBe(401);
  });
});
