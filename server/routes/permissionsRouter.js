const express = require('express');
const router = express.Router();
const { jwtMiddleware } = require('../middleware/permissions');
const { Permission } = require('../models/Permission');

router.get('/', async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.status(200).json(permissions);
  } catch (err) {
    console.error('There was an error fetching permissions:', err);
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

router.put('/:id', jwtMiddleware, async (req, res) => {
  const permission = await Permission.findById(req.params.id);

  for (let key in req.body) {
    permission[key] = req.body[key];
  }

  await permission.save();
  res.json(permission);
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
