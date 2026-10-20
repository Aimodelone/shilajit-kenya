/**
 * lib/data.js — ES module
 * Data-fetching helpers for getStaticProps. All functions connect to the
 * database and return JSON-safe plain objects (no Date / ObjectId instances)
 * via JSON.parse(JSON.stringify(lean())).
 */

import { connectToDatabase } from './mongodb.js';
import { getSiteSettings }   from './siteSettings.js';
import Product    from '../models/Product.js';
import Benefit    from '../models/Benefit.js';
import BlogPost   from '../models/BlogPost.js';
import Testimonial from '../models/Testimonial.js';
import FAQ        from '../models/Faq.js';

/** Make any mongoose result JSON-safe (converts ObjectId, Date → string). */
function toJson(obj) {
  return JSON.parse(JSON.stringify(obj));
}

/** Fetch the singleton SiteSettings document. */
export async function getSettings() {
  await connectToDatabase();
  return getSiteSettings();
}

/**
 * Fetch published products, sorted by order.
 * @param {{ featuredOnly?: boolean, limit?: number }} opts
 */
export async function getProducts({ featuredOnly = false, limit = 0 } = {}) {
  await connectToDatabase();
  const filter = { published: true };
  if (featuredOnly) filter.featured = true;
  let q = Product.find(filter).sort({ order: 1 }).lean();
  if (limit > 0) q = q.limit(limit);
  const docs = await q;
  return toJson(docs);
}

/**
 * Fetch a single published product by slug.
 * Returns null when not found or not published.
 */
export async function getProductBySlug(slug) {
  await connectToDatabase();
  const doc = await Product.findOne({ slug, published: true }).lean();
  return doc ? toJson(doc) : null;
}

/**
 * Fetch up to 3 other published products (simple related: same featured flag,
 * different slug, sorted by order).
 */
export async function getRelatedProducts(slug) {
  await connectToDatabase();
  const docs = await Product.find({ published: true, slug: { $ne: slug } })
    .sort({ order: 1 })
    .limit(3)
    .lean();
  return toJson(docs);
}

/** Fetch all published testimonials sorted by order. */
export async function getTestimonials() {
  await connectToDatabase();
  const docs = await Testimonial.find({ published: true }).sort({ order: 1 }).lean();
  return toJson(docs);
}

/** Fetch all published FAQs sorted by order. */
export async function getFaqs() {
  await connectToDatabase();
  const docs = await FAQ.find({ published: true }).sort({ order: 1 }).lean();
  return toJson(docs);
}

/**
 * Fetch latest published blog posts, sorted by publishedAt descending.
 * @param {number} limit  Default 3.
 */
export async function getLatestPosts(limit = 3) {
  await connectToDatabase();
  const docs = await BlogPost.find({ published: true })
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();
  return toJson(docs);
}

/** Fetch ALL published blog posts sorted by publishedAt descending. */
export async function getBlogPosts(limit = 0) {
  await connectToDatabase();
  let q = BlogPost.find({ published: true }).sort({ publishedAt: -1 }).lean();
  if (limit > 0) q = q.limit(limit);
  const docs = await q;
  return toJson(docs);
}

/** Fetch a single published blog post by slug. Returns null if not found. */
export async function getBlogPostBySlug(slug) {
  await connectToDatabase();
  const doc = await BlogPost.findOne({ slug, published: true }).lean();
  return doc ? toJson(doc) : null;
}

/** Return all published blog slugs for getStaticPaths. */
export async function getAllBlogSlugs() {
  await connectToDatabase();
  const docs = await BlogPost.find({ published: true }).select('slug').lean();
  return docs.map((d) => d.slug);
}

/** Fetch all published benefits sorted by order. */
export async function getBenefits() {
  await connectToDatabase();
  const docs = await Benefit.find({ published: true }).sort({ order: 1 }).lean();
  return toJson(docs);
}

/** Fetch a single published benefit by slug. Returns null if not found. */
export async function getBenefitBySlug(slug) {
  await connectToDatabase();
  const doc = await Benefit.findOne({ slug, published: true }).lean();
  return doc ? toJson(doc) : null;
}

/** Return all published benefit slugs for getStaticPaths. */
export async function getAllBenefitSlugs() {
  await connectToDatabase();
  const docs = await Benefit.find({ published: true }).select('slug').lean();
  return docs.map((d) => d.slug);
}
