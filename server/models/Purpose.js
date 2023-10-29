const mongoose = require('mongoose');

const PurposeSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  organization: { type: String }
});

module.exports = mongoose.model('Purpose', PurposeSchema);
