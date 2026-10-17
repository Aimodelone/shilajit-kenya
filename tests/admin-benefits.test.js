/**
 * tests/admin-benefits.test.js — CommonJS
 * Run via: npm run test:api
 * Uses crudSuite.js for shared checks + benefit-specific checks.
 */

'use strict';

const Benefit = require('../models/Benefit');
const {
  check, exitWithResults,
  connectDB, disconnectDB,
  createTempAdmin, cleanupTempAdmin, login,
} = require('./helpers');
const { runCrudSuite } = require('./crudSuite');

const BASE        = 'http://localhost:3000';
const SLUG_PREFIX = 'zztest-benefit-';

function buildBody(suffix) {
  return {
    title:            `ZZTest Benefit ${suffix}`,
    slug:             `${SLUG_PREFIX}${suffix}`,
    shortDescription: 'A test benefit.',
  };
}

async function post(path, body, cookie) {
  const headers = { 'Content-Type': 'application/json', Cookie: cookie };
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST', headers, body: JSON.stringify(body), redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  console.log('\n=== admin-benefits.test.js ===\n');

  await connectDB();
  await Benefit.deleteMany({ slug: { $regex: `^${SLUG_PREFIX}` } });
  await createTempAdmin();
  const cookie = await login(BASE);

  try {
    await runCrudSuite({
      label:         'benefit',
      basePath:      '/api/admin/benefits',
      slugPrefix:    SLUG_PREFIX,
      buildBody,
      requiredField: 'shortDescription',
      imageField:    'image',
      base:          BASE,
      cookie,
    });

    // ── Benefit-specific checks ────────────────────────────────────────────
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
