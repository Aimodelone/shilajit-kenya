/**
 * tests/admin-settings.test.js — CommonJS
 * Singleton settings API — 62 checks.
 * Run via: npm run test:api
 *
 * SAFETY: takes a mongoose snapshot of the real settings document BEFORE
 * any write, and ALWAYS restores it in a finally block.
 * The settings document is never deleted.
 */
'use strict';

const SiteSettings = require('../models/SiteSettings');
const {
  BASE_URL, check, exitWithResults,
  connectDB, disconnectDB,
  preflight, createTempAdmin, cleanupTempAdmin, login,
} = require('./helpers');

// ── HTTP helpers ──────────────────────────────────────────────────────────────
async function api(method, path, body, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json, headers: res.headers };
}

async function rawPut(path, rawBody, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT', headers, body: rawBody, redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

const PATH = '/api/admin/settings';

async function main() {
  console.log('\n=== admin-settings.test.js ===\n');

  await preflight();
  await connectDB();

  // Snapshot BEFORE any writes (lean plain object, may be null if DB is empty)
  const snapshot = await SiteSettings.findOne({ key: 'main' }).lean();

  await createTempAdmin();
  let cookie = null;
  try { cookie = await login(BASE_URL); }
  catch (e) { console.error('Login error:', e.message); }

  try {
    if (!cookie) {
      console.log('  Skipping tests — login failed.');
    } else {

      // ── Auth & methods ─────────────────────────────────────────────────────
      console.log('\n-- Auth and methods --');
      { const r = await api('GET',    PATH, undefined, null); check('1 GET without cookie → 401',    r.status === 401, `Got ${r.status}`); }
      { const r = await api('PUT',    PATH, {}, null);        check('2 PUT without cookie → 401',    r.status === 401, `Got ${r.status}`); }
      { const r = await api('POST',   PATH, {}, null);        check('3 POST without cookie → 401',   r.status === 401, `Got ${r.status}`); }
      { const r = await api('DELETE', PATH, undefined, null); check('4 DELETE without cookie → 401', r.status === 401, `Got ${r.status}`); }

      { const r = await api('GET', PATH, undefined, cookie);
        check('5 GET with cookie → 200', r.status === 200, `Got ${r.status}`);
        check('5 key equals "main"', r.json?.key === 'main', `Got key="${r.json?.key}"`); }

      for (const method of ['POST', 'DELETE', 'PATCH']) {
        const r = await api(method, PATH, {}, cookie);
        const no = method === 'POST' ? 6 : method === 'DELETE' ? 7 : 8;
        check(`${no} ${method} with cookie → 405`, r.status === 405, `Got ${r.status}`);
        const allow = r.headers.get('allow') || '';
        check(`${no} Allow header contains GET and PUT`, allow.includes('GET') && allow.includes('PUT'), `Allow: "${allow}"`);
      }

      // ── Body handling ──────────────────────────────────────────────────────
      console.log('\n-- Body handling --');
      { const r = await api('PUT', PATH, {}, cookie);
        check('9 PUT {} → 400', r.status === 400, `Got ${r.status}: ${JSON.stringify(r.json)}`); }
      { const r = await api('PUT', PATH, [{ key: 'x' }], cookie);
        check('10 PUT JSON array → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await rawPut(PATH, 'this is { not valid json', cookie);
        check('11 PUT invalid JSON text → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: {} }, cookie);
        check('12 PUT { socialLinks: {} } → 400', r.status === 400, `Got ${r.status}: ${JSON.stringify(r.json)}`); }
      { const r = await api('PUT', PATH, { hacker: true }, cookie);
        check('13 PUT { hacker: true } → 400', r.status === 400, `Got ${r.status}: ${JSON.stringify(r.json)}`); }

      // ── Basic fields ───────────────────────────────────────────────────────
      console.log('\n-- Basic fields --');
      let storedName = '';
      { const r = await api('PUT', PATH, { businessName: '  Zz Test Name  ' }, cookie);
        check('14 PUT businessName with spaces → 200', r.status === 200, `Got ${r.status}: ${JSON.stringify(r.json)}`);
        storedName = r.json?.businessName || '';
        check('14 stored name is trimmed', storedName === 'Zz Test Name', `Got "${storedName}"`); }
      { const r = await api('GET', PATH, undefined, cookie);
        check('15 following GET returns same trimmed name', r.json?.businessName === 'Zz Test Name', `Got "${r.json?.businessName}"`); }
      { const r = await api('PUT', PATH, { businessName: '' }, cookie);
        check('16 businessName "" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { businessName: 'a'.repeat(101) }, cookie);
        check('17 businessName 101 chars → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { tagline: 'a'.repeat(161) }, cookie);
        check('18 tagline 161 chars → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { whatsappDefaultMessage: 'a'.repeat(501) }, cookie);
        check('19 whatsappDefaultMessage 501 chars → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { address: 'a'.repeat(301) }, cookie);
        check('20 address 301 chars → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { city: 'a'.repeat(101) }, cookie);
        check('21 city 101 chars → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { openingHours: 'a'.repeat(301) }, cookie);
        check('22 openingHours 301 chars → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { defaultSeoTitle: 'a'.repeat(71) }, cookie);
        check('23 defaultSeoTitle 71 chars → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { defaultSeoDescription: 'a'.repeat(171) }, cookie);
        check('24 defaultSeoDescription 171 chars → 400', r.status === 400, `Got ${r.status}`); }

      // ── WhatsApp number ────────────────────────────────────────────────────
      console.log('\n-- WhatsApp number --');
      { const r = await api('PUT', PATH, { whatsappNumber: '254712345678' }, cookie);
        check('25 "254712345678" → 200', r.status === 200, `Got ${r.status}`);
        check('25 stored unchanged', r.json?.whatsappNumber === '254712345678', `Got "${r.json?.whatsappNumber}"`); }
      { const r = await api('PUT', PATH, { whatsappNumber: '+254 712 345 678' }, cookie);
        check('26 "+254 712 345 678" → 200', r.status === 200, `Got ${r.status}`);
        check('26 stored as 254712345678', r.json?.whatsappNumber === '254712345678', `Got "${r.json?.whatsappNumber}"`); }
      { const r = await api('PUT', PATH, { whatsappNumber: '(254) 712-345-678' }, cookie);
        check('27 "(254) 712-345-678" → 200', r.status === 200, `Got ${r.status}`);
        check('27 stored as 254712345678', r.json?.whatsappNumber === '254712345678', `Got "${r.json?.whatsappNumber}"`); }
      { const r = await api('PUT', PATH, { whatsappNumber: '0712345678' }, cookie);
        check('28 "0712345678" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { whatsappNumber: 'abc' }, cookie);
        check('29 "abc" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { whatsappNumber: '12345' }, cookie);
        check('30 "12345" (too short) → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { whatsappNumber: '1'.repeat(16) }, cookie);
        check('31 16-digit number → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { whatsappNumber: '' }, cookie);
        check('32 "" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { whatsappNumber: 254712345678 }, cookie);
        check('33 JSON number (not string) → 400', r.status === 400, `Got ${r.status}`); }

      // ── Email and phone ────────────────────────────────────────────────────
      console.log('\n-- Email and phone --');
      { const r = await api('PUT', PATH, { email: 'not-an-email' }, cookie);
        check('34 email "not-an-email" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { email: 'zz@example.com' }, cookie);
        check('35 email "zz@example.com" → 200', r.status === 200, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { email: '' }, cookie);
        check('36 email "" → 200', r.status === 200, `Got ${r.status}`);
        check('36 stored value is empty', r.json?.email === '', `Got "${r.json?.email}"`); }
      { const r = await api('PUT', PATH, { phone: '+254 712 345 678' }, cookie);
        check('37 phone "+254 712 345 678" → 200', r.status === 200, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { phone: '<script>' }, cookie);
        check('38 phone "<script>" → 400', r.status === 400, `Got ${r.status}`); }

      // ── Social links ───────────────────────────────────────────────────────
      console.log('\n-- Social links --');
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'https://www.facebook.com/zztest' } }, cookie);
        check('39 facebook www.facebook.com → 200', r.status === 200, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'https://m.facebook.com/zztest' } }, cookie);
        check('40 facebook m.facebook.com → 200', r.status === 200, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'javascript:alert(1)' } }, cookie);
        check('41 facebook "javascript:alert(1)" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'http://facebook.com/zztest' } }, cookie);
        check('42 facebook http (not https) → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'https://evil.example/zztest' } }, cookie);
        check('43 facebook evil.example → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'https://notfacebook.com/zztest' } }, cookie);
        check('44 facebook notfacebook.com → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'https://facebook.com.evil.example/zztest' } }, cookie);
        check('45 facebook facebook.com.evil.example → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { facebook: 'https://user:pass@facebook.com/zztest' } }, cookie);
        check('46 facebook with credentials → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { instagram: 'https://facebook.com/zztest' } }, cookie);
        check('47 instagram with facebook URL → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { socialLinks: { twitter: 'https://x.com/zztest' } }, cookie);
        check('48 twitter x.com → 200', r.status === 200, `Got ${r.status}`); }

      console.log('\n-- Social links merge --');
      { // 49: merge test
        await api('PUT', PATH, { socialLinks: { instagram: 'https://www.instagram.com/zztest' } }, cookie);
        await api('PUT', PATH, { socialLinks: { facebook:  'https://www.facebook.com/zztest2'  } }, cookie);
        const r = await api('GET', PATH, undefined, cookie);
        check('49 GET shows instagram after separate PUT', r.json?.socialLinks?.instagram === 'https://www.instagram.com/zztest', `Got "${r.json?.socialLinks?.instagram}"`);
        check('49 GET shows facebook after separate PUT',  r.json?.socialLinks?.facebook  === 'https://www.facebook.com/zztest2',  `Got "${r.json?.socialLinks?.facebook}"`); }
      { // 50: clear test
        await api('PUT', PATH, { socialLinks: { instagram: '' } }, cookie);
        const r = await api('GET', PATH, undefined, cookie);
        const ig = r.json?.socialLinks?.instagram;
        check('50 instagram cleared (empty or absent)', ig === '' || ig === undefined, `Got "${ig}"`);
        check('50 facebook unchanged after instagram clear', r.json?.socialLinks?.facebook === 'https://www.facebook.com/zztest2', `Got "${r.json?.socialLinks?.facebook}"`); }

      // ── ogImage ────────────────────────────────────────────────────────────
      console.log('\n-- ogImage --');
      { const r = await api('PUT', PATH, { ogImage: { url: '/images/zztest-og.png', alt: 'x' } }, cookie);
        check('51 ogImage local path → 200', r.status === 200, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { ogImage: { url: 'https://res.cloudinary.com/zztest/image/upload/x.png' } }, cookie);
        check('52 ogImage cloudinary URL → 200', r.status === 200, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { ogImage: { url: 'javascript:alert(1)' } }, cookie);
        check('53 ogImage javascript: → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { ogImage: { url: 'http://evil.example/x.png' } }, cookie);
        check('54 ogImage http:// external → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('PUT', PATH, { ogImage: { url: '/images/test.png', alt: 'x'.repeat(201) } }, cookie);
        check('55 ogImage alt 201 chars → 400', r.status === 400, `Got ${r.status}`); }
      { await api('PUT', PATH, { ogImage: { url: '/images/zztest-og.png' } }, cookie); // ensure it's set
        const r = await api('PUT', PATH, { ogImage: null }, cookie);
        check('56 ogImage null → 200', r.status === 200, `Got ${r.status}`);
        const r2 = await api('GET', PATH, undefined, cookie);
        check('56 GET after null: no ogImage url', !r2.json?.ogImage?.url, `ogImage=${JSON.stringify(r2.json?.ogImage)}`); }

      // ── Immutable and singleton ────────────────────────────────────────────
      console.log('\n-- Immutable and singleton --');
      { const r = await api('PUT', PATH, { key: 'other', businessName: 'Zz Test Name 2' }, cookie);
        check('57 PUT { key: "other" } → 200', r.status === 200, `Got ${r.status}`);
        check('57 key is still "main"', r.json?.key === 'main', `Got key="${r.json?.key}"`); }
      { const count = await SiteSettings.countDocuments();
        check('58 SiteSettings document count is 1', count === 1, `Got ${count}`); }
      { const results = await Promise.all(
          Array.from({ length: 10 }, () => api('GET', PATH, undefined, cookie))
        );
        check('59 ten parallel GETs all return 200', results.every(r => r.status === 200),
          `Statuses: ${results.map(r => r.status).join(', ')}`); }
      { const count = await SiteSettings.countDocuments();
        check('60 count still 1 after parallel GETs', count === 1, `Got ${count}`); }
    }
  } finally {
    // ── Restore snapshot ─────────────────────────────────────────────────────
    console.log('\n-- Restore snapshot --');
    if (snapshot) {
      const { _id, __v, ...body } = snapshot;
      await SiteSettings.replaceOne({ key: 'main' }, body, { upsert: true });
    }
    // If snapshot was null, the default document from getMain() stays — do not delete.

    const afterRestore = await SiteSettings.findOne({ key: 'main' }).lean();
    if (snapshot) {
      check('61 businessName restored',     afterRestore?.businessName === snapshot.businessName,       `Got "${afterRestore?.businessName}"`);
      check('61 whatsappNumber restored',   afterRestore?.whatsappNumber === snapshot.whatsappNumber,   `Got "${afterRestore?.whatsappNumber}"`);
      check('61 email restored',            afterRestore?.email === snapshot.email,                     `Got "${afterRestore?.email}"`);
      const snSocial = JSON.stringify(snapshot.socialLinks   ?? {});
      const afSocial = JSON.stringify(afterRestore?.socialLinks ?? {});
      check('61 socialLinks restored',      snSocial === afSocial, `snap=${snSocial} after=${afSocial}`);
      const snOgUrl = snapshot.ogImage?.url    ?? null;
      const afOgUrl = afterRestore?.ogImage?.url ?? null;
      check('61 ogImage url restored',      snOgUrl === afOgUrl, `snap="${snOgUrl}" after="${afOgUrl}"`);
    } else {
      check('61 settings document exists after restore', !!afterRestore, 'Document missing');
    }

    const adminCount = await cleanupTempAdmin();
    console.log(`\n  Cleanup done. AdminUser count: ${adminCount}`);
    check('62 AdminUser count is 1', adminCount === 1, `Got ${adminCount}`);
    await disconnectDB();
  }

  exitWithResults();
}

main().catch(e => { console.error('Unhandled:', e.message); process.exit(1); });
