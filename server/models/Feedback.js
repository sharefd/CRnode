const mongoose = require('mongoose');

const FeedbackSchema = new mongoose.Schema({
  articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  feedback: { type: String, required: true }
});

module.exports = mongoose.model('Feedback', FeedbackSchema);
