const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  university: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  purposes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Purpose' }],
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
  resetToken: { type: String },
  resetTokenExpiry: { type: Number }
});

module.exports = mongoose.model('User', UserSchema);
