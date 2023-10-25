const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../middleware/permissions');
const Permission = require('../models/Permission');

router.get('/', async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (err) {
    console.error('There was an error fetching permissions:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.get('/user/:userId', jwtMiddleware, async (req, res) => {
  const { userId } = req.params;
  try {
    const userPermissions = await Permission.find({ userId });
    if (!userPermissions || userPermissions.length === 0) {
      return res.status(404).json({ message: `No permissions found for user ${userId}` });
    }
    res.status(200).json(userPermissions);
  } catch (err) {
    console.error(`There was an error fetching permissions for user ${userId}:`, err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/new', jwtMiddleware, async (req, res) => {
  try {
    const newPermission = new Permission(req.body);
    await newPermission.save();
    res.json(newPermission);
  } catch (err) {
    console.error('Error creating permission:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.post('/init-permissions', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  const purposes = ['OM1', 'UOFTAMR', 'MACIMAHD1', 'MACIMAHD2', 'MACIMAHD3'];

  try {
    const newPermissions = purposes.map(purpose => ({
      userId,
      purpose,
      canRead: false,
      canWrite: false
    }));

    const result = await Permission.insertMany(newPermissions);
    if (result && result.length === purposes.length) {
      res.status(201).json({ message: 'Permissions initialized successfully', result });
    } else {
      res.status(500).json({ message: 'Not all permissions were initialized', result });
    }
  } catch (err) {
    console.error('Error initializing permissions:', err);
    res.status(500).send('Internal Server Error');
  }
});

router.put('/bulk-update/:userId', jwtMiddleware, async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  if (!Array.isArray(updates)) {
    return res.status(400).send('Updates should be an array of objects');
  }

  try {
    for (const { purpose, canRead, canWrite } of updates) {
      let permission = await Permission.findOne({ userId, purpose });

      if (!permission) {
        return res.status(404).json({ message: `Permission with purpose ${purpose} not found for user ${userId}` });
      }

      permission.canRead = canRead;
      permission.canWrite = canWrite;

      await permission.save();
    }

    res.status(200).json({ message: 'Permissions updated successfully' });
  } catch (error) {
    console.error('Error bulk updating permissions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', jwtMiddleware, async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);

    if (!permission) {
      return res.status(404).json({ message: 'permission not found' });
    }

    await Permission.deleteOne({ _id: req.params.id });
    res.json({ message: 'permission deleted' });
  } catch (error) {
    console.error('Error deleting permission:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
