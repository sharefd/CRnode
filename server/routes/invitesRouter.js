const express = require('express');
const router = express.Router();
const Invite = require('../models/Invite');
const User = require('../models/User');
const Purpose = require('../models/Purpose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { sendRegistrationLink } = require('../middleware/mailer');

// Create a new invite
router.post('/', async (req, res) => {
  try {
    const invite = new Invite(req.body);
    await invite.save();

    // Send email with registration link
    const registrationLink = `http://cloudrounds.com/register?token=${invite.token}`;
    const emailContent = `
      <h2>Invitation to join CloudRounds</h2>
      <p>${invite.creator} invited you to join "${invite.calendar}" on our platform. Please use the registration link below to sign up and access the calendar.</p>
      <a href="${registrationLink}">Register Now</a>
    `;

    await sendRegistrationLink({
      to: invite.email,
      subject: 'You have been invited to join our platform!',
      html: emailContent
    });

    res.status(201).send(invite);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.post('/register-with-token', async (req, res) => {
  const { token, username, email, password, university, firstName, lastName } = req.body;

  if (!token || !username || !email || !password || !university || !firstName || !lastName) {
    return res.status(400).send('All fields are required');
  }

  // Verify the provided token
  const invite = await Invite.findOne({ token });
  if (!invite) {
    return res.status(400).send('Invalid or expired token');
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
    emailValidated: true
  });

  try {
    const createdUser = await newUser.save();

    // Add the user's ID to the canReadMembers of the associated calendar purpose
    const purpose = await Purpose.findById(invite.purposeId);
    if (purpose) {
      purpose.canReadMembers.push(createdUser._id);
      await purpose.save();
    }

    const userToken = jwt.sign({ username: newUser.username, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET, {
      expiresIn: '72h'
    });

    const { password: _, ...userResponse } = createdUser.toObject();

    res.status(200).json({
      message: 'User successfully registered',
      token: userToken,
      user: userResponse
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Get all invites
router.get('/', async (req, res) => {
  try {
    const invites = await Invite.find({});
    res.send(invites);
  } catch (error) {
    res.status(500).send();
  }
});

// Get a specific invite by token
router.get('/:token', async (req, res) => {
  const token = req.params.token;
  try {
    const invite = await Invite.findOne({ token });
    if (!invite) {
      return res.status(404).send();
    }
    res.status(200).send(invite);
  } catch (error) {
    res.status(500).send();
  }
});

// Delete an invite by token
router.delete('/:token', async (req, res) => {
  const token = req.params.token;
  try {
    const invite = await Invite.findOneAndDelete({ token });
    if (!invite) {
      return res.status(404).send();
    }
    res.send(invite);
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
