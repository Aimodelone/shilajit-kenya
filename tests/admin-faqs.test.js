/**
 * tests/admin-faqs.test.js — CommonJS
 * Run via: npm run test:api
 */
'use strict';

const FAQ = require('../models/FAQ');
const {
  BASE_URL, check, exitWithResults,
  connectDB, disconnectDB,
  preflight, createTempAdmin, cleanupTempAdmin, login,
} = require('./helpers');
const { runCrudSuite } = require('./crudSuite');

function buildBody(suffix) {
  return {
    question: `ZZTest FAQ ${suffix}`,
    answer:   'A test FAQ answer.',
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
  console.log('\n=== admin-faqs.test.js ===\n');

  await preflight();

  await connectDB();
  await FAQ.deleteMany({ question: { $regex: '^ZZTest FAQ' } });
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
        label:         'faq',
        basePath:      '/api/admin/faqs',
        slugPrefix:    'zztest-faq-',
        buildBody,
        requiredField: 'question',  // shared suite: missing question → 400
        imageField:    null,        // FAQ has no image field
        primaryField:  'question',  // "question unchanged after PUT"
        hasSlug:       false,
        base:          BASE_URL,
        cookie,
      });

      // ── FAQ-specific checks ────────────────────────────────────────────────
      console.log('\n=== FAQ-specific checks ===');

      console.log('\n-- field length limits --');
      {
        const r1 = await apiFetch('POST', '/api/admin/faqs',
          { question: 'a'.repeat(301), answer: 'Valid answer.' }, cookie);
        check('question 301 chars → 400', r1.status === 400, `Got ${r1.status}`);

        const r2 = await apiFetch('POST', '/api/admin/faqs',
          { question: 'ZZTest FAQ longans', answer: 'a'.repeat(3001) }, cookie);
        check('answer 3001 chars → 400', r2.status === 400, `Got ${r2.status}`);
      }

      console.log('\n-- required fields --');
      {
        const r = await apiFetch('POST', '/api/admin/faqs',
          { question: 'ZZTest FAQ no-answer' }, cookie);
        check('missing answer → 400', r.status === 400, `Got ${r.status}`);
      }

      console.log('\n-- search by question --');
      {
        const r = await apiFetch('GET', '/api/admin/faqs?q=zztest', undefined, cookie);
        check('?q=zztest finds test FAQs by question',
          r.status === 200 && (r.json?.items?.length ?? 0) > 0,
          `status=${r.status} items=${r.json?.items?.length}`);
      }

      console.log('\n-- published filter --');
      {
        const pub = await apiFetch('POST', '/api/admin/faqs',
          { question: 'ZZTest FAQ Pub Filter YES', answer: 'ans', published: true }, cookie);
        const unpub = await apiFetch('POST', '/api/admin/faqs',
          { question: 'ZZTest FAQ Pub Filter NO', answer: 'ans', published: false }, cookie);
        check('Create published test FAQ → 201', pub.status === 201, `Got ${pub.status}`);
        check('Create unpublished test FAQ → 201', unpub.status === 201, `Got ${unpub.status}`);

        const r = await apiFetch('GET', '/api/admin/faqs?published=false&q=FAQ+Pub+Filter', undefined, cookie);
        check('?published=false → 200', r.status === 200, `Got ${r.status}`);
        const items = r.json?.items || [];
        check('?published=false returns only unpublished items',
          items.length > 0 && items.every(i => i.published === false),
          `items: ${items.map(i => `${i.question}:${i.published}`).join(', ')}`);
        check('?published=false does NOT return the published FAQ',
          !items.some(i => i.question === 'ZZTest FAQ Pub Filter YES'),
          `Questions: ${items.map(i => i.question).join(', ')}`);
      }

      console.log('\n-- order validation --');
      {
        const r1 = await apiFetch('POST', '/api/admin/faqs',
          { question: 'ZZTest FAQ negord', answer: 'ans', order: -1 }, cookie);
        check('order -1 → 400', r1.status === 400, `Got ${r1.status}`);

        const r2 = await apiFetch('POST', '/api/admin/faqs',
          { question: 'ZZTest FAQ floatord', answer: 'ans', order: 1.5 }, cookie);
        check('order 1.5 → 400', r2.status === 400, `Got ${r2.status}`);
      }
    }
  } finally {
    await FAQ.deleteMany({ question: { $regex: '^ZZTest FAQ' } });
    const adminCount = await cleanupTempAdmin();
    console.log(`\n  Cleanup done. AdminUser count: ${adminCount}`);
    check('AdminUser count is 1', adminCount === 1, `Got ${adminCount}`);
    await disconnectDB();
  }

  exitWithResults();
}

main().catch(e => { console.error('Unhandled:', e.message); process.exit(1); });
