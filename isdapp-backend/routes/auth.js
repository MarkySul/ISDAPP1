const express = require('express');
const router  = express.Router();
const bcrypt  = require('bcryptjs');
const jwt     = require('jsonwebtoken');
const db      = require('../db');

// REGISTER
router.post('/register', async (req, res) => {
  console.log('🔵 Register request received:', req.body);
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required.' });
  }
  try {
    const [existing] = await db.query(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );
    if (existing.length > 0) {
      return res.status(409).json({ message: 'Username or email already taken.' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashed]
    );
    return res.status(201).json({ message: 'Account created successfully.', userId: result.insertId });
  } catch (err) {
    console.error('❌ Register error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  console.log('🔵 Login request received:', req.body);
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required.' });
  }
  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username or password.' });
    }
    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    console.log('✅ Login successful for:', username);
    return res.status(200).json({
      message: 'Login successful.',
      token,
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (err) {
    console.error('❌ Login error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// FORGOT PASSWORD
router.post('/forgot-password', async (req, res) => {
  console.log('🔵 Forgot password request received:', req.body);
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email is required.' });
  }
  try {
    const [rows] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    return res.status(200).json({ message: 'If that email exists, a reset code has been sent.' });
  } catch (err) {
    console.error('❌ Forgot password error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// CHANGE PASSWORD
router.post('/change-password', async (req, res) => {
  console.log('🔵 Change password request received:', req.body);
  const { email, newPassword } = req.body;
  if (!email || !newPassword) {
    return res.status(400).json({ message: 'Email and new password are required.' });
  }
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = ? WHERE email = ?', [hashed, email]);
    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('❌ Change password error:', err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;