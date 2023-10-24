const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  purpose: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  canRead: { type: Boolean, default: false },
  canWrite: { type: Boolean, default: false }
});

module.exports = mongoose.model('Permission', PermissionSchema);
