const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../middleware/permissions');
const Permission = require('../models/Permission');
const Purpose = require('../models/Purpose');
const User = require('../models/User'); // Assume you have a User model

// Fetch all purposes
router.get('/', async (req, res) => {
  try {
    const purposes = await Purpose.find();
    res.status(200).json(purposes);
  } catch (err) {
    console.error('There was an error fetching purposes:', err);
    res.status(500).send('Internal Server Error');
  }
});

// Fetch purposes by userId
router.get('/user/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const purposes = await Purpose.find({
      $or: [{ canReadMembers: userId }, { canWriteMembers: userId }]
    });
    res.status(200).json(purposes);
  } catch (err) {
    console.error('There was an error fetching purposes:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/new', jwtMiddleware, async (req, res) => {
  try {
    const { userId, purpose } = req.body;
    const newPurpose = new Purpose({ purpose });
    await newPurpose.save();

    const users = await User.find();

    const newPermissions = users.map(user => ({
      userId: user._id,
      purpose: newPurpose._id,
      canRead: user._id.toString() === userId.toString(),
      canWrite: user._id.toString() === userId.toString()
    }));

    await Permission.insertMany(newPermissions);

    res.status(201).json(newPurpose);
  } catch (err) {
    console.error('Error creating purpose:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/bulk-update/:userId', jwtMiddleware, async (req, res) => {
  const { userId } = req.params;
  const { canReadPermissions, canWritePermissions } = req.body;

  try {
    if (!Array.isArray(canReadPermissions) || !Array.isArray(canWritePermissions)) {
      return res.status(400).send('canReadPermissions and canWritePermissions should be arrays');
    }

    const allPurposes = await Purpose.find();

    // Update canReadMembers and canWriteMembers for each purpose
    for (const purpose of allPurposes) {
      const shouldRead = canReadPermissions.includes(purpose.name);
      const shouldWrite = canWritePermissions.includes(purpose.name);

      if (shouldRead && !purpose.canReadMembers.includes(userId)) {
        purpose.canReadMembers.push(userId);
      } else if (!shouldRead) {
        purpose.canReadMembers = purpose.canReadMembers.filter(id => id !== userId);
      }

      if (shouldWrite && !purpose.canWriteMembers.includes(userId)) {
        purpose.canWriteMembers.push(userId);
      } else if (!shouldWrite) {
        purpose.canWriteMembers = purpose.canWriteMembers.filter(id => id !== userId);
      }

      await purpose.save();
    }

    res.status(200).json({ message: 'Permissions updated successfully' });
  } catch (error) {
    console.error('Error bulk updating permissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/update/:id', jwtMiddleware, async (req, res) => {
  try {
    const purposeId = req.params.id;
    const updatedPurpose = await Purpose.findByIdAndUpdate(purposeId, req.body, { new: true });

    if (!updatedPurpose) {
      return res.status(404).json({ message: 'Purpose not found' });
    }

    res.status(200).json(updatedPurpose);
  } catch (err) {
    console.error('Error updating purpose:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
