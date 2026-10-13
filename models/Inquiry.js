const mongoose = require('mongoose');

// Simple email regex — no heavy library needed
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const InquirySchema = new mongoose.Schema(
  {
    type:        { type: String, enum: ['contact', 'order'], default: 'contact' },
    name:        { type: String, required: true, trim: true, maxlength: 120 },
    phone:       { type: String, trim: true, maxlength: 30 },
    email:       {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: 200,
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

// Schema-level rule: at least one of phone or email must be present
InquirySchema.pre('validate', async function () {
  if (!this.phone && !this.email) {
    this.invalidate(
      'phone',
      'At least one of phone or email must be provided so we can reply to the inquiry'
    );
  }
});

InquirySchema.index({ read: 1, createdAt: -1 });

module.exports = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
