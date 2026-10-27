const mongoose = require('mongoose');

const AdminUserSchema = new mongoose.Schema(
  {
    email:        { type: String, required: true, unique: true, trim: true, lowercase: true },
    passwordHash: { type: String, required: true },
    name:         { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.AdminUser || mongoose.model('AdminUser', AdminUserSchema);
