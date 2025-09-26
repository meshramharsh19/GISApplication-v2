// backend/routes/userRoutes.js

const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
// const auth = require('../middleware/authMiddleware'); // auth middleware is not used here

const router = express.Router();

// Signup route remains the same
router.post('/signup', async (req, res) => {
  // ... no change
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create a user object without the password
    const userSessionData = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    req.session.user = userSessionData; // Store clean user data in session

    // CHANGED: Send the user data back to the frontend
    res.status(200).json({ message: 'Login successful', user: userSessionData });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout route remains the same
router.post('/logout', (req, res) => {
  // ... no change
});

// Check Auth Route
router.get('/check-auth', (req, res) => {
  if (req.session.user) {
    // CHANGED: Send the user data if they are authenticated
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
  } else {
    res.status(401).json({ isAuthenticated: false });
  }
});

module.exports = router;
