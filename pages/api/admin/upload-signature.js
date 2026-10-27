/**
 * pages/api/admin/upload-signature.js
 *
 * DESIGN: The browser asks this API for a signature, then uploads the image
 * DIRECTLY to Cloudinary, then saves the returned secure_url through the
 * normal content APIs (e.g. PUT /api/admin/products/:id with coverImage.url).
 * Files never pass through our server (Vercel serverless request bodies are
 * limited to 4.5 MB). The signature binds the folder, the allowed formats and
 * the timestamp; the browser cannot change them or add parameters without
 * the API secret. File SIZE cannot be enforced by this API; Cloudinary's own
 * account limits apply, and the admin UI will also check size in the browser later.
 */

import { requireAdminApi } from '../../../lib/auth.js';
import { getCloudinary }   from '../../../lib/cloudinary.js';
import { UPLOAD_FOLDERS, ALLOWED_FORMATS } from '../../../lib/uploadConfig.js';

// Disable Next.js body parser — we parse JSON manually so invalid input → 400.
export const config = { api: { bodyParser: false } };

async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end',  () => resolve(raw));
    req.on('error', reject);
  });
}

export default async function handler(req, res) {
  // Auth checked FIRST on every method.
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  // Only POST is allowed.
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Parse body manually so invalid JSON → 400.
    const rawBody = await readRawBody(req);
    let body;
    try {
      body = rawBody ? JSON.parse(rawBody) : {};
    } catch {
      return res.status(400).json({ error: 'Invalid section' });
    }

    // Body must be a plain object with a string "section" that is an own
    // key of UPLOAD_FOLDERS.  Using hasOwnProperty.call so that prototype
    // pollution attempts ("__proto__", "constructor", "toString") are rejected.
    if (
      typeof body !== 'object' ||
      body === null ||
      Array.isArray(body) ||
      typeof body.section !== 'string' ||
      !Object.prototype.hasOwnProperty.call(UPLOAD_FOLDERS, body.section)
    ) {
      return res.status(400).json({ error: 'Invalid section' });
    }

    const section = body.section;
    const folder  = UPLOAD_FOLDERS[section];

    const cld       = getCloudinary();
    const timestamp = Math.floor(Date.now() / 1000);

    const paramsToSign = {
      allowed_formats: ALLOWED_FORMATS,
      folder,
      timestamp,
    };

    const signature = cld.utils.api_sign_request(
      paramsToSign,
      cld.config().api_secret
    );

    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({
      uploadUrl: `https://api.cloudinary.com/v1_1/${cld.config().cloud_name}/image/upload`,
      fields: {
        api_key:         cld.config().api_key,
        timestamp,
        signature,
        folder,
        allowed_formats: ALLOWED_FORMATS,
      },
    });

  } catch (err) {
    // Log message only — never log env values or secrets.
    console.error(err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
