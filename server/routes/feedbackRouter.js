const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.post('/', async (req, res) => {
  const { articleId, userId, feedback } = req.body;

  const newFeedback = new Feedback({
    articleId,
    userId,
    feedback
  });

  try {
    await newFeedback.save();
    res.status(200).json({ message: 'Feedback successfully saved', feedback: newFeedback });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const feedbacks = await Feedback.find({ userId }).populate('articleId');
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
