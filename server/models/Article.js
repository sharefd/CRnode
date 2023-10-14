const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  event_link: { type: String, required: true },
  made_on: { type: Date, required: true },
  time: { type: String, required: true },
  purpose: { type: String, required: true, enum: ['OM1', 'UOFTAMR', 'MACIMAHD1', 'MACIMAHD2', 'MACIMAHD3'] },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  meeting_id: { type: String },
  passcode: { type: String }
});

module.exports = mongoose.model('Article', articleSchema);
