const mongoose = require('mongoose');
const { imageSchema } = require('./shared');

// Extend imageSchema inline so image.url is required for GalleryItems.
// imageSchema itself has _id: false and no required constraint on url,
// so we define a fresh sub-schema here.
const galleryImageSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      trim: true,
      validate: {
        validator: function (v) { return typeof v === 'string' && v.trim().length > 0; },
        message: 'image.url is required for a GalleryItem',
      },
      required: [true, 'image.url is required for a GalleryItem'],
    },
    alt: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false }
);

const GalleryItemSchema = new mongoose.Schema(
  {
    caption:   { type: String, trim: true, maxlength: 200 },
    image:     { type: galleryImageSchema, required: true },
    category:  { type: String, trim: true },
    published: { type: Boolean, default: true },
    order:     { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.GalleryItem || mongoose.model('GalleryItem', GalleryItemSchema);
