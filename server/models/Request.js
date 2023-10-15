const mongoose = require('mongoose');

const RequestSchema = new mongoose.Schema({
  purpose: { type: String, required: true },
  year_of_study: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Denied'], default: 'Pending' },
  message: { type: String },
  email: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Request', RequestSchema);
