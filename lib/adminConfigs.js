/**
 * lib/adminConfigs.js — ES module
 * Central registry of admin CRUD configurations.
 * Import these into thin route wrappers.
 */

import Product  from '../models/Product.js';
import Benefit  from '../models/Benefit.js';
import BlogPost from '../models/BlogPost.js';

import {
  productCreateSchema,
  productUpdateSchema,
  benefitCreateSchema,
  benefitUpdateSchema,
  blogPostCreateSchema,
  blogPostUpdateSchema,
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
