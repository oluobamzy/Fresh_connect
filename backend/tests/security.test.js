const request = require('supertest');
const express = require('express');
const helmet = require('helmet');
const app = express();
app.use(helmet());
app.get('/test', (req, res) => res.send('ok'));

describe('Security Headers', () => {
  it('should set security headers', async () => {
    const res = await request(app).get('/test');
    expect(res.headers['x-dns-prefetch-control']).toBe('off');
    expect(res.headers['x-frame-options']).toBe('SAMEORIGIN');
    expect(res.headers['x-content-type-options']).toBe('nosniff');
  });
});
