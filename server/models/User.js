const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  purpose: String,
  canRead: Boolean,
  canWrite: Boolean
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  firstName: { type: String },
  lastName: { type: String },
  password: { type: String, required: true },
  email: { type: String, required: true },
  university: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  permissions: [PermissionSchema],
  attended: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

module.exports = mongoose.model('User', UserSchema);
