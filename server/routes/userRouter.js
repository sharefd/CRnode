require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../middleware/mailer');
const { jwtMiddleware } = require('../middleware/permissions');

const URL_HOST = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://cloudrounds.com';

// fetch all users
router.get('/', jwtMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

// fetch user by token
router.get('/me', jwtMiddleware, async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    const user = await User.findOne({ username }).populate('attended');
    if (!user) {
      return res.status(404).send('User not found');
    }

    const userResponse = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      username: user.username,
      university: user.university,
      email: user.email,
      isAdmin: user.isAdmin,
      purposes: user.purposes,
      attended: user.attended,
      favorites: user.favorites
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).send(err);
  }
});

// get user info by username
router.get('/:username', jwtMiddleware, async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const userResponse = {
      _id: user._id,
      username: user.username,
      email: user.email,
      university: user.university,
      attended: user.attended,
      isAdmin: user.isAdmin
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).send(err);
  }
});

// login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const isEmail = input => {
      const emailRegex = /\S+@\S+\.\S+/;
      return emailRegex.test(input);
    };

    let user;
    if (isEmail(username)) {
      user = await User.findOne({ email: username });
    } else {
      user = await User.findOne({ username });
    }

    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!user.emailValidated) {
      return res.status(403).send('Email not validated. Please check your email to validate your account.');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '72h'
    });

    res.cookie('CloudRoundsToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 72 * 3600000
    });

    const { password: _, ...userResponse } = user.toObject();
    userResponse.attended = user.attended;
    userResponse.favorites = user.favorites;

    res.status(200).json({ message: 'Successfully logged in', token: token, user: userResponse });
  } catch (err) {
    res.status(500).send(err);
  }
});

// sign up - create a new user
router.post('/register', async (req, res) => {
  const { username, email, password, university, firstName, lastName } = req.body;

  const registerToken = crypto.randomBytes(20).toString('hex');
  const registerTokenExpiry = Date.now() + 3600000; // 1 hour

  if (!username || !email || !password || !university || !firstName || !lastName) {
    return res.status(400).send('All fields are required');
  }

  const existingUserByUsername = await User.findOne({ username });
  const existingUserByEmail = await User.findOne({ email });

  if (existingUserByUsername) {
    return res.status(400).send('Username already exists');
  }

  if (existingUserByEmail) {
    return res.status(400).send('Email already exists');
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    university,
    firstName,
    lastName,
    emailValidated: false,
    registerToken,
    registerTokenExpiry
  });

  try {
    await newUser.save();

    const subject = 'Validate Email';
    const text = `You are receiving this email because you signed up to CloudRounds.\n\n
        Please click on the following link, or paste this into your browser to complete the process within one hour of receiving it:\n\n
        ${URL_HOST}/verify-email/${registerToken}\n\n`;

    const to = newUser.email;
    await sendEmail(subject, text, to);
    res.status(200).json({ message: 'User registered. Please check your email to validate your account.' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// change user password (from user settings)
router.put('/change-password', jwtMiddleware, async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const validPassword = await bcrypt.compare(currentPassword, user.password);

    if (!validPassword) {
      return res.status(401).send('Invalid current password');
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    res.status(500).send(err);
  }
});

// toggle attend for a given article
router.put('/toggle-attend', jwtMiddleware, async (req, res) => {
  const { userId, articleId, isAttending } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (isAttending) {
      if (!user.attended.includes(articleId)) {
        user.attended.push(articleId);
      }
    } else {
      const index = user.attended.indexOf(articleId);
      if (index > -1) {
        user.attended.splice(index, 1);
      }
    }

    await user.save();

    res.status(200).json({ message: 'Successfully updated attendance', attended: user.attended });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/favorites/:userId', jwtMiddleware, async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    const favorites = user.favorites;

    res.status(200).json(favorites);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/toggle-favorite', jwtMiddleware, async (req, res) => {
  const { userId, articleId, isFavorite } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (isFavorite) {
      if (!user.favorites.includes(articleId)) {
        user.favorites.push(articleId);
      }
    } else {
      const index = user.favorites.indexOf(articleId);
      if (index > -1) {
        user.favorites.splice(index, 1);
      }
    }

    await user.save();

    res.status(200).json({ message: 'Successfully updated favorites', favorites: user.favorites });
  } catch (err) {
    res.status(500).send(err);
  }
});

// Update user details (from user settings)
router.put('/:id', jwtMiddleware, async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send('Invalid user ID');
  }

  if (updates.password) {
    delete updates.password;
  }

  if (updates.username) {
    const existingUserByUsername = await User.findOne({ username: updates.username });
    if (existingUserByUsername && existingUserByUsername._id.toString() !== id) {
      return res.status(400).send('Username already taken');
    }
  }

  if (updates.email) {
    const existingUserByEmail = await User.findOne({ email: updates.email });
    if (existingUserByEmail && existingUserByEmail._id.toString() !== id) {
      return res.status(400).send('Email already in use');
    }
  }

  try {
    const user = await User.findByIdAndUpdate(id, updates, { new: true });

    if (!user) {
      return res.status(404).send('User not found');
    }

    res.status(200).json({
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await user.deleteOne({ _id: id });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while deleting the user', error });
  }
});

module.exports = router;
