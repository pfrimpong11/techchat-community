const express = require('express');
const {
  getComments,
  postComment,
  postReply
} = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, getComments);
router.post('/', protect, postComment);
router.post('/reply', protect, postReply);

module.exports = router;
