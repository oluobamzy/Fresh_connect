const express = require('express');
const { Dispute } = require('../models');
const { authenticate, requireRole } = require('../middleware/auth');
const router = express.Router();

// User: create dispute
router.post('/', authenticate, async (req, res) => {
  const { orderId, description } = req.body;
  if (!orderId || !description) return res.status(400).json({ error: 'Order ID and description required' });
  const dispute = await Dispute.create({
    userId: req.user.id,
    orderId,
    description,
    status: 'Open',
  });
  res.status(201).json(dispute);
});

// Admin: get all disputes
router.get('/', authenticate, requireRole('admin'), async (req, res) => {
  const disputes = await Dispute.findAll();
  res.json(disputes);
});

// Admin: update dispute (resolve/escalate)
router.patch('/:id', authenticate, requireRole('admin'), async (req, res) => {
  const dispute = await Dispute.findByPk(req.params.id);
  if (!dispute) return res.status(404).json({ error: 'Dispute not found' });
  Object.assign(dispute, req.body);
  await dispute.save();
  res.json(dispute);
});

module.exports = router;
