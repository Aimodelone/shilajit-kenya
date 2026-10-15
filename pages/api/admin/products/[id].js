/**
 * pages/api/admin/products/[id].js
 * GET, PUT, DELETE for a single product by Mongo ObjectId.
 * Authentication is checked as the FIRST operation in every branch.
 */

import mongoose from 'mongoose';
import { requireAdminApi } from '../../../../lib/auth';
import { connectToDatabase } from '../../../../lib/mongodb';
import Product from '../../../../models/Product';
import { productUpdateSchema } from '../../../../lib/validation';

export default async function handler(req, res) {
  // ── Auth: FIRST, before any other work ───────────────────────────────────
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  const { id } = req.query;

  // ── Validate ObjectId ─────────────────────────────────────────────────────
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  await connectToDatabase();

  // ── GET: fetch one product ────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const product = await Product.findById(id).lean();
      if (!product) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(product);
    } catch (err) {
      console.error('[product GET]', err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ── PUT: update one product ───────────────────────────────────────────────
  if (req.method === 'PUT') {
    try {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Request body must be a JSON object' });
      }

      const parsed = productUpdateSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues.map((i) => ({
            path: i.path.join('.'),
            message: i.message,
          })),
        });
      }

      const updated = await Product.findByIdAndUpdate(
        id,
        { $set: parsed.data },
        { returnDocument: 'after', runValidators: true, new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json(updated);

    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ error: 'That slug is already in use' });
      }
      if (err.name === 'ValidationError') {
        return res.status(400).json({ error: 'Validation failed', details: err.message });
      }
      console.error('[product PUT]', err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ── DELETE: remove one product ────────────────────────────────────────────
  if (req.method === 'DELETE') {
    try {
      const deleted = await Product.findByIdAndDelete(id);
      if (!deleted) return res.status(404).json({ error: 'Product not found' });
      return res.status(200).json({ success: true });
    } catch (err) {
      console.error('[product DELETE]', err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ── 405 for all other methods ─────────────────────────────────────────────
  res.setHeader('Allow', 'GET, PUT, DELETE');
  return res.status(405).json({ error: 'Method not allowed' });
}
