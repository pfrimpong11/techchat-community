const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');
const { registerUser, loginUser, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);



router.get('/isAuthenticated', (req, res) => {
    if (req.session.user) {
    res.status(200).json({ isAuthenticated: true, user: req.session.user });
    } else {
    res.status(200).json({ isAuthenticated: false });
    }
});

// Logout route with debugging
router.post('/logout', authMiddleware.protect, async (req, res) => {
    console.log('Logout route accessed');
    try {
        await User.findByIdAndUpdate(req.user._id, { status: 'offline' });

        req.session.destroy(err => {
        if (err) {
            console.error('Error destroying session:', err);
            return res.status(500).json({ msg: 'Logout failed' });
        }
        console.log('Logout successful');
        res.status(200).json({ msg: 'Logout successful' });
    });
    } catch (error) {
        console.error('Error in logout route:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
