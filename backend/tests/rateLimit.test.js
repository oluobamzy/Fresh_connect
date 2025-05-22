const request = require('supertest');
const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express();
app.use(rateLimit({ windowMs: 1000, max: 2 }));
app.get('/test', (req, res) => res.send('ok'));

describe('Rate Limiting', () => {
  it('should limit repeated requests', async () => {
    await request(app).get('/test');
    await request(app).get('/test');
    const res = await request(app).get('/test');
    expect(res.statusCode).toBe(429);
  });
});
