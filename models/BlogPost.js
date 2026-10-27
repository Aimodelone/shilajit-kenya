const mongoose = require('mongoose');
const { imageSchema, slugRegex } = require('./shared');

const BlogPostSchema = new mongoose.Schema(
  {
    title:          { type: String, required: true, trim: true },
    slug:           { type: String, required: true, unique: true, trim: true, lowercase: true, match: slugRegex },
    excerpt:        { type: String, required: true, maxlength: 300 },
    content:        { type: String, required: true }, // stored as Markdown
    coverImage:     { type: imageSchema },
    author:         { type: String, default: 'Shilajit Kenya' },
    category:       { type: String, trim: true },
    tags:           { type: [String], default: [] },
    publishedAt:    { type: Date, default: Date.now },
    published:      { type: Boolean, default: true },
    seoTitle:       { type: String, maxlength: 70 },
    seoDescription: { type: String, maxlength: 170 },
  },
  { timestamps: true }
);

BlogPostSchema.index({ published: 1, publishedAt: -1 });

module.exports = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);
