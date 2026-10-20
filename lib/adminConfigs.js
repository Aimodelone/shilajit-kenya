/**
 * lib/adminConfigs.js — ES module
 * Central registry of admin CRUD configurations.
 * Import these into thin route wrappers.
 *
 * Note on slugSource:
 *   - string  → adminCrud.js auto-generates slug from that field when slug is absent
 *   - null    → condition `if (slugSource && ...)` is falsy; no slug logic runs;
 *               safe for models (Testimonial, FAQ) that have no slug field
 */

import Product     from '../models/Product.js';
import Benefit     from '../models/Benefit.js';
import BlogPost    from '../models/BlogPost.js';
import Testimonial from '../models/Testimonial.js';
import FAQ         from '../models/FAQ.js';

import {
  productCreateSchema,     productUpdateSchema,
  benefitCreateSchema,     benefitUpdateSchema,
  blogPostCreateSchema,    blogPostUpdateSchema,
  testimonialCreateSchema, testimonialUpdateSchema,
  faqCreateSchema,         faqUpdateSchema,
} from './validation.js';

export const productConfig = {
  label:                   'product',
  Model:                   Product,
  createSchema:            productCreateSchema,
  updateSchema:            productUpdateSchema,
  searchField:             'name',
  slugSource:              'name',
  defaultSort:             { order: 1, createdAt: -1 },
  supportsPublishedFilter: true,
};

export const benefitConfig = {
  label:                   'benefit',
  Model:                   Benefit,
  createSchema:            benefitCreateSchema,
  updateSchema:            benefitUpdateSchema,
  searchField:             'title',
  slugSource:              'title',
  defaultSort:             { order: 1, createdAt: -1 },
  supportsPublishedFilter: true,
};

export const blogPostConfig = {
  label:                   'blog-post',
  Model:                   BlogPost,
  createSchema:            blogPostCreateSchema,
  updateSchema:            blogPostUpdateSchema,
  searchField:             'title',
  slugSource:              'title',
  defaultSort:             { publishedAt: -1 },
  supportsPublishedFilter: true,
};

export const testimonialConfig = {
  label:                   'testimonial',
  Model:                   Testimonial,
  createSchema:            testimonialCreateSchema,
  updateSchema:            testimonialUpdateSchema,
  searchField:             'name',
  slugSource:              null,   // Testimonial has no slug field
  defaultSort:             { order: 1, createdAt: -1 },
  supportsPublishedFilter: true,
};

export const faqConfig = {
  label:                   'faq',
  Model:                   FAQ,
  createSchema:            faqCreateSchema,
  updateSchema:            faqUpdateSchema,
  searchField:             'question',
  slugSource:              null,   // FAQ has no slug field
  defaultSort:             { order: 1, createdAt: -1 },
  supportsPublishedFilter: true,
};
