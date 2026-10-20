/**
 * tests/admin-upload.test.js — CommonJS
 * Signed-upload API — all checks are their own PASS/FAIL lines.
 * Run via: npm run test:api
 *
 * Cleanup in finally:
 *   - destroy every Cloudinary asset uploaded (result must be "ok")
 *   - delete all zztest- products created
 *   - remove temp admin, verify AdminUser count = 1
 */
'use strict';

const cloudinaryV2 = require('cloudinary').v2;
const Product = require('../models/Product');
const {
  BASE_URL, check, exitWithResults,
  connectDB, disconnectDB,
  preflight, createTempAdmin, cleanupTempAdmin, login,
} = require('./helpers');

// ── Tiny test images (base64 — 1×1 pixels) ────────────────────────────────────
// 1×1 transparent PNG
const PNG_B64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
// 1×1 transparent GIF
const GIF_B64 = 'R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==';

function b64ToBuffer(b64) {
  return Buffer.from(b64, 'base64');
}

const PATH = '/api/admin/upload-signature';

// ── HTTP helpers ──────────────────────────────────────────────────────────────
// Node fetch throws if GET/HEAD/DELETE sends a body.
const NO_BODY_METHODS = new Set(['GET', 'HEAD', 'DELETE']);

async function api(method, path, body, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const sendBody = body !== undefined && !NO_BODY_METHODS.has(method);
  const res = await fetch(`${BASE_URL}${path}`, {
    method, headers,
    body: sendBody ? JSON.stringify(body) : undefined,
    redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json, headers: res.headers };
}

async function rawPost(path, rawBody, cookie) {
  const headers = { 'Content-Type': 'application/json' };
  if (cookie) headers['Cookie'] = cookie;
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST', headers, body: rawBody, redirect: 'manual',
  });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

async function getSignature(section, cookie) {
  return api('POST', PATH, { section }, cookie);
}

// ── Cloudinary multipart upload ───────────────────────────────────────────────
async function cloudinaryUpload(uploadUrl, fields, fileBuffer, filename, mimeType) {
  const form = new FormData();
  for (const [k, v] of Object.entries(fields)) {
    form.append(k, String(v));
  }
  form.append('file', new Blob([fileBuffer], { type: mimeType }), filename);
  const res = await fetch(uploadUrl, { method: 'POST', body: form });
  let json = null; try { json = await res.json(); } catch {}
  return { status: res.status, json };
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n=== admin-upload.test.js ===\n');

  await preflight();

  // Configure Cloudinary for cleanup only (values read from env, never printed)
  cloudinaryV2.config({
    cloud_name:  process.env.CLOUDINARY_CLOUD_NAME,
    api_key:     process.env.CLOUDINARY_API_KEY,
    api_secret:  process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });

  await connectDB();
  await Product.deleteMany({ slug: { $regex: '^zztest-' } });
  await createTempAdmin();

  let cookie = null;
  try { cookie = await login(BASE_URL); }
  catch (e) { console.error('Login error:', e.message); }

  const uploadedPublicIds = []; // tracked for cleanup

  try {
    if (!cookie) {
      console.log('  Skipping tests — login failed.');
    } else {

      // ── Auth and methods ───────────────────────────────────────────────────
      console.log('\n-- Auth and methods --');
      { const r = await api('POST',   PATH, { section: 'site' }, null);
        check('POST without cookie → 401', r.status === 401, `Got ${r.status}`); }
      { const r = await api('GET',    PATH, undefined, null);
        check('GET without cookie → 401', r.status === 401, `Got ${r.status}`); }
      { const r = await api('PUT',    PATH, {}, null);
        check('PUT without cookie → 401', r.status === 401, `Got ${r.status}`); }
      { const r = await api('DELETE', PATH, undefined, null);
        check('DELETE without cookie → 401', r.status === 401, `Got ${r.status}`); }

      for (const method of ['GET', 'PUT', 'DELETE']) {
        // No body for GET/DELETE; PUT sends {} to exercise body-parsing path
        const body = method === 'PUT' ? {} : undefined;
        const r = await api(method, PATH, body, cookie);
        const allow = r.headers.get('allow') || '';
        check(`${method} with cookie → 405`, r.status === 405, `Got ${r.status}`);
        check(`${method} Allow header contains POST`, allow.includes('POST'), `Allow: "${allow}"`);
      }

      // ── Body handling ──────────────────────────────────────────────────────
      console.log('\n-- Body handling --');
      { const r = await api('POST', PATH, {}, cookie);
        check('{}  → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, [{ section: 'site' }], cookie);
        check('JSON array → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await rawPost(PATH, 'not { valid json', cookie);
        check('Invalid JSON text → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: 123 }, cookie);
        check('section: 123 (number) → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: '' }, cookie);
        check('section: "" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: 'other' }, cookie);
        check('section: "other" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: '../x' }, cookie);
        check('section: "../x" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: 'products/../../x' }, cookie);
        check('section: "products/../../x" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: '__proto__' }, cookie);
        check('section: "__proto__" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: 'constructor' }, cookie);
        check('section: "constructor" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: 'toString' }, cookie);
        check('section: "toString" → 400', r.status === 400, `Got ${r.status}`); }
      { const r = await api('POST', PATH, { section: 'shilajit-kenya/products' }, cookie);
        check('section: folder path → 400', r.status === 400, `Got ${r.status}`); }

      // ── Signature shape ────────────────────────────────────────────────────
      console.log('\n-- Signature shape --');

      const EXPECTED_FOLDERS = {
        products:     'shilajit-kenya/products',
        benefits:     'shilajit-kenya/benefits',
        blog:         'shilajit-kenya/blog',
        testimonials: 'shilajit-kenya/testimonials',
        site:         'shilajit-kenya/site',
      };

      let siteResp = null;
      for (const [section, expectedFolder] of Object.entries(EXPECTED_FOLDERS)) {
        const r = await getSignature(section, cookie);
        check(`section "${section}" → 200`, r.status === 200, `Got ${r.status}`);
        check(`section "${section}" folder = "${expectedFolder}"`,
          r.json?.fields?.folder === expectedFolder,
          `Got "${r.json?.fields?.folder}"`);
        if (section === 'site') siteResp = r;
      }

      // Detailed shape checks on the "site" response
      if (siteResp && siteResp.status === 200) {
        const { uploadUrl, fields } = siteResp.json;
        check('uploadUrl starts with "https://api.cloudinary.com/v1_1/"',
          typeof uploadUrl === 'string' && uploadUrl.startsWith('https://api.cloudinary.com/v1_1/'),
          `Got "${uploadUrl}"`);
        check('uploadUrl ends with "/image/upload"',
          typeof uploadUrl === 'string' && uploadUrl.endsWith('/image/upload'),
          `Got "${uploadUrl}"`);

        const fieldKeys = Object.keys(fields || {}).sort();
        const expectedKeys = ['allowed_formats', 'api_key', 'folder', 'signature', 'timestamp'].sort();
        check('fields has EXACTLY the five expected keys',
          JSON.stringify(fieldKeys) === JSON.stringify(expectedKeys),
          `Got keys: ${JSON.stringify(fieldKeys)}`);

        check('allowed_formats = "jpg,jpeg,png,webp"',
          fields?.allowed_formats === 'jpg,jpeg,png,webp',
          `Got "${fields?.allowed_formats}"`);

        const cacheControl = siteResp.headers.get('cache-control') || '';
        check('Cache-Control contains no-store',
          cacheControl.includes('no-store'), `Got "${cacheControl}"`);

        // Verify API secret is NOT in the raw response text (without printing it)
        const secret = process.env.CLOUDINARY_API_SECRET || '';
        const rawText = JSON.stringify(siteResp.json);
        check('Response text does not contain CLOUDINARY_API_SECRET',
          secret.length === 0 || !rawText.includes(secret), 'Secret found in response!');

        check('signature matches hex pattern',
          /^[a-f0-9]{40}$|^[a-f0-9]{64}$/.test(fields?.signature || ''),
          `Got "${fields?.signature}"`);

        const now = Math.floor(Date.now() / 1000);
        check('timestamp is within 60 seconds of now',
          Math.abs((fields?.timestamp || 0) - now) <= 60,
          `Got ${fields?.timestamp}, now=${now}`);
      }

      // ── Real Cloudinary network checks ─────────────────────────────────────
      console.log('\n-- Real Cloudinary checks --');

      // Get a fresh "site" signature for the network tests
      const sigResp = await getSignature('site', cookie);
      if (sigResp.status !== 200) {
        check('Got signature for Cloudinary tests', false, `Status ${sigResp.status}`);
      } else {
        const { uploadUrl, fields } = sigResp.json;
        const pngBuf = b64ToBuffer(PNG_B64);
        const gifBuf = b64ToBuffer(GIF_B64);

        // a) Upload PNG
        let pngResult = null;
        try {
          pngResult = await cloudinaryUpload(uploadUrl, fields, pngBuf, 'zztest.png', 'image/png');
        } catch (netErr) {
          console.log('  Cloudinary unreachable, check your internet connection');
          check('PNG upload network reachable', false, netErr.message);
          return; // bail — no further Cloudinary checks
        }

        check('a) PNG upload → 200', pngResult.status === 200,
          `Got ${pngResult.status}: ${JSON.stringify(pngResult.json)}`);
        const secureUrl  = pngResult.json?.secure_url || '';
        const publicId   = pngResult.json?.public_id  || '';
        check('a) secure_url starts with "https://res.cloudinary.com/"',
          secureUrl.startsWith('https://res.cloudinary.com/'),
          `Got "${secureUrl}"`);
        check('a) public_id starts with "shilajit-kenya/site/"',
          publicId.startsWith('shilajit-kenya/site/'),
          `Got "${publicId}"`);
        if (publicId) uploadedPublicIds.push(publicId);

        // b) GET the secure_url
        if (secureUrl) {
          const imgResp = await fetch(secureUrl);
          check('b) GET secure_url → 200', imgResp.status === 200, `Got ${imgResp.status}`);
          const ct = imgResp.headers.get('content-type') || '';
          check('b) content-type starts with "image/"', ct.startsWith('image/'), `Got "${ct}"`);
        } else {
          check('b) GET secure_url → 200', false, 'No secure_url from upload');
          check('b) content-type starts with "image/"', false, 'No secure_url');
        }

        // c) Save via our own products API
        if (secureUrl) {
          const prodResp = await api('POST', '/api/admin/products', {
            name:             'ZZTest Upload Product',
            slug:             'zztest-upload-product',
            shortDescription: 'Created by upload test.',
            price:            1,
            coverImage:       { url: secureUrl, alt: 'zz' },
          }, cookie);
          check('c) POST product with Cloudinary URL → 201',
            prodResp.status === 201, `Got ${prodResp.status}: ${JSON.stringify(prodResp.json)}`);
          if (prodResp.status === 201 && prodResp.json?._id) {
            const delResp = await api('DELETE', `/api/admin/products/${prodResp.json._id}`, undefined, cookie);
            check('c) DELETE test product → 200', delResp.status === 200, `Got ${delResp.status}`);
          }
        } else {
          check('c) POST product with Cloudinary URL → 201', false, 'No secure_url');
          check('c) DELETE test product → 200', false, 'No product created');
        }

        // d) Tampered folder — change folder to "shilajit-kenya/blog"
        {
          const tamperedFields = { ...fields, folder: 'shilajit-kenya/blog' };
          const r = await cloudinaryUpload(uploadUrl, tamperedFields, pngBuf, 'zztest-tampered.png', 'image/png');
          check('d) Tampered folder rejected by Cloudinary (4xx)',
            r.status >= 400 && r.status < 500, `Got ${r.status}`);
        }

        // e) Extra unsigned field public_id
        {
          const extraFields = { ...fields, public_id: 'zz-hijack' };
          const r = await cloudinaryUpload(uploadUrl, extraFields, pngBuf, 'zztest-extra.png', 'image/png');
          check('e) Extra unsigned public_id rejected (4xx)',
            r.status >= 400 && r.status < 500, `Got ${r.status}`);
        }

        // f) Signature removed
        {
          const { signature: _sig, ...noSigFields } = fields;
          const r = await cloudinaryUpload(uploadUrl, noSigFields, pngBuf, 'zztest-nosig.png', 'image/png');
          check('f) Missing signature rejected (4xx)',
            r.status >= 400 && r.status < 500, `Got ${r.status}`);
        }

        // g) GIF upload — should be rejected by allowed_formats
        {
          const r = await cloudinaryUpload(uploadUrl, fields, gifBuf, 'zztest.gif', 'image/gif');
          if (r.status === 200) {
            // If Cloudinary accepted it, report but still fail the check
            const gifId = r.json?.public_id;
            if (gifId) uploadedPublicIds.push(gifId);
            console.log(`  WARNING: Cloudinary ACCEPTED the GIF (public_id="${gifId}"). The account may not enforce format restrictions via signed params.`);
          }
          check('g) GIF rejected by allowed_formats (4xx)',
            r.status >= 400 && r.status < 500, `Got ${r.status}: ${JSON.stringify(r.json)}`);
        }

        // h) Timestamp changed to older value
        {
          const oldTimestamp = fields.timestamp - 700; // well outside Cloudinary's ~10-min window
          const oldFields    = { ...fields, timestamp: oldTimestamp };
          const r = await cloudinaryUpload(uploadUrl, oldFields, pngBuf, 'zztest-oldts.png', 'image/png');
          check('h) Old timestamp rejected (4xx)',
            r.status >= 400 && r.status < 500, `Got ${r.status}`);
        }
      }
    }

  } finally {
    // ── Cleanup ────────────────────────────────────────────────────────────────
    console.log('\n-- Cleanup --');
    console.log(`  Uploaded assets: ${uploadedPublicIds.length}`);

    for (const id of uploadedPublicIds) {
      try {
        const result = await cloudinaryV2.uploader.destroy(id);
        check(`Destroy "${id}" result = "ok"`, result.result === 'ok',
          `Got result="${result.result}"`);
      } catch (e) {
        check(`Destroy "${id}"`, false, e.message);
      }
    }

    await Product.deleteMany({ slug: { $regex: '^zztest-' } });
    const adminCount = await cleanupTempAdmin();
    console.log(`  Cleanup done. AdminUser count: ${adminCount}`);
    check('AdminUser count is 1', adminCount === 1, `Got ${adminCount}`);
    await disconnectDB();
  }

  exitWithResults();
}

main().catch(e => { console.error('Unhandled:', e.message); process.exit(1); });
