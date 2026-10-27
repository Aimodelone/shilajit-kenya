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

// ── General-purpose sliding-window limiter ────────────────────────────────────
/**
 * createWindowLimiter({ max, windowMs })
 * Returns a limiter that counts ALL requests (not just failures) per key
 * within a rolling time window.
 *
 * NOTE: This store is per server instance and is reset on restart.
 * On serverless/multi-instance deployments it provides limited protection.
 * It is a basic brake only; for production hardening use a Redis-backed solution.
 *
 * @param {{ max: number, windowMs: number }} opts
 * @returns {{ hit(key: string): { allowed: boolean, retryAfterSeconds: number } }}
 */
export function createWindowLimiter({ max, windowMs }) {
  /** @type {Map<string, { count: number, windowStart: number }>} */
  const wStore = new Map();
  const MAX_STORE_SIZE = 5000; // prune when map exceeds this to cap memory

  function prune() {
    const now = Date.now();
    for (const [k, rec] of wStore) {
      if (now - rec.windowStart > windowMs) wStore.delete(k);
    }
  }

  return {
    /**
     * Record a request for `key` and return whether it is allowed.
     * @param {string} key  Typically the client IP address.
     */
    hit(key) {
      if (wStore.size >= MAX_STORE_SIZE) prune();

      const now = Date.now();
      let rec = wStore.get(key);
      if (!rec || now - rec.windowStart > windowMs) {
        rec = { count: 0, windowStart: now };
      }
      rec.count += 1;
      wStore.set(key, rec);

      const allowed = rec.count <= max;
      const retryAfterSeconds = allowed
        ? 0
        : Math.ceil((windowMs - (now - rec.windowStart)) / 1000);
      return { allowed, retryAfterSeconds };
    },
  };
}

