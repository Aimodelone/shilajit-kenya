/**
 * tests/helpers.js — CommonJS
 * Shared test helpers for admin API integration tests.
 * Never prints tokens, secrets, or passwords.
 */

'use strict';

const mongoose  = require('mongoose');
const bcrypt    = require('bcryptjs');
const crypto    = require('crypto');
const AdminUser = require('../models/AdminUser');

const TEMP_EMAIL = 'zz-test-admin@example.com';

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

// ── Temp admin lifecycle ──────────────────────────────────────────────────────
let _tempPassword = null;

async function createTempAdmin() {
  await connectDB();
  await AdminUser.deleteOne({ email: TEMP_EMAIL }); // clean any leftover
  const pw   = crypto.randomBytes(24).toString('hex'); // never printed
  const hash = await bcrypt.hash(pw, 10);
  await AdminUser.create({ email: TEMP_EMAIL, passwordHash: hash });
  _tempPassword = pw;
  return { email: TEMP_EMAIL }; // password NOT returned in object
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
 * The token value is never printed.
 */
async function login(base) {
  if (!_tempPassword) throw new Error('createTempAdmin() must be called first');
  const r = await fetch(`${base}/api/admin/login`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify({ email: TEMP_EMAIL, password: _tempPassword }),
  });
  if (r.status !== 200) throw new Error(`Login failed with status ${r.status}`);
  const raw = r.headers.get('set-cookie') || '';
  const m   = raw.match(/shilajit_admin_token=[^;]+/);
  if (!m) throw new Error('No auth cookie in login response');
  return m[0]; // just the name=value pair, never logged
}

module.exports = {
  TEMP_EMAIL,
  check,
  getResults,
  exitWithResults,
  connectDB,
  disconnectDB,
  createTempAdmin,
  cleanupTempAdmin,
  login,
};
