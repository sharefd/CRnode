const express = require('express');
const router = express.Router();
const Feedback = require('../models/Feedback');

router.get('/', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).send(err);
  }
});

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
    const feedbacks = await Feedback.find({ userId });
    res.status(200).json(feedbacks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.put('/:feedbackId', async (req, res) => {
  const { feedbackId } = req.params;
  const { feedback } = req.body;

  try {
    let existingFeedback = await Feedback.findById(feedbackId);
    if (existingFeedback) {
      existingFeedback.feedback = feedback;
      await existingFeedback.save();
      res.status(200).json({ message: 'Feedback updated successfully', feedback: existingFeedback });
    } else {
      res.status(404).send('Feedback not found');
    }
  } catch (err) {
    res.status(500).send(err.message);
  }
});

router.delete('/:feedbackId', async (req, res) => {
  const { feedbackId } = req.params;

  try {
    const feedback = await Feedback.findById(feedbackId);

    if (!feedback) {
      return res.status(404).send('Feedback not found');
    }

    await Feedback.findByIdAndDelete(feedbackId);
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
