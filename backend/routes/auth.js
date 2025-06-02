const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const router = express.Router();

// Register (farmer/consumer)
router.post('/register', async (req, res) => {
  console.log('Registration request received:', req.body);
  try {
    const { name, email, password, role, foodPreferences, paymentMethods, farmDetails } = req.body;
    if (!name || !email || !password || !role) {
      console.log('Registration missing required fields');
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    try {
      const existing = await User.findOne({ where: { email } });
      if (existing) {
        console.log('Email already registered:', email);
        return res.status(409).json({ error: 'Email already registered' });
      }
    } catch (dbErr) {
      console.error('Database error during user lookup:', dbErr);
      return res.status(500).json({ error: 'Database error', details: dbErr.message });
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Parse string JSON fields if they're strings
    const parsedFoodPreferences = typeof foodPreferences === 'string' && foodPreferences ? 
      JSON.parse(foodPreferences) : foodPreferences;
    
    const parsedPaymentMethods = typeof paymentMethods === 'string' && paymentMethods ? 
      JSON.parse(paymentMethods) : paymentMethods;
    
    const parsedFarmDetails = typeof farmDetails === 'string' && farmDetails ? 
      JSON.parse(farmDetails) : farmDetails;
    
    try {
      const user = await User.create({
        name,
        email,
        passwordHash,
        role,
        foodPreferences: parsedFoodPreferences || null,
        paymentMethods: parsedPaymentMethods || null,
        farmDetails: parsedFarmDetails || null,
        isVerified: role === 'farmer' ? false : true,
      });
      
      console.log('User registered successfully:', user.id);
      // TODO: Send verification email for farmers
      return res.status(201).json({ 
        message: 'Registration successful', 
        user: { 
          id: user.id, 
          email: user.email, 
          role: user.role 
        } 
      });
    } catch (createErr) {
      console.error('Error creating user:', createErr);
      return res.status(500).json({ error: 'User creation failed', details: createErr.message });
    }
  } catch (err) {
    console.error('Registration failed:', err);
    // Ensure we always send a JSON response
    res.status(500).json({ 
      error: 'Registration failed', 
      details: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body);
    
    // Validate request body
    const { email, password } = req.body;
    if (!email || !password) {
      console.log('Login missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    
    // Find user
    let user;
    try {
      user = await User.findOne({ where: { email } });
      if (!user) {
        console.log('User not found:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (dbErr) {
      console.error('Database error during user lookup:', dbErr);
      return res.status(500).json({ error: 'Database error', details: dbErr.message });
    }
    
    // Validate password
    try {
      const valid = await bcrypt.compare(password, user.passwordHash);
      if (!valid) {
        console.log('Invalid password for user:', email);
        return res.status(401).json({ error: 'Invalid credentials' });
      }
    } catch (bcryptErr) {
      console.error('Error during password comparison:', bcryptErr);
      return res.status(500).json({ error: 'Authentication error', details: bcryptErr.message });
    }
    
    // Check user status
    if (!user.isActive) {
      console.log('Account deactivated:', email);
      return res.status(403).json({ error: 'Account deactivated' });
    }
    if (user.role === 'farmer' && !user.isVerified) {
      console.log('Unverified farmer account:', email);
      return res.status(403).json({ error: 'Farmer profile not verified yet' });
    }
    
    // Generate JWT token
    try {
      const token = jwt.sign(
        { id: user.id, role: user.role }, 
        process.env.JWT_SECRET, 
        { expiresIn: '7d' }
      );
      
      console.log('User logged in successfully:', user.id);
      return res.json({ 
        token, 
        user: { id: user.id, email: user.email, role: user.role } 
      });
    } catch (jwtErr) {
      console.error('Error generating token:', jwtErr);
      return res.status(500).json({ error: 'Authentication error', details: jwtErr.message });
    }
  } catch (err) {
    console.error('Login failed:', err);
    // Ensure we always send a JSON response
    return res.status(500).json({ 
      error: 'Login failed', 
      details: err.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
  }
});

// TODO: Implement /verify-email and /logout endpoints

module.exports = router;
