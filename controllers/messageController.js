const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
  try {
    const { recipientId } = req.query;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: recipientId },
        { sender: recipientId, recipient: userId }
      ]
    }).sort('createdAt');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, text } = req.body;
    const senderId = req.user._id;

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      text
    });

    await message.save();

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.checkForNewMessages = async (req, res) => {
    try {
      const userId = req.user._id;
      const lastChecked = new Date(req.query.lastChecked);
  
      const newMessages = await Message.find({
        recipient: userId,
        createdAt: { $gt: lastChecked }
      });
  
      res.status(200).json(newMessages);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };