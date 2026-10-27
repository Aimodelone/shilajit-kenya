/**
 * pages/api/admin/login.js
 * POST only — validates credentials and issues a JWT auth cookie.
 *
 * Security measures implemented:
 *  - Rate limit checked BEFORE any bcrypt/DB work
 *  - Constant-time dummy bcrypt compare when email not found (prevents timing attacks)
 *  - Identical error message for bad email vs bad password
 *  - Token never in response body — HttpOnly cookie only
 *  - Zod input validation
 */

import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../../lib/mongodb';
import AdminUser from '../../../models/AdminUser';
import { signToken, setAuthCookie } from '../../../lib/auth';
import { isBlocked, recordFailure, reset } from '../../../lib/rateLimit';

// Dummy hash computed once at module load so bcrypt.compare always runs,
// preventing timing-based email enumeration.
// Cost factor 10 matches a typical real hash without being too slow.
const DUMMY_HASH = bcrypt.hashSync('__dummy_shilajit_placeholder__', 10);

const loginSchema = z.object({
  email:    z.string().email().max(200),
  password: z.string().min(1).max(200),
});

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) return forwarded.split(',')[0].trim();
  return req.socket?.remoteAddress ?? 'unknown';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = getClientIp(req);

  // ── 1. Rate limit check (before any expensive work) ────────────────────────
  if (isBlocked(ip)) {
    return res.status(429).json({ error: 'Too many attempts. Try again later.' });
  }

  // ── 2. Input validation ────────────────────────────────────────────────────
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid request' });
  }
  const { email, password } = parsed.data;

  try {
    // ── 3. DB lookup ─────────────────────────────────────────────────────────
    await connectToDatabase();
    const user = await AdminUser.findOne({ email: email.toLowerCase() }).lean();

    // ── 4. Constant-time password check ──────────────────────────────────────
    // Always run bcrypt.compare — use the dummy hash when user not found.
    const hashToCheck = user ? user.passwordHash : DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCheck);

    if (!valid || !user) {
      recordFailure(ip);
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // ── 5. Success ─────────────────────────────────────────────────────────
    reset(ip);
    const token = signToken({ email: user.email });
    setAuthCookie(res, token);
    return res.status(200).json({ success: true, email: user.email });

  } catch (err) {
    console.error('[login] unexpected error:', err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
