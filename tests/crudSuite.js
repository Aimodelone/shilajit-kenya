/**
 * tests/crudSuite.js — CommonJS
 * Shared CRUD test suite factory.
 * Called from resource-specific test files; never run directly.
 * Never prints tokens or secrets.
 *
 * opts shape:
 *   label          string   – e.g. 'benefit' (used in check labels + auto-slug title)
 *   basePath       string   – e.g. '/api/admin/benefits'
 *   slugPrefix     string   – e.g. 'zztest-benefit-'  (for cleanup)
 *   buildBody      fn(suffix) => object  – returns a valid create body
 *   requiredField  string   – field to omit for the 400 test
 *   imageField     string   – 'image' or 'coverImage'
 *   base           string   – e.g. 'http://localhost:3000'
 *   cookie         string   – auth cookie header value
 */

'use strict';

const { check, BASE_URL } = require('./helpers');

// ── HTTP helper ────────────────────────────────────────────────────────────────
async function apiReq(base, method, path, opts = {}) {
  const headers = { 'Content-Type': 'application/json', ...(opts.headers || {}) };
  if (opts.cookie) headers['Cookie'] = opts.cookie;
  let body;
  if (opts.rawBody !== undefined) {
    body = opts.rawBody;
  } else if (opts.body !== undefined) {
    body = JSON.stringify(opts.body);
  }
  const start = Date.now();
  const res = await fetch(`${base}${path}`, { method, headers, body, redirect: 'manual' });
  const elapsed = Date.now() - start;
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, json, headers: res.headers, elapsed };
}

async function runCrudSuite(opts) {
  const {
    label,
    basePath,
    slugPrefix,
    buildBody,
    requiredField,
    imageField,
    base = BASE_URL,
    cookie,
  } = opts;

  const FAKE_ID   = '507f1f77bcf86cd799439011'; // valid ObjectId that doesn't exist
  const req = (method, path, ropts = {}) => apiReq(base, method, path, { ...ropts, cookie: ropts.cookie ?? cookie });

  let firstId   = '';
  const secondSlug = `${slugPrefix}002`;

  console.log(`\n=== Shared CRUD checks: ${label} ===`);

  // ── a) No-cookie 401s ─────────────────────────────────────────────────────
  console.log('\n-- a) No cookie → 401 --');
  for (const [method, path, body] of [
    ['GET',    basePath,               undefined],
    ['POST',   basePath,               buildBody('noc')],
    ['GET',    `${basePath}/${FAKE_ID}`, undefined],
    ['PUT',    `${basePath}/${FAKE_ID}`, { published: false }],
    ['DELETE', `${basePath}/${FAKE_ID}`, undefined],
  ]) {
    const res = await apiReq(base, method, path, { body }); // no cookie
    const short = path === basePath ? basePath : `${basePath}/:id`;
    check(`${method} ${short} no cookie → 401`, res.status === 401, `Got ${res.status}`);
  }

  // ── b) Valid create 201 ───────────────────────────────────────────────────
  console.log('\n-- b) Valid create 201 --');
  {
    const res = await req('POST', basePath, { body: buildBody('001') });
    check(`Valid ${label} → 201`, res.status === 201, `Got ${res.status}: ${JSON.stringify(res.json)}`);
    check(`Response has _id`, !!res.json?._id);
    firstId = res.json?._id || '';
  }

  // ── c) Duplicate slug → 409 ───────────────────────────────────────────────
  console.log('\n-- c) Duplicate slug → 409 --');
  {
    const res = await req('POST', basePath, { body: buildBody('001') });
    check('Duplicate slug → 409', res.status === 409, `Got ${res.status}`);
  }

  // ── d) Bad slug → 400 ────────────────────────────────────────────────────
  console.log('\n-- d) Bad slug → 400 --');
  {
    const body = { ...buildBody('bad-slug'), slug: 'Bad Slug' };
    const res = await req('POST', basePath, { body });
    check('"Bad Slug" → 400', res.status === 400, `Got ${res.status}`);
  }

  // ── e) Missing required field → 400 ──────────────────────────────────────
  console.log(`\n-- e) Missing ${requiredField} → 400 --`);
  {
    const body = { ...buildBody('missing-req') };
    delete body[requiredField];
    const res = await req('POST', basePath, { body });
    check(`Missing ${requiredField} → 400`, res.status === 400, `Got ${res.status}`);
  }

  // ── f) Image URL allow-list ───────────────────────────────────────────────
  console.log('\n-- f) Image URL allow-list --');
  {
    const res1 = await req('POST', basePath, {
      body: { ...buildBody('img-js'), [imageField]: { url: 'javascript:alert(1)' } },
    });
    check('"javascript:alert(1)" → 400', res1.status === 400, `Got ${res1.status}`);

    const res2 = await req('POST', basePath, {
      body: { ...buildBody('img-http'), [imageField]: { url: 'http://evil.example/x.jpg' } },
    });
    check('"http://evil.example/x.jpg" → 400', res2.status === 400, `Got ${res2.status}`);

    const res3 = await req('POST', basePath, {
      body: { ...buildBody('img-local'), [imageField]: { url: '/images/product/1.jpg' } },
    });
    check('"/images/product/1.jpg" → 201', res3.status === 201, `Got ${res3.status}`);
  }

  // ── g) Extra fields stripped ──────────────────────────────────────────────
  console.log('\n-- g) Extra fields stripped --');
  {
    const fakeId = '507f1f77bcf86cd799439099';
    const body = { ...buildBody('extras'), _id: fakeId, createdAt: '2020-01-01', hacker: true };
    const res = await req('POST', basePath, { body });
    check('POST with extra fields → 201', res.status === 201, `Got ${res.status}`);
    check('_id differs from supplied fake', res.json?._id !== fakeId, `Got ${res.json?._id}`);
    check('No "hacker" field in response', !('hacker' in (res.json || {})));
  }

  // ── h) Auto-slug from title ───────────────────────────────────────────────
  console.log('\n-- h) Auto-slug from title --');
  {
    const body = { ...buildBody('autoslug') };
    delete body.slug;
    body.title = `ZZTest ${label} Auto Slug!`; // slugifies to zztest-<label>-auto-slug
    const res = await req('POST', basePath, { body });
    check(`No-slug → 201`, res.status === 201, `Got ${res.status}: ${JSON.stringify(res.json)}`);
    const slug = res.json?.slug || '';
    check(`Generated slug matches /^[a-z0-9]+(?:-[a-z0-9]+)*$/`, /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug), `Got "${slug}"`);
    check(`Generated slug contains "zztest"`, slug.includes('zztest'), `Got "${slug}"`);
  }

  // ── i) List shape and limits ──────────────────────────────────────────────
  console.log('\n-- i) List shape and limits --');
  {
    const res1 = await req('GET', basePath);
    check('List → 200 with { items, total, page, totalPages }',
      res1.status === 200 && Array.isArray(res1.json?.items)
      && typeof res1.json?.total === 'number'
      && typeof res1.json?.page === 'number'
      && typeof res1.json?.totalPages === 'number',
      JSON.stringify(res1.json));

    const res2 = await req('GET', `${basePath}?limit=2`);
    check('limit=2 returns ≤2 items', res2.status === 200 && res2.json?.items?.length <= 2, `Got ${res2.json?.items?.length}`);

    const res3 = await req('GET', `${basePath}?limit=1000`);
    check('limit=1000 capped at 50', res3.status === 200 && res3.json?.items?.length <= 50, `Got ${res3.json?.items?.length}`);
  }

  // ── j) Regex-special q values + NoSQL safety ──────────────────────────────
  console.log('\n-- j) Regex-special q values --');
  for (const q of ['(', '.*', '[']) {
    const res = await req('GET', `${basePath}?q=${encodeURIComponent(q)}`);
    check(`?q=${JSON.stringify(q)} → 200`, res.status === 200, `Got ${res.status}`);
    check(`?q=${JSON.stringify(q)} responds < 2000ms`, res.elapsed < 2000, `Took ${res.elapsed}ms`);
  }
  {
    const res = await req('GET', `${basePath}?q[$ne]=x`);
    check('q[$ne]=x → 200 or 400 (never 500)', res.status === 200 || res.status === 400, `Got ${res.status}`);
  }

  // ── k) GET by id ──────────────────────────────────────────────────────────
  console.log('\n-- k) GET by id --');
  {
    const res1 = await req('GET', `${basePath}/${firstId}`);
    check(`GET by valid id → 200`, res1.status === 200, `Got ${res1.status}`);

    const res2 = await req('GET', `${basePath}/not-an-id`);
    check(`GET invalid ObjectId → 400`, res2.status === 400, `Got ${res2.status}`);

    const res3 = await req('GET', `${basePath}/${FAKE_ID}`);
    check(`GET valid but non-existent id → 404`, res3.status === 404, `Got ${res3.status}`);
  }

  // ── l) PUT ────────────────────────────────────────────────────────────────
  console.log('\n-- l) PUT --');
  {
    // Get original title for "other fields unchanged" check
    const getRes = await req('GET', `${basePath}/${firstId}`);
    const originalTitle = getRes.json?.title;

    const res1 = await req('PUT', `${basePath}/${firstId}`, { body: { published: false } });
    check(`PUT { published:false } → 200`, res1.status === 200, `Got ${res1.status}`);
    check(`published updated to false`, res1.json?.published === false, `Got ${res1.json?.published}`);
    check(`title unchanged after PUT`, res1.json?.title === originalTitle, `Got "${res1.json?.title}"`);

    const res2 = await req('PUT', `${basePath}/${firstId}`, { body: {} });
    check(`PUT {} → 400`, res2.status === 400, `Got ${res2.status}`);

    // Create a second doc to test duplicate-slug rejection via PUT
    const create2 = await req('POST', basePath, { body: buildBody('002') });
    if (create2.status === 201) {
      const res3 = await req('PUT', `${basePath}/${firstId}`, { body: { slug: secondSlug } });
      check(`PUT duplicate slug → 409`, res3.status === 409, `Got ${res3.status}`);
    } else {
      check(`PUT duplicate slug → 409`, false, `Could not create second doc: ${create2.status}`);
    }
  }

  // ── m) DELETE ─────────────────────────────────────────────────────────────
  console.log('\n-- m) DELETE --');
  {
    const res1 = await req('DELETE', `${basePath}/${firstId}`);
    check(`DELETE → 200`, res1.status === 200, `Got ${res1.status}`);

    const res2 = await req('DELETE', `${basePath}/${firstId}`);
    check(`Second DELETE same id → 404`, res2.status === 404, `Got ${res2.status}`);
  }

  // ── n) PATCH list → 405 + Allow ───────────────────────────────────────────
  console.log('\n-- n) PATCH list → 405 --');
  {
    const res = await req('PATCH', basePath, { body: {} });
    check(`PATCH list → 405`, res.status === 405, `Got ${res.status}`);
    check(`Allow header present on 405`, (res.headers.get('allow') || '').length > 0, `Allow: "${res.headers.get('allow')}"`);
  }

  // ── r) JSON array body → 400 ─────────────────────────────────────────────
  console.log('\n-- r) JSON array body → 400 --');
  {
    const res = await req('POST', basePath, { body: [{ title: 'x' }] });
    check(`POST with JSON array body → 400`, res.status === 400, `Got ${res.status}`);
  }

  // ── s) Invalid JSON text → 400, not 500 ──────────────────────────────────
  console.log('\n-- s) Invalid JSON text → 400 (not 500) --');
  {
    const res = await req('POST', basePath, {
      headers: { 'Content-Type': 'application/json' },
      rawBody: 'this is { not valid json',
    });
    check(`Invalid JSON text → 400`, res.status === 400, `Got ${res.status}`);
  }
}

module.exports = { runCrudSuite };
