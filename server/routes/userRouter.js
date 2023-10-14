const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.get('/:username', async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const userResponse = {
      username: user.username,
      permissions: user.permissions,
      university: user.university,
      isAdmin: user.isAdmin
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

    const token = jwt.sign({ username: user.username, isAdmin: user.isAdmin }, 'secrety', { expiresIn: '72h' });

    const { password: _, ...userResponse } = user.toObject();

    res.status(200).json({ message: 'Successfully logged in', token: token, user: userResponse });
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post('/register', async (req, res) => {
  const { username, email, password, university, permissions } = req.body;

  // Hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    username,
    email,
    password: hashedPassword,
    university,
    permissions
  });

  try {
    await newUser.save();

    const token = jwt.sign({ username: newUser.username, isAdmin: newUser.isAdmin }, 'secrety', { expiresIn: '72h' });

    const { password: _, ...userResponse } = newUser.toObject();

    res.status(200).json({
      message: 'User successfully registered',
      token: token,
      user: userResponse
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
