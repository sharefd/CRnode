const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  purpose: { type: mongoose.Schema.Types.ObjectId, ref: 'Purpose', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  year_of_study: { type: String },
  status: { type: String, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' },
  message: { type: String },
  email: { type: String },
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Request', RequestSchema);
