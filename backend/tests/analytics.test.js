const request = require('supertest');
const express = require('express');
const app = express();
app.use(express.json());
app.use('/api/analytics', require('../routes/analytics'));

describe('Analytics Endpoints', () => {
  it('should not allow unauthenticated access', async () => {
    const res = await request(app).get('/api/analytics/overview');
    expect(res.statusCode).toBe(401);
  });
});
