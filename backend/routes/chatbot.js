const express = require('express');
const { authenticate } = require('../middleware/auth');
const router = express.Router();

// Dummy chatbot endpoint
router.post('/query', authenticate, async (req, res) => {
  const { message } = req.body;
  // In a real app, integrate with an AI/FAQ service
  if (!message) return res.status(400).json({ error: 'Message required' });
  // Simple canned response
  let response = 'Sorry, I am a demo bot. Please contact support for more help.';
  if (/order/i.test(message)) response = 'You can view your orders in the Orders section.';
  if (/payment/i.test(message)) response = 'Payments are processed securely via our payment gateway.';
  res.json({ reply: response });
});

module.exports = router;
