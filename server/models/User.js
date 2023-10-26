const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
  university: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = mongoose.model('User', UserSchema);
