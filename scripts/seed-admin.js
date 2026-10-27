/**
 * scripts/seed-admin.js — CommonJS
 * Creates or updates the AdminUser document from environment variables.
 * Run with: node --env-file=.env.local scripts/seed-admin.js
 *
 * SECRETS RULE: this script never prints passwords, hashes, or the URI.
 */

'use strict';

const mongoose  = require('mongoose');
const AdminUser = require('../models/AdminUser');

async function main() {
  const uri      = process.env.MONGODB_URI;
  const email    = process.env.ADMIN_EMAIL;
  const hash     = process.env.ADMIN_PASSWORD_HASH;

  // ── Guard: refuse to run with incomplete or invalid values ────────────────
  if (!uri) {
    console.error('ERROR: MONGODB_URI is not set.');
    process.exit(1);
  }
  if (!email) {
    console.error('ERROR: ADMIN_EMAIL is not set.');
    process.exit(1);
  }
  if (!hash || !hash.startsWith('$2')) {
    console.error('ERROR: ADMIN_PASSWORD_HASH is not set or does not start with "$2" (not a bcrypt hash).');
    process.exit(1);
  }

  await mongoose.connect(uri, { bufferCommands: false });

  await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase() },
    { email: email.toLowerCase(), passwordHash: hash },
    { upsert: true, returnDocument: 'after' }
  );

  const count = await AdminUser.countDocuments();
  console.log(`AdminUser upserted for ${email.toLowerCase()}`);
  console.log(`Total AdminUser count: ${count}`);

  await mongoose.disconnect();
}

main().catch(e => {
  console.error('Seed failed:', e.message);
  process.exit(1);
});
