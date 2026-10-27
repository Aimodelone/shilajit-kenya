const mongoose = require('mongoose');
const { imageSchema } = require('./shared');

// WhatsApp number: digits only, 9–15 chars, country code included (e.g. 254793313743)
const WA_RE = /^\d{9,15}$/;

const SiteSettingsSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'main',
      unique: true,
      immutable: true,
    },
    businessName:           { type: String, default: 'Shilajit Kenya' },
    tagline:                { type: String },
    whatsappNumber: {
      type: String,
      validate: {
        validator: function (v) { return !v || WA_RE.test(v); },
        message: 'whatsappNumber must be digits only, 9–15 characters (e.g. 254793313743)',
      },
    },
    whatsappDefaultMessage: { type: String, maxlength: 500 },
    phone:                  { type: String },
    email:                  { type: String },
    address:                { type: String },
    city:                   { type: String },
    openingHours:           { type: String },
    socialLinks: {
      facebook:  { type: String },
      instagram: { type: String },
      tiktok:    { type: String },
      twitter:   { type: String },
      youtube:   { type: String },
    },
    defaultSeoTitle:       { type: String, maxlength: 70 },
    defaultSeoDescription: { type: String, maxlength: 170 },
    ogImage:               { type: imageSchema },
  },
  { timestamps: true }
);

/**
 * SiteSettings.getMain()
 * Returns the singleton settings document, creating it with defaults if absent.
 */
SiteSettingsSchema.statics.getMain = function () {
  return this.findOneAndUpdate(
    { key: 'main' },
    { $setOnInsert: { key: 'main' } },
    { upsert: true, returnDocument: 'after' }
  );
};

module.exports = mongoose.models.SiteSettings || mongoose.model('SiteSettings', SiteSettingsSchema);
