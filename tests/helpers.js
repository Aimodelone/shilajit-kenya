/**
 * tests/helpers.js — CommonJS
 * Shared test helpers for admin API integration tests.
 *
 * Safety guarantees:
 *   - BASE_URL must be localhost or 127.0.0.1 (never a deployed site)
 *   - preflight() verifies the correct server is running BEFORE any DB work
 *   - Temp admin cleanup runs in finally even if login or tests fail
 *   - Never prints tokens, secrets, or passwords
 */

'use strict';

const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');
const AdminUser = require('../models/AdminUser');

const TEMP_EMAIL = 'zz-test-admin@example.com';
const BASE_URL   = process.env.TEST_BASE_URL || 'http://localhost:3100';

// ── Safety: refuse to run against a non-local host ────────────────────────────
{
  let hostname = '';
  try { hostname = new URL(BASE_URL).hostname; } catch { /* invalid URL */ }
  if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
    console.error(
      `ERROR: TEST_BASE_URL hostname must be "localhost" or "127.0.0.1".\n` +
      `  Got: "${hostname}" (from BASE_URL="${BASE_URL}")\n` +
      `  Tests must never run against a deployed site.`
    );
    process.exit(1);
  }
}

// ── Result tracking ───────────────────────────────────────────────────────────
let _passed = 0;
let _failed = 0;

function check(label, cond, info) {
  if (cond) {
    console.log(`  PASS  ${label}`);
    _passed++;
  } else {
    console.log(`  FAIL  ${label}`);
    if (info !== undefined) console.log(`        ${info}`);
    _failed++;
  }
}

function getResults() { return { passed: _passed, failed: _failed }; }

function exitWithResults() {
  console.log(`\n=== Results: ${_passed} passed, ${_failed} failed ===\n`);
  process.exit(_failed > 0 ? 1 : 0);
}

// ── DB connection ─────────────────────────────────────────────────────────────
async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI, { bufferCommands: false });
  }
}

async function disconnectDB() {
  await mongoose.disconnect();
}

// ── Preflight: verify the RIGHT server is running ─────────────────────────────
/**
 * Must be called BEFORE any database work.
 * GETs /api/admin/products without a cookie — expects 401 { error: "Not authenticated" }.
 * Any other result means we're talking to the wrong server (or no server).
 * Prints a clear message and exits with code 1 without touching the database.
 */
async function preflight() {
  const url = `${BASE_URL}/api/admin/products`;
  let status, json;
  try {
    const r = await fetch(url, { redirect: 'manual' });
    status = r.status;
    try { json = await r.json(); } catch { json = null; }
  } catch (connErr) {
    console.error(
      `Wrong server or server not running at ${BASE_URL}.\n` +
      `Start this project with: npm run dev`
    );
    process.exit(1);
  }
  if (status !== 401 || json?.error !== 'Not authenticated') {
    console.error(
      `Wrong server or server not running at ${BASE_URL}.\n` +
      `  Expected: 401 { error: "Not authenticated" }\n` +
      `  Got:      ${status} ${JSON.stringify(json)}\n` +
      `Start this project with: npm run dev`
    );
    process.exit(1);
  }
  // Correct server confirmed ✅
}

// ── Temp admin lifecycle ──────────────────────────────────────────────────────
let _tempPassword = null;

async function createTempAdmin() {
  await connectDB();
  await AdminUser.deleteOne({ email: TEMP_EMAIL }); // clear any leftover
  const pw   = crypto.randomBytes(24).toString('hex'); // never printed
  const hash = await bcrypt.hash(pw, 10);
  await AdminUser.create({ email: TEMP_EMAIL, passwordHash: hash });
  _tempPassword = pw;
  return { email: TEMP_EMAIL }; // password NOT returned
}

async function cleanupTempAdmin() {
  await connectDB();
  await AdminUser.deleteOne({ email: TEMP_EMAIL });
  const count = await AdminUser.countDocuments();
  return count;
}

// ── Login ─────────────────────────────────────────────────────────────────────
/**
 * Log in and return the raw cookie header string (shilajit_admin_token=...).
 * On failure: prints status code and error field (no token/password), then throws.
 * The token value is never printed.
 */
async function login(base) {
  if (!_tempPassword) throw new Error('createTempAdmin() must be called first');
  const r = await fetch(`${base}/api/admin/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: TEMP_EMAIL, password: _tempPassword }),
  });
  if (r.status !== 200) {
    let json = null;
    try { json = await r.json(); } catch {}
    throw new Error(`Login failed — status: ${r.status}, error: ${json?.error ?? '(no body)'}`);
  }
  const raw = r.headers.get('set-cookie') || '';
  const m   = raw.match(/shilajit_admin_token=[^;]+/);
  if (!m) throw new Error('No auth cookie in login response');
  return m[0]; // just the name=value pair, never logged
}

module.exports = {
  TEMP_EMAIL,
  BASE_URL,
  check,
  getResults,
  exitWithResults,
  connectDB,
  disconnectDB,
  preflight,
  createTempAdmin,
  cleanupTempAdmin,
  login,
};
