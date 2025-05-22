const express = require('express');
const { User, Product, Order } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// Admin: overview
router.get('/overview', authenticate, requireRole('admin'), async (req, res) => {
  const userCount = await User.count();
  const productCount = await Product.count();
  const orderCount = await Order.count();
  res.json({ userCount, productCount, orderCount });
});

// Admin: sales (dummy)
router.get('/sales', authenticate, requireRole('admin'), async (req, res) => {
  // In a real app, aggregate sales data
  const orders = await Order.findAll();
  const totalSales = orders.reduce((sum, o) => sum + (o.productItems || []).reduce((s, i) => s + (i.price * i.quantity), 0), 0);
  res.json({ totalSales });
});

// Admin: users (growth dummy)
router.get('/users', authenticate, requireRole('admin'), async (req, res) => {
  const users = await User.findAll();
  res.json({ count: users.length, users });
});

module.exports = router;
