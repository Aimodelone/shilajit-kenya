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
