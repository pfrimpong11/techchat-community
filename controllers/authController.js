const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

exports.registerUser = async (req, res) => {
  const { username, firstName, surname, email, password, phoneNumber, highSchool } = req.body;
  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({
      username,
      firstName,
      surname,
      email,
      password,
      phoneNumber,
      highSchool
    });
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      token: generateToken(user._id)
    });
    console.log("Sign up successful");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log(email);
  try {
    let user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        username: user.username,
        email: user.email,
        token: generateToken(user._id)
      });
      req.session.user = user;
      console.log("login successful");
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const token = generateToken(user._id);

    const transporter = nodemailer.createTransport({
      service: 'Outlook365', // Use your email service
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password: ${process.env.FRONTEND_URL}/createNewPassword.html?token=${token}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return res.status(500).json({ msg: 'Error sending email' });
      }
      res.status(200).json({ msg: 'Password reset email sent' });
      console.log("Email sent for password reset");
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  console.log(newPassword);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ msg: 'Invalid token or user does not exist' });
    }

    user.password = newPassword;

    await user.save();
    res.status(200).json({ msg: 'Password reset successful' });
    console.log("Password reset successful");
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
