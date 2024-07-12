const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware.protect, messageController.getMessages);
router.post('/', authMiddleware.protect, messageController.sendMessage);
router.get('/check', authMiddleware.protect, messageController.checkForNewMessages);

module.exports = router;
