/**
 * pages/api/admin/stats.js
 * GET /api/admin/stats — aggregate document counts for the dashboard.
 */
import { requireAdminApi } from '../../../lib/auth.js';
import { connectToDatabase } from '../../../lib/mongodb.js';
import Product    from '../../../models/Product.js';
import Benefit    from '../../../models/Benefit.js';
import BlogPost   from '../../../models/BlogPost.js';
import Testimonial from '../../../models/Testimonial.js';
import FAQ        from '../../../models/FAQ.js';
import Inquiry    from '../../../models/Inquiry.js';

export default async function handler(req, res) {
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectToDatabase();
    const [products, benefits, posts, testimonials, faqs, inquiries, unreadInquiries] =
      await Promise.all([
        Product.countDocuments(),
        Benefit.countDocuments(),
        BlogPost.countDocuments(),
        Testimonial.countDocuments(),
        FAQ.countDocuments(),
        Inquiry.countDocuments(),
        Inquiry.countDocuments({ read: false }),
      ]);

    return res.status(200).json({
      products, benefits, posts, testimonials, faqs, inquiries, unreadInquiries,
    });
  } catch (err) {
    console.error('[stats GET]', err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
