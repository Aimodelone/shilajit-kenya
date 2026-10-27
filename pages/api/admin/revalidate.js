/**
 * pages/api/admin/revalidate.js
 * POST { type, slug? } — trigger ISR revalidation for the given resource type.
 * Paths are computed server-side; no path is ever accepted from the client.
 */
import { z }    from 'zod';
import { requireAdminApi } from '../../../lib/auth.js';
import { connectToDatabase } from '../../../lib/mongodb.js';
import Product  from '../../../models/Product.js';
import Benefit  from '../../../models/Benefit.js';
import BlogPost from '../../../models/BlogPost.js';

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const bodySchema = z.object({
  type: z.enum(['product', 'benefit', 'blog', 'testimonial', 'faq', 'settings']),
  slug: z.string().regex(SLUG_RE, 'Invalid slug').max(120).optional(),
}).strict();

export default async function handler(req, res) {
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) {
    return res.status(400).json({ error: 'Request body must be a JSON object' });
  }

  const parsed = bodySchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      error: 'Validation failed',
      details: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
    });
  }

  const { type, slug } = parsed.data;

  // Compute paths entirely on the server
  let paths = [];

  switch (type) {
    case 'product':
      paths = ['/', '/products'];
      if (slug) paths.push(`/products/${slug}`);
      break;
    case 'benefit':
      paths = ['/benefits', '/about'];
      if (slug) paths.push(`/benefits/${slug}`);
      break;
    case 'blog':
      paths = ['/', '/blog'];
      if (slug) paths.push(`/blog/${slug}`);
      break;
    case 'testimonial':
      paths = ['/', '/testimonial'];
      break;
    case 'faq':
      paths = ['/', '/faq'];
      break;
    case 'settings': {
      paths = [
        '/', '/about', '/contact', '/products', '/benefits',
        '/blog', '/faq', '/testimonial', '/privacy', '/terms',
      ];
      // Also revalidate every published detail page
      try {
        await connectToDatabase();
        const [prods, bens, posts] = await Promise.all([
          Product.find({ published: true }).select('slug').lean(),
          Benefit.find({ published: true }).select('slug').lean(),
          BlogPost.find({ published: true }).select('slug').lean(),
        ]);
        for (const p of prods)  paths.push(`/products/${p.slug}`);
        for (const b of bens)   paths.push(`/benefits/${b.slug}`);
        for (const bp of posts) paths.push(`/blog/${bp.slug}`);
      } catch (err) {
        console.error('[revalidate settings DB]', err.message);
        // Continue with static paths even if DB query fails
      }
      break;
    }
  }

  const revalidated = [];
  const failed = [];

  for (const path of paths) {
    try {
      await res.revalidate(path);
      revalidated.push(path);
    } catch {
      failed.push(path);
    }
  }

  return res.status(200).json({ revalidated, failed });
}
