const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.protect, async (req, res) => {
  try {
    const users = await User.find().select('_id username highSchool status');
    res.status(200).json(users.filter(user => user._id.toString() !== req.user._id.toString()));
} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
