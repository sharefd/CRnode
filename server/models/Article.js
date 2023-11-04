const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 250 },
  event_link: { type: String, required: false },
  date: { type: Date, required: true },
  duration: { type: String },
  purpose: { type: mongoose.Schema.Types.ObjectId, ref: 'Purpose', required: true },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  meetingType: { type: String, maxlength: 50 },
  meeting_id: { type: String, maxlength: 50 },
  passcode: { type: String, maxlength: 50 },
  speaker: { type: String },
  location: { type: String },
  additional_details: { type: String, maxlength: 1000 }
});

module.exports = mongoose.model('Article', articleSchema);
