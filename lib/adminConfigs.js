/**
 * lib/adminConfigs.js — ES module
 * Central registry of admin CRUD configurations.
 * Import these into thin route wrappers.
 */

import Product from '../models/Product.js';
import { productCreateSchema, productUpdateSchema } from './validation.js';

export const productConfig = {
  label:                  'product',
  Model:                  Product,
  createSchema:           productCreateSchema,
  updateSchema:           productUpdateSchema,
  searchField:            'name',
  slugSource:             'name',          // auto-slugify from name when slug is absent
  defaultSort:            { order: 1, createdAt: -1 },
  supportsPublishedFilter: true,
};
