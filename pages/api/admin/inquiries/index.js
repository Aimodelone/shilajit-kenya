/**
 * pages/api/admin/inquiries/index.js
 * GET /api/admin/inquiries — paginated list with q (multi-field search) and read filter.
 */
import { requireAdminApi } from '../../../../lib/auth.js';
import { connectToDatabase } from '../../../../lib/mongodb.js';
import Inquiry from '../../../../models/Inquiry.js';

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function firstString(v) {
  if (Array.isArray(v)) return typeof v[0] === 'string' ? v[0] : null;
  return typeof v === 'string' ? v : null;
}

export default async function handler(req, res) {
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();

    const page  = Math.max(1, parseInt(req.query.page)  || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const skip  = (page - 1) * limit;

    const filter = {};

    if (req.query.read === 'true')  filter.read = true;
    if (req.query.read === 'false') filter.read = false;

    const rawQ = firstString(req.query.q);
    if (rawQ) {
      const re = { $regex: escapeRegex(rawQ), $options: 'i' };
      filter.$or = [
        { name:        re },
        { message:     re },
        { phone:       re },
        { email:       re },
        { productName: re },
      ];
    }

    const [items, total] = await Promise.all([
      Inquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Inquiry.countDocuments(filter),
    ]);

    return res.status(200).json({ items, total, page, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[inquiries GET]', err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
