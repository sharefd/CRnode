const mongoose = require('mongoose');
const { Schema } = mongoose;

const inviteSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  purposeId: {
    type: Schema.Types.ObjectId,
    ref: 'Purpose',
    required: true
  },
  token: {
    type: String,
    required: true,
    unique: true
  },
  expirationTime: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  creator: {
    type: String
  },
  calendar: {
    type: String
  }
});

module.exports = mongoose.model('Invite', inviteSchema);
