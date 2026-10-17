/**
 * tests/admin-blog.test.js — CommonJS
 * Run via: npm run test:api
 * Uses crudSuite.js for shared checks + blog-specific checks.
 */

'use strict';

const BlogPost = require('../models/BlogPost');
const {
  check, exitWithResults,
  connectDB, disconnectDB,
  createTempAdmin, cleanupTempAdmin, login,
} = require('./helpers');
const { runCrudSuite } = require('./crudSuite');

const BASE        = 'http://localhost:3000';
const SLUG_PREFIX = 'zztest-blog-';

function buildBody(suffix) {
  return {
    title:   `ZZTest Blog Post ${suffix}`,
    slug:    `${SLUG_PREFIX}${suffix}`,
    excerpt: 'A test excerpt.',
    content: 'Test blog post content.',
  };
}

async function apiFetch(method, path, body, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE}${path}`, {
    method, headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function main() {
  console.log('\n=== admin-blog.test.js ===\n');

  await connectDB();
  await BlogPost.deleteMany({ slug: { $regex: `^${SLUG_PREFIX}` } });
  await createTempAdmin();
  const cookie = await login(BASE);

  try {
    await runCrudSuite({
      label:         'blog-post',
      basePath:      '/api/admin/blog',
      slugPrefix:    SLUG_PREFIX,
      buildBody,
      requiredField: 'excerpt',
      imageField:    'coverImage',
      base:          BASE,
      cookie,
    });

    // ── Blog-specific checks ───────────────────────────────────────────────
    console.log('\n=== Blog-specific checks ===');

    // publishedAt "not-a-date" → 400
    console.log('\n-- publishedAt validation --');
    {
      const r = await apiFetch('POST', '/api/admin/blog',
        { ...buildBody('bad-date'), publishedAt: 'not-a-date' }, cookie);
      check('publishedAt "not-a-date" → 400', r.status === 400, `Got ${r.status}`);
    }

    // publishedAt "2026-08-01" stored and returned as valid date
    {
      const r = await apiFetch('POST', '/api/admin/blog',
        { ...buildBody('with-date'), publishedAt: '2026-08-01' }, cookie);
      check('publishedAt "2026-08-01" → 201', r.status === 201, `Got ${r.status}`);
      if (r.status === 201) {
        const d = new Date(r.json?.publishedAt);
        check(
          'publishedAt stored as valid Date (year 2026)',
          !isNaN(d.getTime()) && d.getFullYear() === 2026,
          `Got "${r.json?.publishedAt}"`
        );
      } else {
        check('publishedAt stored as valid Date (year 2026)', false, 'Post not created');
      }
    }

    // content 100001 chars → 400
    console.log('\n-- content length --');
    {
      const r = await apiFetch('POST', '/api/admin/blog',
        { ...buildBody('longcnt'), content: 'a'.repeat(100001) }, cookie);
      check('content 100001 chars → 400', r.status === 400, `Got ${r.status}`);
    }

    // tags: 21 items → 400
    console.log('\n-- tags validation --');
    {
      const r = await apiFetch('POST', '/api/admin/blog',
        { ...buildBody('many-tags'), tags: Array.from({ length: 21 }, (_, i) => `tag${i}`) }, cookie);
      check('21 tags → 400', r.status === 400, `Got ${r.status}`);
    }

    // tags: one tag of 51 chars → 400
    {
      const r = await apiFetch('POST', '/api/admin/blog',
        { ...buildBody('long-tag'), tags: ['a'.repeat(51)] }, cookie);
      check('tag of 51 chars → 400', r.status === 400, `Got ${r.status}`);
    }

    // published filter: ?published=false returns unpublished, not published
    console.log('\n-- published filter --');
    {
      // Create a published post and an unpublished post with unique title marker
      const pub = await apiFetch('POST', '/api/admin/blog',
        { ...buildBody('pub-filter-yes'), title: 'ZZTest Blog Pub Filter YES', published: true }, cookie);
      const unpub = await apiFetch('POST', '/api/admin/blog',
        { ...buildBody('pub-filter-no'), title: 'ZZTest Blog Pub Filter NO', published: false }, cookie);

      check('Create published test post → 201', pub.status === 201, `Got ${pub.status}`);
      check('Create unpublished test post → 201', unpub.status === 201, `Got ${unpub.status}`);

      const r = await apiFetch('GET', '/api/admin/blog?published=false&q=Pub+Filter', undefined, cookie);
      check('?published=false → 200', r.status === 200, `Got ${r.status}`);
      const items = r.json?.items || [];
      check('?published=false returns only unpublished items',
        items.length > 0 && items.every(i => i.published === false),
        `items: ${items.map(i => `${i.slug}:${i.published}`).join(', ')}`);
      check('?published=false does NOT return the published post',
        !items.some(i => i.slug === 'zztest-blog-pub-filter-yes'),
        `Slugs found: ${items.map(i => i.slug).join(', ')}`);
    }

    // List sorted by publishedAt descending
    console.log('\n-- publishedAt sort (descending) --');
    {
      const early = await apiFetch('POST', '/api/admin/blog', {
        ...buildBody('sort-early'), title: 'ZZTest Blog Sort Early',
        publishedAt: '2024-01-01', published: false,
      }, cookie);
      const recent = await apiFetch('POST', '/api/admin/blog', {
        ...buildBody('sort-recent'), title: 'ZZTest Blog Sort Recent',
        publishedAt: '2026-12-31', published: false,
      }, cookie);

      check('Create early post → 201', early.status === 201, `Got ${early.status}`);
      check('Create recent post → 201', recent.status === 201, `Got ${recent.status}`);

      const r = await apiFetch('GET', '/api/admin/blog?q=ZZTest+Blog+Sort&limit=10', undefined, cookie);
      check('Sort list GET → 200', r.status === 200, `Got ${r.status}`);
      const slugs = (r.json?.items || []).map(i => i.slug);
      const recentIdx = slugs.indexOf('zztest-blog-sort-recent');
      const earlyIdx  = slugs.indexOf('zztest-blog-sort-early');
      check(
        'Recent post (2026-12-31) appears before early post (2024-01-01)',
        recentIdx !== -1 && earlyIdx !== -1 && recentIdx < earlyIdx,
        `Slugs in order: ${slugs.join(', ')}`
      );
    }

  } finally {
    await BlogPost.deleteMany({ slug: { $regex: `^${SLUG_PREFIX}` } });
    const adminCount = await cleanupTempAdmin();
    console.log(`\n  Cleanup done. AdminUser count: ${adminCount}`);
    check('AdminUser count is 1', adminCount === 1, `Got ${adminCount}`);
    await disconnectDB();
  }

  exitWithResults();
}

main().catch(e => { console.error('Unhandled:', e.message); process.exit(1); });
