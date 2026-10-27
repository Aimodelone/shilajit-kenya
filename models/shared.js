const mongoose = require('mongoose');

const imageSchema = new mongoose.Schema(
  {
    url: { type: String, trim: true },
    alt: { type: String, trim: true, maxlength: 200 },
  },
  { _id: false }
);

// Slug: lowercase letters, numbers, single hyphens only — keeps URLs clean for SEO
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

module.exports = { imageSchema, slugRegex };
