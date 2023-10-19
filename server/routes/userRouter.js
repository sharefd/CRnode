const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtMiddleware } = require('../middleware/permissions');

router.get('/', jwtMiddleware, async (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.isAdmin) {
      return res.status(403).send('Access forbidden: Only admins can access this endpoint');
    }

    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/edit-permissions/:userId', jwtMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { permissions } = req.body;

  if (!Array.isArray(permissions)) {
    return res.status(400).send('Permissions should be an array of objects');
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    user.permissions = permissions;

    await user.save();

    res.status(200).send({ message: 'Permissions updated successfully', permissions: user.permissions });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/me', jwtMiddleware, async (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.username;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const userResponse = {
      _id: user._id,
      username: user.username,
      permissions: user.permissions,
      university: user.university,
      email: user.email,
      isAdmin: user.isAdmin,
      attended: user.attended
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }

    const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '72h'
    });

    const { password: _, ...userResponse } = user.toObject();
    userResponse.attended = user.attended;

    res.status(200).json({ message: 'Successfully logged in', token: token, user: userResponse });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password, university, permissions, firstName, lastName } = req.body;

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
    permissions,
    firstName,
    lastName
  });

  try {
    await newUser.save();

    const token = jwt.sign({ username: newUser.username, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '72h'
    });

    const { password: _, ...userResponse } = newUser.toObject();
    userResponse.attended = newUser.attended;

    res.status(200).json({
      message: 'User successfully registered',
      token: token,
      user: userResponse
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

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
      permissions: user.permissions,
      university: user.university,
      attended: user.attended,
      isAdmin: user.isAdmin
    };

    res.status(200).json(userResponse);
  } catch (err) {
    res.status(500).send(err);
  }
});

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

module.exports = router;
