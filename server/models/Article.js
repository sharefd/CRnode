const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 250 },
  event_link: { type: String, required: false },
  dateString: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: Number },
  purpose: { type: String, required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meeting_id: { type: String, maxlength: 50 },
  passcode: { type: String, maxlength: 50 },
  speaker: { type: String },
  location: { type: String },
  additional_details: { type: String, maxlength: 1000 },
  duration: { type: String }
});

module.exports = mongoose.model('Article', articleSchema);
