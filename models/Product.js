const mongoose = require('mongoose');
const { imageSchema, slugRegex } = require('./shared');

const ProductSchema = new mongoose.Schema(
  {
    name:             { type: String, required: true, trim: true },
    slug:             { type: String, required: true, unique: true, trim: true, lowercase: true, match: slugRegex },
    shortDescription: { type: String, required: true, maxlength: 300 },
    description:      { type: String }, // long description — plain text or Markdown
    price:            { type: Number, required: true, min: 0 }, // Kenyan shillings
    compareAtPrice:   { type: Number, min: 0 },                 // optional old/crossed-out price
    currency:         { type: String, default: 'KES' },
    coverImage:       { type: imageSchema },
    images:           { type: [imageSchema], default: [] },
    benefits:         { type: [String], default: [] },
    howToUse:         { type: String },
    ingredients:      { type: String },
    certificates:     { type: [imageSchema], default: [] },
    inStock:          { type: Boolean, default: true },
    featured:         { type: Boolean, default: false },
    published:        { type: Boolean, default: true },
    order:            { type: Number, default: 0 },
    seoTitle:         { type: String, maxlength: 70 },
    seoDescription:   { type: String, maxlength: 170 },
  },
  { timestamps: true }
);

ProductSchema.index({ published: 1, order: 1 });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
