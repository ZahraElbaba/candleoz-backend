const express = require('express');
const { register, login } = require('../controllers/authController');
const { authenticate, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected route example
router.get('/admin', authenticate, authorizeRole('admin'), (req, res) => {
  res.json({ message: `Welcome admin ${req.user.email}` });
});

module.exports = router;
