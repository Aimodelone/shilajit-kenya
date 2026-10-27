const mongoose = require('mongoose');
const { imageSchema, slugRegex } = require('./shared');

const BenefitSchema = new mongoose.Schema(
  {
    title:            { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, trim: true, lowercase: true, match: slugRegex },
    shortDescription: { type: String, required: true, maxlength: 300 },
    content:          { type: String }, // long text — plain text or Markdown
    image:            { type: imageSchema },
    category:         { type: String, trim: true, maxlength: 40 },
    published:        { type: Boolean, default: true },
    order:            { type: Number, default: 0 },
    seoTitle:         { type: String, maxlength: 70 },
    seoDescription:   { type: String, maxlength: 170 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Benefit || mongoose.model('Benefit', BenefitSchema);
