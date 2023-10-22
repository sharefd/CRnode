const mongoose = require('mongoose');

const PermissionSchema = new mongoose.Schema({
  purpose: { type: String, required: true },
  canRead: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  canWrite: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const Permission = mongoose.model('Permission', PermissionSchema);

module.exports = { Permission, PermissionSchema };
