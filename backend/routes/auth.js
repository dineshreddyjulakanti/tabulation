const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'secret123';


router.post('/register', async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ username, password: hashed, role });
    res.json({ message: 'Registration successful. You can now login.' });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(400).json({ message: 'Registration failed: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: 'Login failed.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: 'Login failed.' });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, role: user.role });
  } catch {
    res.status(500).json({ message: 'Login failed.' });
  }
});


// // Register
// router.post('/register', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const hashed = await bcrypt.hash(password, 10);
//     await User.create({ username, password: hashed });
//     res.json({ message: 'Registration successful. You can now login.' });
//   } catch (err) {
//     res.status(400).json({ message: 'Registration failed: ' + err.message });
//   }
// });

// // Login
// router.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const user = await User.findOne({ username });
//     if (!user) return res.status(401).json({ message: 'Login failed. Please try again.' });

//     const valid = await bcrypt.compare(password, user.password);
//     if (!valid) return res.status(401).json({ message: 'Login failed. Please try again.' });

//     const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: 'Login failed. Please try again.' });
//   }
// });

module.exports = router;
