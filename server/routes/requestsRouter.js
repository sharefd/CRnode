const express = require('express');
const mongoose = require('mongoose');
const Request = require('../models/Request');
const User = require('../models/User');
const sendEmail = require('../middleware/mailer');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().populate('user', 'username');
    res.status(200).json(requests);
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while fetching requests', error });
  }
});

router.post('/new', async (req, res) => {
  const { purpose, year_of_study, message, user, email } = req.body;

  if (!purpose || !year_of_study || !user) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  if (!['OM1', 'UOFTAMR', 'MACIMAHD1', 'MACIMAHD2', 'MACIMAHD3'].includes(purpose)) {
    return res.status(400).json({ message: 'Invalid purpose' });
  }

  if (
    !['PGY1', 'PGY2', 'PGY3', 'PGY4', 'PGY5', 'PGY6', 'PGY7', 'PGY8', 'PGY9', 'CC1', 'CC2', 'CC3', 'CC4'].includes(
      year_of_study
    )
  ) {
    return res.status(400).json({ message: 'Invalid year of study' });
  }

  try {
    const request = new Request({
      purpose,
      year_of_study,
      message,
      email,
      user
    });

    await request.save();

    await sendEmail('New Request Submitted', 'A new request has been submitted.', email);

    res.status(201).json({ message: 'Request created successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while creating the request', error });
  }
});

router.put('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, message, email } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid request ID' });
  }

  if (!['Pending', 'Approved', 'Denied'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    if (message) {
      request.message = message;
    }

    await request.save();

    if (status === 'Approved') {
      const user = await User.findById(request.user._id);
      if (user) {
        user.permissions.push(request.purpose);
        await user.save();
      }
    }

    await sendEmail('Request Status Updated', `The status of your request has been updated to ${status}.`, email);

    res.status(200).json({ message: 'Status updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'An error occurred while updating the status', error });
  }
});

module.exports = router;
