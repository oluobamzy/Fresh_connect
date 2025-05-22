const request = require('supertest');
const express = require('express');
const app = express();
app.use('/api/health', require('../routes/health'));

describe('Health Endpoint', () => {
  it('should return status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
