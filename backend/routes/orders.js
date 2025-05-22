const express = require('express');
const { Order, Product, User } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// Place an order (consumer)
router.post('/', authenticate, requireRole('consumer'), async (req, res) => {
  const { productItems } = req.body; // [{productId, quantity, price}]
  if (!Array.isArray(productItems) || productItems.length === 0) {
    return res.status(400).json({ error: 'No products in order' });
  }
  // Optionally: check product availability, calculate total, etc.
  const order = await Order.create({
    consumerId: req.user.id,
    productItems,
    status: 'Pending',
    paymentStatus: 'Pending',
  });
  res.status(201).json(order);
});

// Get orders (consumer/farmer)
router.get('/', authenticate, async (req, res) => {
  let where = {};
  if (req.user.role === 'consumer') where.consumerId = req.user.id;
  if (req.user.role === 'farmer') where.farmerId = req.user.id;
  const orders = await Order.findAll({ where });
  res.json(orders);
});

// Get order by id
router.get('/:id', authenticate, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (req.user.role === 'consumer' && order.consumerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  if (req.user.role === 'farmer' && order.farmerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  res.json(order);
});

// Farmer/admin: update order status
router.patch('/:id', authenticate, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (req.user.role === 'farmer' && order.farmerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  if (req.user.role !== 'farmer' && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  Object.assign(order, req.body);
  await order.save();
  res.json(order);
});

module.exports = router;
