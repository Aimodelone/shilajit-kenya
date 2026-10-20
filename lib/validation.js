/**
 * lib/validation.js — ES module
 * Shared Zod schemas and helpers for admin API validation.
 */

import { z } from 'zod';

// ── Image URL allow-list ─────────────────────────────────────────────────────
// Accept ONLY Cloudinary URLs or local /images/ paths.
// Explicitly reject javascript:, data:, http: and all other hosts.
export const imageUrlSchema = z
  .string()
  .max(500)
  .refine(
    (v) => v.startsWith('https://res.cloudinary.com/') || v.startsWith('/images/'),
    { message: 'Image URL must start with "https://res.cloudinary.com/" or "/images/"' }
  );

export const imageSchema = z.object({
  url: imageUrlSchema,
  alt: z.string().max(200).optional(),
});

// ── Slug ─────────────────────────────────────────────────────────────────────
export const slugSchema = z
  .string()
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'Slug must be lowercase letters, numbers and single hyphens only',
  });

// ── slugify helper ───────────────────────────────────────────────────────────
/**
 * Convert free text to a URL-safe slug.
 * - Lowercases
 * - Strips accents (NFD normalisation)
 * - Replaces any run of non [a-z0-9] chars with a single hyphen
 * - Trims leading/trailing hyphens
 * - Truncates to 120 characters
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')                        // decompose accented chars
    .replace(/[\u0300-\u036f]/g, '')         // strip accent marks
    .replace(/[^a-z0-9]+/g, '-')            // non-alphanumeric → hyphen
    .replace(/^-+|-+$/g, '')                // trim leading/trailing hyphens
    .slice(0, 120);
}

// ── Product create schema ────────────────────────────────────────────────────
export const productCreateSchema = z
  .object({
    name:             z.string().trim().min(1).max(200),
    slug:             slugSchema.optional(),
    shortDescription: z.string().min(1).max(300),
    description:      z.string().max(20000).optional(),
    price:            z.number().min(0).max(10_000_000),
    compareAtPrice:   z.number().min(0).max(10_000_000).nullable().optional(),
    currency:         z.literal('KES').optional(),
    coverImage:       imageSchema.optional(),
    images:           z.array(imageSchema).max(20).optional(),
    benefits:         z.array(z.string().max(200)).max(30).optional(),
    howToUse:         z.string().max(5000).optional(),
    ingredients:      z.string().max(5000).optional(),
    certificates:     z.array(imageSchema).max(20).optional(),
    inStock:          z.boolean().optional(),
    featured:         z.boolean().optional(),
    published:        z.boolean().optional(),
    order:            z.number().int().min(0).max(100_000).optional(),
    seoTitle:         z.string().max(70).optional(),
    seoDescription:   z.string().max(170).optional(),
  })
  .strip(); // unknown keys are silently stripped (no passthrough)

// ── Product update schema ────────────────────────────────────────────────────
// All fields optional, but at least one must be present.
export const productUpdateSchema = productCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must contain at least one field',
  });

// ── Benefit create schema ─────────────────────────────────────────────────────
export const benefitCreateSchema = z
  .object({
    title:            z.string().trim().min(1).max(200),
    slug:             slugSchema.optional(),
    shortDescription: z.string().min(1).max(300),
    content:          z.string().max(20000).optional(),
    image:            imageSchema.optional(),
    published:        z.boolean().optional(),
    order:            z.number().int().min(0).max(100_000).optional(),
    seoTitle:         z.string().max(70).optional(),
    seoDescription:   z.string().max(170).optional(),
  })
  .strip();

export const benefitUpdateSchema = benefitCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must contain at least one field',
  });

// ── BlogPost create schema ────────────────────────────────────────────────────
export const blogPostCreateSchema = z
  .object({
    title:          z.string().trim().min(1).max(200),
    slug:           slugSchema.optional(),
    excerpt:        z.string().min(1).max(300),
    content:        z.string().min(1).max(100_000),
    coverImage:     imageSchema.optional(),
    author:         z.string().max(100).optional(),
    category:       z.string().max(80).optional(),
    tags:           z.array(z.string().trim().min(1).max(50)).max(20).optional(),
    // publishedAt: accepts ISO 8601 strings like "2026-08-01" or "2026-08-01T10:00:00Z"
    // and transforms them to Date objects.  Anything that Date.parse rejects → 400.
    publishedAt:    z.string()
      .refine(
        (v) => !isNaN(Date.parse(v)),
        { message: 'publishedAt must be a valid ISO 8601 date string (e.g. 2026-08-01)' }
      )
      .transform((v) => new Date(v))
      .optional(),
    published:      z.boolean().optional(),
    seoTitle:       z.string().max(70).optional(),
    seoDescription: z.string().max(170).optional(),
  })
  .strip();

export const blogPostUpdateSchema = blogPostCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must contain at least one field',
  });

// ── Testimonial create schema ─────────────────────────────────────────────────
export const testimonialCreateSchema = z
  .object({
    name:      z.string().trim().min(1).max(120),
    role:      z.string().trim().max(120).optional(),
    message:   z.string().trim().min(1).max(1000),
    photo:     imageSchema.optional(),
    published: z.boolean().optional(),
    order:     z.number().int().min(0).max(100_000).optional(),
  })
  .strip();

export const testimonialUpdateSchema = testimonialCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must contain at least one field',
  });

// ── FAQ create schema ─────────────────────────────────────────────────────────
export const faqCreateSchema = z
  .object({
    question:  z.string().trim().min(1).max(300),
    answer:    z.string().trim().min(1).max(3000),
    category:  z.string().trim().max(80).optional(),
    published: z.boolean().optional(),
    order:     z.number().int().min(0).max(100_000).optional(),
  })
  .strip();

export const faqUpdateSchema = faqCreateSchema
  .partial()
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Update body must contain at least one field',
  });

// ── WhatsApp number helper ────────────────────────────────────────────────────
/**
 * normalizeWhatsappNumber(input)
 * Trims, strips spaces/hyphens/parentheses, removes ONE leading "+".
 * Returns only the remaining digit string.
 */
export function normalizeWhatsappNumber(input) {
  let v = input.trim().replace(/[\s\-()]/g, '');
  if (v.startsWith('+')) v = v.slice(1);
  return v;
}

// ── WhatsApp number schema ────────────────────────────────────────────────────
// Accepts international format strings; normalises and validates.
// Non-strings, null, empty string, leading-0 numbers, and short/long
// digit strings are all invalid.
export const whatsappNumberSchema = z
  .string()
  .transform(normalizeWhatsappNumber)
  .refine(
    (v) => /^[1-9]\d{8,14}$/.test(v),
    { message: 'Use international format without a leading 0, for example 254712345678' }
  );

// ── Social URL schema ─────────────────────────────────────────────────────────
/**
 * socialUrlSchema(allowedDomains)
 * Returns a Zod schema that:
 *   - Trims the input, max 300 chars
 *   - Allows "" (clears the link)
 *   - Otherwise requires HTTPS, no credentials, and a hostname that
 *     equals or is a subdomain of one of the allowedDomains.
 *     e.g. m.facebook.com passes, notfacebook.com and facebook.com.evil.example fail.
 */
export function socialUrlSchema(allowedDomains) {
  return z
    .string()
    .trim()
    .max(300)
    .refine(
      (v) => {
        if (v === '') return true;          // empty clears the link
        let url;
        try { url = new URL(v); } catch { return false; }
        if (url.protocol !== 'https:') return false;
        if (url.username || url.password)  return false;
        const host = url.hostname.toLowerCase();
        return allowedDomains.some(
          (domain) => host === domain || host.endsWith('.' + domain)
        );
      },
      { message: 'Invalid social media URL' }
    );
}

// Allowed domains per network
const FACEBOOK_DOMAINS  = ['facebook.com', 'fb.com'];
const INSTAGRAM_DOMAINS = ['instagram.com'];
const TIKTOK_DOMAINS    = ['tiktok.com'];
const TWITTER_DOMAINS   = ['twitter.com', 'x.com'];
const YOUTUBE_DOMAINS   = ['youtube.com', 'youtu.be'];

// ── Site settings update schema ───────────────────────────────────────────────
// All fields are optional (singleton – any subset may be updated).
// Unknown keys are stripped. No passthrough.
export const siteSettingsUpdateSchema = z
  .object({
    businessName:           z.string().trim().min(1).max(100).optional(),
    tagline:                z.string().trim().max(160).optional(),
    whatsappNumber:         whatsappNumberSchema.optional(),
    whatsappDefaultMessage: z.string().max(500).optional(),
    phone: z.union([
      z.literal(''),
      z.string().regex(/^[0-9+()\s-]+$/).max(30),
    ]).optional(),
    email: z.union([
      z.literal(''),
      z.string().email().max(200),
    ]).optional(),
    address:                z.string().trim().max(300).optional(),
    city:                   z.string().trim().max(100).optional(),
    openingHours:           z.string().trim().max(300).optional(),
    socialLinks: z.object({
      facebook:  socialUrlSchema(FACEBOOK_DOMAINS).optional(),
      instagram: socialUrlSchema(INSTAGRAM_DOMAINS).optional(),
      tiktok:    socialUrlSchema(TIKTOK_DOMAINS).optional(),
      twitter:   socialUrlSchema(TWITTER_DOMAINS).optional(),
      youtube:   socialUrlSchema(YOUTUBE_DOMAINS).optional(),
    }).strip().optional(),
    defaultSeoTitle:       z.string().max(70).optional(),
    defaultSeoDescription: z.string().max(170).optional(),
    ogImage: z.union([imageSchema, z.null()]).optional(),
  })
  .strip();

