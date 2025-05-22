const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Register (farmer/consumer)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role, foodPreferences, paymentMethods, farmDetails } = req.body;
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(409).json({ error: 'Email already registered' });
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      passwordHash,
      role,
      foodPreferences: foodPreferences || null,
      paymentMethods: paymentMethods || null,
      farmDetails: farmDetails || null,
      isVerified: role === 'farmer' ? false : true,
    });
    // TODO: Send verification email for farmers
    res.status(201).json({ message: 'Registration successful', user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed', details: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    if (!user.isActive) return res.status(403).json({ error: 'Account deactivated' });
    if (user.role === 'farmer' && !user.isVerified) return res.status(403).json({ error: 'Farmer profile not verified yet' });
    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed', details: err.message });
  }
});

// TODO: Implement /verify-email and /logout endpoints

module.exports = router;
