const mongoose = require('mongoose');

const PurposeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  canReadMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  canWriteMembers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  emailMemberList: [{ type: String }]
});

module.exports = mongoose.model('Purpose', PurposeSchema);
