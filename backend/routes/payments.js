const express = require('express');
const { Payment, Order } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// Create payment (simulate, no real gateway)
router.post('/', authenticate, async (req, res) => {
  const { orderId, amount, method } = req.body;
  const order = await Order.findByPk(orderId);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  if (order.consumerId !== req.user.id) return res.status(403).json({ error: 'Forbidden' });
  const payment = await Payment.create({
    orderId,
    amount,
    method,
    status: 'Paid',
    transactionId: 'simulated-' + Date.now(),
  });
  order.paymentStatus = 'Paid';
  await order.save();
  res.status(201).json(payment);
});

// Get payment by orderId
router.get('/:orderId', authenticate, async (req, res) => {
  const payment = await Payment.findOne({ where: { orderId: req.params.orderId } });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  res.json(payment);
});

// Admin: process refund
router.post('/refund', authenticate, requireRole('admin'), async (req, res) => {
  const { orderId } = req.body;
  const payment = await Payment.findOne({ where: { orderId } });
  if (!payment) return res.status(404).json({ error: 'Payment not found' });
  payment.status = 'Refunded';
  await payment.save();
  const order = await Order.findByPk(orderId);
  if (order) {
    order.paymentStatus = 'Refunded';
    await order.save();
  }
  // TODO: Notify user
  res.json({ message: 'Refund processed', payment });
});

module.exports = router;
