/**
 * tests/admin-products.test.js — CommonJS
 * Run with: npm run test:api  (node --env-file=.env.local tests/admin-products.test.js)
 *
 * Tests all Task 9 checks (a–o) plus new checks (p–s).
 * Uses helpers.js for admin lifecycle and check()/PASS/FAIL tracking.
 * All test products use slugs starting with "zztest-".
 * Temp admin and all zztest- products are cleaned up in finally.
 * Never prints secrets, tokens, or passwords.
 */

'use strict';

const mongoose = require('mongoose');
const Product  = require('../models/Product');
const {
  TEMP_EMAIL,
  check,
  exitWithResults,
  connectDB,
  disconnectDB,
  createTempAdmin,
  cleanupTempAdmin,
  login,
} = require('./helpers');

const BASE     = 'http://localhost:3000';
const SLUG_PFX = 'zztest-';

// ── HTTP helper ───────────────────────────────────────────────────────────────
async function req(method, path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (opts.cookie) headers['Cookie'] = opts.cookie;
  let body;
  if (opts.rawBody !== undefined) {
    body = opts.rawBody; // send as-is (for invalid JSON test)
  } else if (opts.body !== undefined) {
    body = JSON.stringify(opts.body);
  }
  const start = Date.now();
  const r = await fetch(`${BASE}${path}`, { method, headers, body, redirect: 'manual' });
  const elapsed = Date.now() - start;
  let json = null;
  try { json = await r.json(); } catch {}
  return { status: r.status, json, headers: r.headers, elapsed };
}

// ── Valid product fixture ─────────────────────────────────────────────────────
function validProduct(overrides = {}) {
  return {
    name:             'ZZTest Shilajit Resin 10g',
    slug:             `${SLUG_PFX}resin-10g`,
    shortDescription: 'A test product. Do not purchase.',
    price:            1500,
    coverImage:       { url: 'https://res.cloudinary.com/demo/image/upload/sample.jpg', alt: 'Test' },
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

async function main() {
  console.log('\n=== admin-products.test.js ===\n');

  // Setup: connect DB, clean leftovers, create temp admin
  await connectDB();
  await Product.deleteMany({ slug: { $regex: `^${SLUG_PFX}` } });
  await createTempAdmin();
  const cookie = await login(BASE);

  let firstId    = '';
  let secondSlug = `${SLUG_PFX}second`;

  try {

    // ── a) No cookie → 401 on every method ──────────────────────────────────
    console.log('-- a) No cookie → 401 on all methods --');
    for (const [m, path, body] of [
      ['GET',    '/api/admin/products',               undefined],
      ['POST',   '/api/admin/products',               validProduct()],
      ['GET',    '/api/admin/products/507f1f77bcf86cd799439011', undefined],
      ['PUT',    '/api/admin/products/507f1f77bcf86cd799439011', { price: 1 }],
      ['DELETE', '/api/admin/products/507f1f77bcf86cd799439011', undefined],
    ]) {
      const r = await req(m, path, { body });
      check(`${m} ${path.replace('/api/admin/products','').slice(0,24) || '/api/admin/products'} no cookie → 401`, r.status === 401, `Got ${r.status}`);
    }

    // ── b) POST valid product → 201 ──────────────────────────────────────────
    console.log('\n-- b) POST valid product → 201 --');
    {
      const r = await req('POST', '/api/admin/products', { cookie, body: validProduct() });
      check('Valid product → 201', r.status === 201, `Got ${r.status}: ${JSON.stringify(r.json)}`);
      check('Response has _id', !!r.json?._id);
      firstId = r.json?._id || '';
    }

    // ── c) Duplicate slug → 409 ───────────────────────────────────────────────
    console.log('\n-- c) Duplicate slug → 409 --');
    {
      const r = await req('POST', '/api/admin/products', { cookie, body: validProduct() });
      check('Duplicate slug → 409', r.status === 409, `Got ${r.status}`);
    }

    // ── d) Bad slug → 400 ────────────────────────────────────────────────────
    console.log('\n-- d) Bad slug → 400 --');
    {
      const r = await req('POST', '/api/admin/products', {
        cookie, body: validProduct({ slug: 'Bad Slug' }),
      });
      check('"Bad Slug" → 400', r.status === 400, `Got ${r.status}`);
    }

    // ── e) Negative price → 400 ──────────────────────────────────────────────
    console.log('\n-- e) Negative price → 400 --');
    {
      const r = await req('POST', '/api/admin/products', {
        cookie, body: validProduct({ slug: `${SLUG_PFX}negprice`, price: -5 }),
      });
      check('price -5 → 400', r.status === 400, `Got ${r.status}`);
    }

    // ── f) Image URL allow-list ───────────────────────────────────────────────
    console.log('\n-- f) Image URL allow-list --');
    {
      const bad1 = await req('POST', '/api/admin/products', {
        cookie, body: validProduct({ slug: `${SLUG_PFX}badimg1`, coverImage: { url: 'javascript:alert(1)' } }),
      });
      check('"javascript:alert(1)" → 400', bad1.status === 400, `Got ${bad1.status}`);

      const bad2 = await req('POST', '/api/admin/products', {
        cookie, body: validProduct({ slug: `${SLUG_PFX}badimg2`, coverImage: { url: 'http://evil.example/x.jpg' } }),
      });
      check('"http://evil.example/x.jpg" → 400', bad2.status === 400, `Got ${bad2.status}`);

      const good = await req('POST', '/api/admin/products', {
        cookie, body: validProduct({ slug: `${SLUG_PFX}localimg`, coverImage: { url: '/images/product/1.jpg' } }),
      });
      check('"/images/product/1.jpg" → 201', good.status === 201, `Got ${good.status}`);
    }

    // ── g) Extra fields stripped ──────────────────────────────────────────────
    console.log('\n-- g) Extra fields stripped --');
    {
      const fakeId = '507f1f77bcf86cd799439099';
      const r = await req('POST', '/api/admin/products', {
        cookie, body: {
          ...validProduct({ slug: `${SLUG_PFX}extrafields` }),
          _id: fakeId, createdAt: '2020-01-01', hacker: true,
        },
      });
      check('POST with extra fields → 201', r.status === 201, `Got ${r.status}`);
      check('Stored _id differs from supplied fake _id', r.json?._id !== fakeId, `Got _id=${r.json?._id}`);
      check('No "hacker" field in response', !('hacker' in (r.json || {})));
    }

    // ── h) Slug auto-generated from name ─────────────────────────────────────
    console.log('\n-- h) Slug auto-generated from name --');
    {
      const r = await req('POST', '/api/admin/products', {
        cookie, body: { name: 'ZZTest Auto Slug Product!', shortDescription: 'Auto slug test.', price: 100 },
      });
      check('No-slug POST → 201', r.status === 201, `Got ${r.status}: ${JSON.stringify(r.json)}`);
      const slug = r.json?.slug || '';
      check('Generated slug matches pattern /^[a-z0-9]+(?:-[a-z0-9]+)*$/', /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), `Got "${slug}"`);
      check('Generated slug derived from name (contains "zztest")', slug.includes('zztest'), `Got "${slug}"`);
    }

    // ── i) GET list ────────────────────────────────────────────────────────────
    console.log('\n-- i) GET list --');
    {
      const r1 = await req('GET', '/api/admin/products', { cookie });
      check('GET list → 200 with { items, total, page, totalPages }',
        r1.status === 200 && Array.isArray(r1.json?.items) && typeof r1.json?.total === 'number'
        && typeof r1.json?.page === 'number' && typeof r1.json?.totalPages === 'number',
        JSON.stringify(r1.json));

      const r2 = await req('GET', '/api/admin/products?limit=2', { cookie });
      check('limit=2 returns ≤2 items', r2.status === 200 && r2.json?.items?.length <= 2, `Got ${r2.json?.items?.length}`);

      const r3 = await req('GET', '/api/admin/products?limit=1000', { cookie });
      check('limit=1000 capped at 50', r3.status === 200 && r3.json?.items?.length <= 50, `Got ${r3.json?.items?.length}`);
    }

    // ── j) Search and query safety ────────────────────────────────────────────
    console.log('\n-- j) Search and query safety --');
    {
      const r1 = await req('GET', '/api/admin/products?q=zztest', { cookie });
      check('?q=zztest finds test products', r1.status === 200 && r1.json?.items?.length > 0, `total=${r1.json?.total}`);

      const r2 = await req('GET', '/api/admin/products?q[$ne]=x', { cookie });
      check('q[$ne]=x → 200 or 400 (never 500)', r2.status === 200 || r2.status === 400, `Got ${r2.status}`);

      const r3 = await req('GET', '/api/admin/products?q=a&q=b', { cookie });
      check('q=a&q=b → 200 or 400 (never 500)', r3.status === 200 || r3.status === 400, `Got ${r3.status}`);
    }

    // ── k) GET by id ──────────────────────────────────────────────────────────
    console.log('\n-- k) GET by id --');
    {
      const r1 = await req('GET', `/api/admin/products/${firstId}`, { cookie });
      check('GET by valid id → 200', r1.status === 200, `Got ${r1.status}`);

      const r2 = await req('GET', '/api/admin/products/not-an-id', { cookie });
      check('GET invalid ObjectId "not-an-id" → 400', r2.status === 400, `Got ${r2.status}`);

      const r3 = await req('GET', '/api/admin/products/507f1f77bcf86cd799439011', { cookie });
      check('GET valid but non-existent ObjectId → 404', r3.status === 404, `Got ${r3.status}`);
    }

    // ── l) PUT ────────────────────────────────────────────────────────────────
    console.log('\n-- l) PUT --');
    {
      const r1 = await req('PUT', `/api/admin/products/${firstId}`, { cookie, body: { price: 4200 } });
      check('PUT { price:4200 } → 200', r1.status === 200, `Got ${r1.status}`);
      check('Updated price is 4200', r1.json?.price === 4200, `Got ${r1.json?.price}`);
      check('Other fields unchanged (name)', r1.json?.name === 'ZZTest Shilajit Resin 10g', `Got "${r1.json?.name}"`);

      const r2 = await req('PUT', `/api/admin/products/${firstId}`, { cookie, body: {} });
      check('PUT {} → 400 (no fields)', r2.status === 400, `Got ${r2.status}`);

      // Create second product, try to change firstId's slug to conflict
      const r3 = await req('POST', '/api/admin/products', {
        cookie, body: validProduct({ slug: secondSlug, name: 'ZZTest Second Product', shortDescription: 'Second test product.' }),
      });
      if (r3.status === 201) {
        const r4 = await req('PUT', `/api/admin/products/${firstId}`, { cookie, body: { slug: secondSlug } });
        check('PUT duplicate slug → 409', r4.status === 409, `Got ${r4.status}`);
      } else {
        check('PUT duplicate slug → 409', false, `Could not create second product: ${r3.status}`);
      }
    }

    // ── m) DELETE ─────────────────────────────────────────────────────────────
    console.log('\n-- m) DELETE --');
    {
      const r1 = await req('DELETE', `/api/admin/products/${firstId}`, { cookie });
      check('DELETE → 200', r1.status === 200, `Got ${r1.status}`);

      const r2 = await req('DELETE', `/api/admin/products/${firstId}`, { cookie });
      check('Second DELETE same id → 404', r2.status === 404, `Got ${r2.status}`);
    }

    // ── n) PATCH list → 405 + Allow header ───────────────────────────────────
    console.log('\n-- n) PATCH list → 405 + Allow --');
    {
      const r = await req('PATCH', '/api/admin/products', { cookie, body: {} });
      check('PATCH list → 405', r.status === 405, `Got ${r.status}`);
      check('Allow header present on 405', (r.headers.get('allow') || '').length > 0, `Allow: "${r.headers.get('allow')}"`);
    }

    // ── p) Regex-special q values, must respond in under 2 seconds ────────────
    console.log('\n-- p) Regex-special q values < 2s --');
    for (const q of ['(', '.*', '[']) {
      const r = await req('GET', `/api/admin/products?q=${encodeURIComponent(q)}`, { cookie });
      check(`?q=${JSON.stringify(q)} → 200`, r.status === 200, `Got ${r.status}`);
      check(`?q=${JSON.stringify(q)} responds in < 2000ms`, r.elapsed < 2000, `Took ${r.elapsed}ms`);
    }

    // ── q) 5000-char q string → 200 or 400, never 500 ────────────────────────
    console.log('\n-- q) 5000-char q → 200 or 400 (never 500) --');
    {
      const bigQ = 'a'.repeat(5000);
      const r = await req('GET', `/api/admin/products?q=${encodeURIComponent(bigQ)}`, { cookie });
      check('5000-char q → 200 or 400 (never 500)', r.status === 200 || r.status === 400, `Got ${r.status}`);
    }

    // ── r) JSON array body → 400 ──────────────────────────────────────────────
    console.log('\n-- r) JSON array body → 400 --');
    {
      const r = await req('POST', '/api/admin/products', { cookie, body: [{ name: 'x' }] });
      check('POST with array body → 400', r.status === 400, `Got ${r.status}`);
    }

    // ── s) Invalid JSON text → 400, not 500 ──────────────────────────────────
    console.log('\n-- s) Invalid JSON text → 400, not 500 --');
    {
      const r = await req('POST', '/api/admin/products', {
        cookie,
        headers: { 'Content-Type': 'application/json' },
        rawBody: 'this is { not valid json',
      });
      check('Invalid JSON text → 400 (not 500)', r.status === 400, `Got ${r.status}`);
    }

  } finally {
    // ── o) Cleanup + count check ──────────────────────────────────────────────
    console.log('\n-- o) Cleanup --');
    await Product.deleteMany({ slug: { $regex: `^${SLUG_PFX}` } });
    const adminCount = await cleanupTempAdmin();
    console.log(`  All zztest- products deleted. AdminUser count: ${adminCount}`);
    check('AdminUser count is 1 (only real admin remains)', adminCount === 1, `Got ${adminCount}`);
    await disconnectDB();
  }

  exitWithResults();
}

main().catch(e => { console.error('Unhandled:', e.message); process.exit(1); });
