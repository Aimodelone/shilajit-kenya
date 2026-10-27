/**
 * tests/admin-testimonials.test.js — CommonJS
 * Run via: npm run test:api
 */
'use strict';

const Testimonial = require('../models/Testimonial');
const {
  BASE_URL, check, exitWithResults,
  connectDB, disconnectDB,
  preflight, createTempAdmin, cleanupTempAdmin, login,
} = require('./helpers');
const { runCrudSuite } = require('./crudSuite');

function buildBody(suffix) {
  return {
    name:    `ZZTest Testimonial ${suffix}`,
    message: 'A test testimonial message.',
  };
}

async function apiFetch(method, path, body, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  console.log('\n=== admin-testimonials.test.js ===\n');

  await preflight();

  await connectDB();
  await Testimonial.deleteMany({ name: { $regex: '^ZZTest Testimonial' } });
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
        label:         'testimonial',
        basePath:      '/api/admin/testimonials',
        slugPrefix:    'zztest-testimonial-',
        buildBody,
        requiredField: 'message',   // shared suite: missing message → 400
        imageField:    null,        // no shared image URL checks; done below as specific
        primaryField:  'name',      // "name unchanged after PUT"
        hasSlug:       false,
        base:          BASE_URL,
        cookie,
      });

      // ── Testimonial-specific checks ────────────────────────────────────────
      console.log('\n=== Testimonial-specific checks ===');

      console.log('\n-- message length --');
      {
        const r = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial msglen', message: 'a'.repeat(1001) }, cookie);
        check('message 1001 chars → 400', r.status === 400, `Got ${r.status}`);
      }

      console.log('\n-- required fields --');
      {
        const r = await apiFetch('POST', '/api/admin/testimonials',
          { message: 'A message without a name.' }, cookie);
        check('missing name → 400', r.status === 400, `Got ${r.status}`);
      }

      console.log('\n-- photo optional --');
      {
        const r = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial nophoto', message: 'A message without a photo.' }, cookie);
        check('created without a photo → 201', r.status === 201, `Got ${r.status}`);
      }

      console.log('\n-- photo URL allow-list --');
      {
        const r1 = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial js', message: 'msg', photo: { url: 'javascript:alert(1)' } }, cookie);
        check('photo url "javascript:alert(1)" → 400', r1.status === 400, `Got ${r1.status}`);

        const r2 = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial http', message: 'msg', photo: { url: 'http://evil.example/p.jpg' } }, cookie);
        check('photo url "http://evil.example/p.jpg" → 400', r2.status === 400, `Got ${r2.status}`);

        const r3 = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial localimg', message: 'msg', photo: { url: '/images/testimonial/ts1.png' } }, cookie);
        check('photo url "/images/testimonial/ts1.png" → 201', r3.status === 201, `Got ${r3.status}`);
      }

      console.log('\n-- published filter --');
      {
        const pub = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial Pub Filter YES', message: 'msg', published: true }, cookie);
        const unpub = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial Pub Filter NO', message: 'msg', published: false }, cookie);
        check('Create published test testimonial → 201', pub.status === 201, `Got ${pub.status}`);
        check('Create unpublished test testimonial → 201', unpub.status === 201, `Got ${unpub.status}`);

        const r = await apiFetch('GET', '/api/admin/testimonials?published=false&q=Pub+Filter', undefined, cookie);
        check('?published=false → 200', r.status === 200, `Got ${r.status}`);
        const items = r.json?.items || [];
        check('?published=false returns only unpublished items',
          items.length > 0 && items.every(i => i.published === false),
          `items: ${items.map(i => `${i.name}:${i.published}`).join(', ')}`);
        check('?published=false does NOT return the published testimonial',
          !items.some(i => i.name === 'ZZTest Testimonial Pub Filter YES'),
          `Names: ${items.map(i => i.name).join(', ')}`);
      }

      console.log('\n-- order sort (ascending) --');
      {
        const high = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial Sort High', message: 'msg', order: 10 }, cookie);
        const low = await apiFetch('POST', '/api/admin/testimonials',
          { name: 'ZZTest Testimonial Sort Low', message: 'msg', order: 1 }, cookie);
        check('Create high-order testimonial → 201', high.status === 201, `Got ${high.status}`);
        check('Create low-order testimonial → 201', low.status === 201, `Got ${low.status}`);

        const r = await apiFetch('GET', '/api/admin/testimonials?q=ZZTest+Testimonial+Sort&limit=10', undefined, cookie);
        check('Sort list GET → 200', r.status === 200, `Got ${r.status}`);
        const names = (r.json?.items || []).map(i => i.name);
        const lowIdx  = names.indexOf('ZZTest Testimonial Sort Low');
        const highIdx = names.indexOf('ZZTest Testimonial Sort High');
        check('Low-order (1) appears before high-order (10) [ascending]',
          lowIdx !== -1 && highIdx !== -1 && lowIdx < highIdx,
          `Order in list: ${names.join(', ')}`);
      }
    }
  } finally {
    await Testimonial.deleteMany({ name: { $regex: '^ZZTest Testimonial' } });
    const adminCount = await cleanupTempAdmin();
    console.log(`\n  Cleanup done. AdminUser count: ${adminCount}`);
    check('AdminUser count is 1', adminCount === 1, `Got ${adminCount}`);
    await disconnectDB();
  }

  exitWithResults();
}

main().catch(e => { console.error('Unhandled:', e.message); process.exit(1); });
