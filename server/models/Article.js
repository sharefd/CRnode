const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 250 },
  event_link: { type: String, required: false },
  dateString: { type: String, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true, enum: ['OM1', 'UOFTAMR', 'MACIMAHD1', 'MACIMAHD2', 'MACIMAHD3'] },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meeting_id: { type: String, maxlength: 50 },
  passcode: { type: String, maxlength: 50 },
  speaker: { type: String },
  location: { type: String },
  additional_details: { type: String, maxlength: 1000 }
});

module.exports = mongoose.model('Article', articleSchema);
