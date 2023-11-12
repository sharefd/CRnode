const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../middleware/permissions');
const Purpose = require('../models/Purpose');
const Request = require('../models/Request');

// Fetch all purposes
router.get('/', async (req, res) => {
  try {
    const purposes = await Purpose.find()
      .populate('creator', 'username email firstName lastName')
      .populate('canReadMembers', 'username email')
      .populate('canWriteMembers', 'username email');
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
    })
      .populate('creator', 'username email firstName lastName')
      .populate('canReadMembers', 'username email')
      .populate('canWriteMembers', 'username email');
    res.status(200).json(purposes);
  } catch (err) {
    console.error('There was an error fetching purposes:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/:purposeId', async (req, res) => {
  try {
    const purposeId = req.params.purposeId;
    const purpose = await Purpose.findById(purposeId)
      .populate('creator', 'username email firstName lastName')
      .populate('canReadMembers', 'username email')
      .populate('canWriteMembers', 'username email');

    res.status(200).json(purpose);
  } catch (err) {
    console.error('There was an error fetching the purpose:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/new', jwtMiddleware, async (req, res) => {
  try {
    const purpose = req.body;

    if (!purpose) {
      return res.status(400).send('Purpose data is missing');
    }

    const newPurpose = new Purpose(purpose);
    const createdPurpose = await newPurpose.save();

    const fetchedPurpose = await Purpose.findById(createdPurpose._id)
      .populate('creator', 'username email firstName lastName')
      .populate('canReadMembers', 'username email')
      .populate('canWriteMembers', 'username email');

    res.status(201).json(fetchedPurpose);
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

router.put('/remove-user', jwtMiddleware, async (req, res) => {
  const { purposeName, userId } = req.body;

  try {
    const purpose = await Purpose.findOne({ name: purposeName });
    if (!purpose) {
      return res.status(404).json({ message: 'Purpose not found' });
    }

    purpose.canReadMembers = purpose.canReadMembers.filter(id => id.toString() !== userId);
    purpose.canWriteMembers = purpose.canWriteMembers.filter(id => id.toString() !== userId);

    await purpose.save();

    res.status(200).json({ message: 'User removed successfully', purpose: purpose });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

router.put('/update/:id', jwtMiddleware, async (req, res) => {
  try {
    const purposeId = req.params.id;
    const updatedPurpose = await Purpose.findByIdAndUpdate(purposeId, req.body, { new: true });

    if (!updatedPurpose) {
      return res.status(404).json({ message: 'Purpose not found' });
    }
    const purposes = await Purpose.find()
      .populate('creator', 'username email firstName lastName')
      .populate('canReadMembers', 'username email')
      .populate('canWriteMembers', 'username email');

    res.status(200).json({ updatedPurpose, purposes });
  } catch (err) {
    console.error('Error updating purpose:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/purpose/:purposeId/user/:userId', jwtMiddleware, async (req, res) => {
  try {
    const { purposeId, userId } = req.params;
    const purpose = await Purpose.findById(purposeId);

    if (!purpose) {
      return res.status(404).send('Purpose not found');
    }

    const requests = await Request.find();
    const requestsToDelete = requests.filter(
      request => request.purpose.toString() === purposeId && request.user.toString() === userId
    );
    if (requestsToDelete.length > 0) {
      await Request.deleteMany({ _id: { $in: requestsToDelete.map(request => request._id) } });
    }

    purpose.canReadMembers = purpose.canReadMembers.filter(id => id.toString() !== userId);
    purpose.canWriteMembers = purpose.canWriteMembers.filter(id => id.toString() !== userId);

    await purpose.save();

    res.status(200).json(purpose);
  } catch (err) {
    console.error('Error deleting user from purpose:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.delete('/purpose/:purposeId', jwtMiddleware, async (req, res) => {
  try {
    const purposeId = req.params.purposeId;
    const purpose = await Purpose.findByIdAndDelete(purposeId);

    if (!purpose) {
      return res.status(404).send('Purpose not found');
    }

    const requests = await Request.find();
    const requestsToDelete = requests.filter(request => request.purpose.toString() === purposeId);
    if (requestsToDelete.length > 0) {
      await Request.deleteMany({ _id: { $in: requestsToDelete.map(request => request._id) } });
    }

    res.status(200).json({ message: 'Purpose deleted successfully' });
  } catch (err) {
    console.error('Error deleting the purpose:', err);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
