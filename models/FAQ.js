const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema(
  {
    question:  { type: String, required: true, trim: true, maxlength: 300 },
    answer:    { type: String, required: true, maxlength: 3000 },
    category:  { type: String, trim: true },
    published: { type: Boolean, default: true },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.FAQ || mongoose.model('FAQ', FAQSchema);
