/**
 * lib/adminCrud.js — ES module
 * Generic CRUD handler factory for admin API routes.
 * All behaviour is identical to the hand-written product routes:
 *   - Auth checked FIRST on every method
 *   - Pagination (page default 1, limit default 10, max 50)
 *   - q search: first string only, regex-escaped, case-insensitive
 *   - published filter when supportsPublishedFilter is true
 *   - 400+details on Zod failure, 409 on Mongo 11000, 404 on missing,
 *     405+Allow on wrong method, generic 500 (no internals leaked)
 *
 * config shape:
 *   label               string  – used in console.error prefixes
 *   Model               mongoose Model
 *   createSchema        Zod schema
 *   updateSchema        Zod schema (partial, must have ≥1 key)
 *   searchField         string  – field to apply ?q regex against
 *   slugSource          string|null – field to slugify when slug missing
 *   defaultSort         object  – e.g. { order: 1, createdAt: -1 }
 *   supportsPublishedFilter boolean
 */

import mongoose from 'mongoose';
import { requireAdminApi } from './auth.js';
import { connectToDatabase } from './mongodb.js';
import { slugify } from './validation.js';

// ── Shared helpers ────────────────────────────────────────────────────────────

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getFirstString(val) {
  if (Array.isArray(val)) return typeof val[0] === 'string' ? val[0] : null;
  return typeof val === 'string' ? val : null;
}

function validationErrorResponse(zodError) {
  return {
    error: 'Validation failed',
    details: zodError.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    })),
  };
}

// ── Collection handler (GET list + POST create) ───────────────────────────────

export function createCollectionHandler(config) {
  const {
    label,
    Model,
    createSchema,
    searchField,
    slugSource,
    defaultSort,
    supportsPublishedFilter,
  } = config;

  return async function collectionHandler(req, res) {
    // Auth: FIRST, before any other work
    const admin = requireAdminApi(req, res);
    if (!admin) return;

    await connectToDatabase();

    // ── GET: list ───────────────────────────────────────────────────────────
    if (req.method === 'GET') {
      try {
        const page  = Math.max(1, parseInt(req.query.page)  || 1);
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
        const skip  = (page - 1) * limit;

        const filter = {};

        if (supportsPublishedFilter) {
          if (req.query.published === 'true')  filter.published = true;
          if (req.query.published === 'false') filter.published = false;
        }

        const rawQ = getFirstString(req.query.q);
        if (rawQ) {
          filter[searchField] = { $regex: escapeRegex(rawQ), $options: 'i' };
        }

        const [items, total] = await Promise.all([
          Model.find(filter).sort(defaultSort).skip(skip).limit(limit).lean(),
          Model.countDocuments(filter),
        ]);

        return res.status(200).json({
          items,
          total,
          page,
          totalPages: Math.ceil(total / limit),
        });
      } catch (err) {
        console.error(`[${label} GET]`, err.message);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    }

    // ── POST: create ────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      try {
        if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
          return res.status(400).json({ error: 'Request body must be a JSON object' });
        }

        const parsed = createSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json(validationErrorResponse(parsed.error));
        }

        const data = parsed.data;

        // Auto-generate slug from the configured source field if missing
        if (slugSource && !data.slug && data[slugSource]) {
          data.slug = slugify(data[slugSource]);
        }

        const doc = await Model.create(data);
        return res.status(201).json(doc);

      } catch (err) {
        if (err.code === 11000) {
          return res.status(409).json({ error: 'That slug is already in use' });
        }
        console.error(`[${label} POST]`, err.message);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    }

    // ── 405 ─────────────────────────────────────────────────────────────────
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  };
}

// ── Item handler (GET + PUT + DELETE by id) ───────────────────────────────────

export function createItemHandler(config) {
  const { label, Model, updateSchema } = config;

  return async function itemHandler(req, res) {
    // Auth: FIRST, before any other work
    const admin = requireAdminApi(req, res);
    if (!admin) return;

    const { id } = req.query;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ error: 'Invalid id' });
    }

    await connectToDatabase();

    // ── GET: fetch one ──────────────────────────────────────────────────────
    if (req.method === 'GET') {
      try {
        const doc = await Model.findById(id).lean();
        if (!doc) return res.status(404).json({ error: `${label} not found` });
        return res.status(200).json(doc);
      } catch (err) {
        console.error(`[${label} GET one]`, err.message);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    }

    // ── PUT: update one ─────────────────────────────────────────────────────
    if (req.method === 'PUT') {
      try {
        if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
          return res.status(400).json({ error: 'Request body must be a JSON object' });
        }

        const parsed = updateSchema.safeParse(req.body);
        if (!parsed.success) {
          return res.status(400).json(validationErrorResponse(parsed.error));
        }

        const updated = await Model.findByIdAndUpdate(
          id,
          { $set: parsed.data },
          { returnDocument: 'after', runValidators: true, new: true }
        );
        if (!updated) return res.status(404).json({ error: `${label} not found` });
        return res.status(200).json(updated);

      } catch (err) {
        if (err.code === 11000) {
          return res.status(409).json({ error: 'That slug is already in use' });
        }
        if (err.name === 'ValidationError') {
          return res.status(400).json({ error: 'Validation failed', details: err.message });
        }
        console.error(`[${label} PUT]`, err.message);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    }

    // ── DELETE: remove one ──────────────────────────────────────────────────
    if (req.method === 'DELETE') {
      try {
        const deleted = await Model.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ error: `${label} not found` });
        return res.status(200).json({ success: true });
      } catch (err) {
        console.error(`[${label} DELETE]`, err.message);
        return res.status(500).json({ error: 'Something went wrong' });
      }
    }

    // ── 405 ─────────────────────────────────────────────────────────────────
    res.setHeader('Allow', 'GET, PUT, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  };
}
