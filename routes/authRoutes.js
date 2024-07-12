const express = require('express');
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

router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
        return res.status(500).json({ msg: 'Logout failed' });
        }
        res.status(200).json({ msg: 'Logout successful' });
    });
});


module.exports = router;
