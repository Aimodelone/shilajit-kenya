/**
 * lib/auth.js  — ES module (same style as lib/mongodb.js)
 * JWT signing/verification and cookie helpers for the admin panel.
 * JWT_SECRET is read INSIDE each function — never at module top level —
 * so builds don't crash when env vars are empty.
 */

import jwt from 'jsonwebtoken';

export const COOKIE_NAME = 'shilajit_admin_token';

function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      'JWT_SECRET is not set or is shorter than 32 characters. Set it in .env.local.'
    );
  }
  return secret;
}

/** Sign a JWT for the given email. Algorithm: HS256, expires in 7 days. */
export function signToken({ email }) {
  return jwt.sign({ email, role: 'admin' }, getSecret(), {
    algorithm: 'HS256',
    expiresIn: '7d',
  });
}

/**
 * Verify a JWT. Returns the decoded payload or null on ANY error.
 * Only accepts HS256 — rejects alg:none and asymmetric tokens.
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret(), { algorithms: ['HS256'] });
  } catch {
    return null;
  }
}

/** Write the auth cookie to the response. */
export function setAuthCookie(res, token) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=604800${secure}`
  );
}

/** Clear the auth cookie (Max-Age=0 expires it immediately). */
export function clearAuthCookie(res) {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader(
    'Set-Cookie',
    `${COOKIE_NAME}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0${secure}`
  );
}

/** Extract and verify the admin token from the request cookie. */
export function getAdminFromReq(req) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return null;
  return verifyToken(token);
}

/**
 * Guard for admin API routes.
 * Returns the JWT payload if authenticated, or responds 401 and returns null.
 * Every route calls this itself — never rely solely on middleware.
 */
export function requireAdminApi(req, res) {
  const payload = getAdminFromReq(req);
  if (!payload) {
    res.status(401).json({ error: 'Not authenticated' });
    return null;
  }
  return payload;
}
