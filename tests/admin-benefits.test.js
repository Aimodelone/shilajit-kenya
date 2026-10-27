/**
 * tests/admin-benefits.test.js — CommonJS
 * Run via: npm run test:api
 * Uses crudSuite.js for shared checks + benefit-specific checks.
 */

'use strict';

const Benefit = require('../models/Benefit');
const {
  BASE_URL,
  check, exitWithResults,
  connectDB, disconnectDB,
  preflight, createTempAdmin, cleanupTempAdmin, login,
} = require('./helpers');
const { runCrudSuite } = require('./crudSuite');

const SLUG_PREFIX = 'zztest-benefit-';

function buildBody(suffix) {
  return {
    title:            `ZZTest Benefit ${suffix}`,
    slug:             `${SLUG_PREFIX}${suffix}`,
    shortDescription: 'A test benefit.',
  };
}

async function post(path, body, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST', headers, body: JSON.stringify(body), redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  console.log('\n=== admin-benefits.test.js ===\n');

  // Preflight BEFORE any DB work
  await preflight();

  await connectDB();
  await Benefit.deleteMany({ slug: { $regex: `^${SLUG_PREFIX}` } });
  await createTempAdmin();

  let cookie = null;
  try {
    cookie = await login(BASE_URL);
  } catch (e) {
    console.error('Login error:', e.message);
  }

  try {
    if (!cookie) {
      console.log('  Skipping tests — login failed.');
    } else {
      await runCrudSuite({
        label:         'benefit',
        basePath:      '/api/admin/benefits',
        slugPrefix:    SLUG_PREFIX,
        buildBody,
        requiredField: 'shortDescription',
        imageField:    'image',
        base:          BASE_URL,
        cookie,
      });

      // ── Benefit-specific checks ──────────────────────────────────────────
      console.log('\n=== Benefit-specific checks ===');

      console.log('\n-- content length --');
      {
        const r = await post('/api/admin/benefits',
          { ...buildBody('longcnt'), content: 'a'.repeat(20001) }, cookie);
        check('content 20001 chars → 400', r.status === 400, `Got ${r.status}`);
      }

      console.log('\n-- order validation --');
      {
        const r1 = await post('/api/admin/benefits',
          { ...buildBody('negord'), order: -1 }, cookie);
        check('order -1 → 400', r1.status === 400, `Got ${r1.status}`);

        const r2 = await post('/api/admin/benefits',
          { ...buildBody('floatord'), order: 1.5 }, cookie);
        check('order 1.5 → 400', r2.status === 400, `Got ${r2.status}`);
      }
    }
  } finally {
    await Benefit.deleteMany({ slug: { $regex: `^${SLUG_PREFIX}` } });
    const adminCount = await cleanupTempAdmin();
    console.log(`\n  Cleanup done. AdminUser count: ${adminCount}`);
    check('AdminUser count is 1', adminCount === 1, `Got ${adminCount}`);
    await disconnectDB();
  }

  exitWithResults();
}

main().catch(e => { console.error('Unhandled:', e.message); process.exit(1); });
