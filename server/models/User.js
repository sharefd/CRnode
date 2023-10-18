const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  purpose: String,
  canRead: Boolean,
  canWrite: Boolean
});

const UserSchema = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  university: String,
  isAdmin: { type: Boolean, default: false },
  permissions: [PermissionSchema],
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = mongoose.model('User', UserSchema);
