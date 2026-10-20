/**
 * pages/api/inquiries.js — ES module
 * Public inquiry submission endpoint (contact form and order requests).
 *
 * DESIGN: This is the first public write endpoint. Every input is treated as
 * hostile. Rate limiting, honeypot, bot-speed detection and strict Zod
 * validation are layered before any database work. Files are never uploaded
 * here; this endpoint accepts plain JSON only.
 *
 * Flow:
 *   1. Method check    → 405
 *   2. Cache-Control: no-store
 *   3. Content-Type    → 415
 *   4. Rate limit      → 429
 *   5. Body shape      → 400
 *   6. Honeypot        → 200 (silent)
 *   7. Time check      → 200 (silent)
 *   8. Validation      → 400
 *   9. DB save         → 201
 */

import { connectToDatabase }     from '../../lib/mongodb.js';
import { createWindowLimiter }   from '../../lib/rateLimit.js';
import { inquiryCreateSchema }   from '../../lib/validation.js';
import Inquiry                   from '../../models/Inquiry.js';

// Body parser enabled with a 20 KB size limit.
// Next.js automatically returns 413 when the limit is exceeded.
export const config = { api: { bodyParser: { sizeLimit: '20kb' } } };

// ── Rate limiters (module-level — persist across requests on the same instance)
// NOTE: In-memory; per-server-instance. On serverless, protection is partial.
const limiterLong  = createWindowLimiter({ max: 5, windowMs: 10 * 60 * 1000 }); // 5 / 10 min
const limiterShort = createWindowLimiter({ max: 3, windowMs: 60 * 1000 });       // 3 / 60 s

export default async function handler(req, res) {
  // 1. Only POST is accepted.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.setHeader('Cache-Control', 'no-store');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // 2. Every response carries Cache-Control: no-store.
  res.setHeader('Cache-Control', 'no-store');

  // 3. Content-Type must be application/json.
  const ct = req.headers['content-type'] || '';
  if (!ct.startsWith('application/json')) {
    return res.status(415).json({ error: 'Unsupported content type' });
  }

  // 4. Rate limit — before any database work.
  const ip = (
    (req.headers['x-forwarded-for'] || '').split(',')[0].trim() ||
    req.socket?.remoteAddress ||
    'unknown'
  );
  const hitLong  = limiterLong.hit(ip);
  const hitShort = limiterShort.hit(ip);
  if (!hitLong.allowed || !hitShort.allowed) {
    const retryAfter = Math.max(
      hitLong.allowed  ? 0 : hitLong.retryAfterSeconds,
      hitShort.allowed ? 0 : hitShort.retryAfterSeconds,
    );
    res.setHeader('Retry-After', String(retryAfter));
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  try {
    const body = req.body;

    // 5. Body must be a plain object (not array, null, or primitive).
    if (typeof body !== 'object' || body === null || Array.isArray(body)) {
      return res.status(400).json({ error: 'Invalid request' });
    }

    // 6. Honeypot — non-empty `website` field silently returns success.
    //    Checked before validation so error messages cannot reveal the honeypot's existence.
    const website = typeof body.website === 'string' ? body.website.trim() : '';
    if (website !== '') {
      return res.status(200).json({ success: true });
    }

    // 7. Time check — bot detection via form fill speed.
    if (typeof body.formStartedAt === 'number') {
      const now     = Date.now();
      const elapsed = now - body.formStartedAt;
      // Reject if submitted in under 3 s, or if timestamp is > 5 s in the future.
      if (elapsed < 3000 || body.formStartedAt > now + 5000) {
        return res.status(200).json({ success: true });
      }
    }

    // 8. Validate.
    const parsed = inquiryCreateSchema.safeParse(body);
    if (!parsed.success) {
      return res.status(400).json({
        error:   'Validation failed',
        details: parsed.error.issues.map((i) => ({
          path:    i.path.join('.'),
          message: i.message,
        })),
      });
    }

    // Strip honeypot and time-check fields before saving.
    // eslint-disable-next-line no-unused-vars
    const { website: _w, formStartedAt: _f, ...toSave } = parsed.data;

    // 9. Save — always force read: false; never echo back the document.
    await connectToDatabase();
    const inquiry = new Inquiry({ ...toSave, read: false });
    await inquiry.save();

    return res.status(201).json({ success: true });

  } catch (err) {
    // Log message only — never log env values or user data.
    console.error(err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
