const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);



router.get('/isAuthenticated', authMiddleware.protect, (req, res) => {
    if (req.user) {
    res.status(200).json({ isAuthenticated: true, user: req.user });
    } else {
    res.status(200).json({ isAuthenticated: false });
    }
});

// Logout route with debugging
router.post('/logout', authMiddleware.protect, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
    
        // Update user status to 'offline'
        await User.findByIdAndUpdate(req.user._id, { status: 'offline' });
    
        res.status(200).json({ msg: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
