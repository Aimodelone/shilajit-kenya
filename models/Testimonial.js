const mongoose = require('mongoose');
const { imageSchema } = require('./shared');

const TestimonialSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true },
    role:      { type: String, trim: true },
    message:   { type: String, required: true, maxlength: 1000 },
    photo:     { type: imageSchema },
    published: { type: Boolean, default: true },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Testimonial || mongoose.model('Testimonial', TestimonialSchema);
