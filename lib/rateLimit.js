/**
 * lib/rateLimit.js — ES module
 * In-memory failed-login rate limiter.
 *
 * NOTE: This store is per server instance and is reset on restart.
 * On serverless/multi-instance deployments it provides limited protection.
 * It is a basic brute-force brake, NOT a full protection solution.
 * For production hardening consider Redis-backed rate limiting.
 */

const WINDOW_MS  = 15 * 60 * 1000; // 15 minutes
const MAX_FAILS  = 5;               // block after this many failures

/** @type {Map<string, { count: number, windowStart: number }>} */
const store = new Map();

function getRecord(ip) {
  const now = Date.now();
  let rec = store.get(ip);
  if (!rec || now - rec.windowStart > WINDOW_MS) {
    // New window
    rec = { count: 0, windowStart: now };
    store.set(ip, rec);
  }
  return rec;
}

/** Returns true if the IP is currently blocked (≥ MAX_FAILS failures in the window). */
export function isBlocked(ip) {
  const rec = getRecord(ip);
  return rec.count >= MAX_FAILS;
}

/** Record a failed login attempt for the IP. */
export function recordFailure(ip) {
  const rec = getRecord(ip);
  rec.count += 1;
  store.set(ip, rec);
}

/** Reset the failure count for the IP (call on successful login). */
export function reset(ip) {
  store.delete(ip);
}
