const mongoose = require('mongoose');

// Simple email regex — no heavy library needed
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const REPLY_MSG = 'Provide a phone number or an email so we can reply.';

const InquirySchema = new mongoose.Schema(
  {
    type:        { type: String, enum: ['contact', 'order'], default: 'contact' },
    name:        { type: String, required: true, trim: true, maxlength: 120 },

    // Conditional required: phone is required only when email is absent.
    // This runs on BOTH validateSync() and validate(), unlike pre hooks.
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
      required: [function () { return !this.email; }, REPLY_MSG],
    },

    // Conditional required: email is required only when phone is absent.
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 200,
      required: [function () { return !this.phone; }, REPLY_MSG],
      validate: {
        validator: function (v) { return !v || EMAIL_RE.test(v); },
        message: 'email does not look like a valid email address',
      },
    },

    productName: { type: String, trim: true, maxlength: 200 },
    quantity:    { type: Number, min: 1, max: 1000 },
    subject:     { type: String, trim: true, maxlength: 200 },
    message:     { type: String, required: true, trim: true, maxlength: 2000 },
    sourcePage:  { type: String, trim: true, maxlength: 300 },
    read:        { type: Boolean, default: false },
  },
  { timestamps: true }
);

// No pre('validate') hook — conditional required functions above handle every
// validation path (validateSync, validate, and save) consistently.

InquirySchema.index({ read: 1, createdAt: -1 });

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
