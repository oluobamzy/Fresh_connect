const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/disputes', require('../routes/disputes'));

describe('Disputes Endpoint', () => {
  it('should not allow unauthenticated dispute creation', async () => {
    const res = await request(app).post('/api/disputes').send({ orderId: 1, description: 'Test' });
    expect(res.statusCode).toBe(401);
  });
});
