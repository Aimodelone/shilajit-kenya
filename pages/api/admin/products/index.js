/**
 * pages/api/admin/products/index.js
 * GET (list) and POST (create) for admin products.
 * Authentication is checked as the FIRST operation in every branch.
 */

import mongoose from 'mongoose';
import { requireAdminApi } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { productCreateSchema, slugify } from '../../../../lib/validation';

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getFirstString(val) {
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0] : null;
  return typeof val === 'string' ? val : null;
}

export default async function handler(req, res) {
  // ── Auth: FIRST, before any other work ───────────────────────────────────
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  await connectToDatabase();

  // ── GET: list products ───────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const page  = Math.max(1, parseInt(req.query.page)  || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
      const skip  = (page - 1) * limit;

      const filter = {};

      // published filter (admins can see all; filter only if explicitly requested)
      if (req.query.published === 'true')  filter.published = true;
      if (req.query.published === 'false') filter.published = false;

      // search by name
      const rawQ = getFirstString(req.query.q);
      if (rawQ) {
        filter.name = { $regex: escapeRegex(rawQ), $options: 'i' };
      }

      const [items, total] = await Promise.all([
        Product.find(filter)
          .sort({ order: 1, createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Product.countDocuments(filter),
      ]);

      return res.status(200).json({
        items,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      });
    } catch (err) {
      console.error('[products GET]', err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ── POST: create product ─────────────────────────────────────────────────
  if (req.method === 'POST') {
    try {
      // Body must be a plain object
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Request body must be a JSON object' });
      }

      const parsed = productCreateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        });
      }

      const data = parsed.data;

      // Auto-generate slug from name if not provided
      if (!data.slug) {
        data.slug = slugify(data.name);
      }

      const product = await Product.create(data);
      return res.status(201).json(product);

    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: 'That slug is already in use' });
      }
      console.error('[products POST]', err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ── 405 for all other methods ────────────────────────────────────────────
  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
}
