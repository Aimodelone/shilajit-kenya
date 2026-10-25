/**
 * pages/api/admin/inquiries/[id].js
 * PATCH { read: boolean }  — mark read/unread
 * DELETE                   — remove inquiry
 */
import mongoose from 'mongoose';
import { z }    from 'zod';
import { requireAdminApi } from '../../../../lib/auth.js';
import { connectToDatabase }  from '../../../../lib/mongodb.js';
import Inquiry  from '../../../../models/Inquiry.js';

// Strict schema: unknown keys → 400
const patchSchema = z.object({ read: z.boolean() }).strict();

export default async function handler(req, res) {
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  const { id } = req.query;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'Invalid id' });
  }

  if (req.method !== 'PATCH' && req.method !== 'DELETE') {
    res.setHeader('Allow', 'PATCH, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    if (req.method === 'PATCH') {
      if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
        return res.status(400).json({ error: 'Request body must be a JSON object' });
      }
      const parsed = patchSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          error: 'Validation failed',
          details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        });
      }
      const updated = await Inquiry.findByIdAndUpdate(
        id,
        { $set: parsed.data },
        { returnDocument: 'after', new: true }
      );
      if (!updated) return res.status(404).json({ error: 'Inquiry not found' });
      return res.status(200).json(updated);
    }

    // DELETE
    const deleted = await Inquiry.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ error: 'Inquiry not found' });
    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('[inquiry item]', err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
