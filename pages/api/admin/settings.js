/**
 * pages/api/admin/settings.js — ES module
 * Admin-only singleton settings API.
 *
 * GET  /api/admin/settings  → 200 { …settings }
 * PUT  /api/admin/settings  → 200 { …updated settings }
 * Any other method          → 405 Allow: GET, PUT
 */

import { requireAdminApi } from '../../../lib/auth.js';
import { connectToDatabase } from '../../../lib/mongodb.js';
import { getSiteSettings } from '../../../lib/siteSettings.js';
import { siteSettingsUpdateSchema } from '../../../lib/validation.js';
import SiteSettings from '../../../models/SiteSettings.js';

// Disable Next.js body parser so we can handle invalid JSON gracefully.
export const config = { api: { bodyParser: false } };

// ── Raw-body reader ───────────────────────────────────────────────────────────
async function readRawBody(req) {
  return new Promise((resolve, reject) => {
    let raw = '';
    req.on('data', (chunk) => { raw += chunk; });
    req.on('end',  () => resolve(raw));
    req.on('error', reject);
  });
}

// ── Handler ───────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // Auth FIRST on every method
  const admin = requireAdminApi(req, res);
  if (!admin) return;

  // ── GET ────────────────────────────────────────────────────────────────────
  if (req.method === 'GET') {
    try {
      const settings = await getSiteSettings();
      return res.status(200).json(settings);
    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ── PUT ────────────────────────────────────────────────────────────────────
  if (req.method === 'PUT') {
    try {
      // Parse body manually so invalid JSON → 400 instead of 500
      const rawBody = await readRawBody(req);
      let body;
      try {
        body = rawBody ? JSON.parse(rawBody) : {};
      } catch {
        return res.status(400).json({ error: 'Invalid JSON body' });
      }

      // Must be a plain object (not array, null, or primitive)
      if (typeof body !== 'object' || body === null || Array.isArray(body)) {
        return res.status(400).json({ error: 'Body must be a plain object' });
      }

      // Validate
      const parsed = siteSettingsUpdateSchema.safeParse(body);
      if (!parsed.success) {
        return res.status(400).json({
          error:   'Validation failed',
          details: parsed.error.issues.map((i) => ({
            path:    i.path.join('.'),
            message: i.message,
          })),
        });
      }

      const data = parsed.data;

      // Build update — never overwrite the whole socialLinks object;
      // each known key goes into its own dot-path so missing keys survive.
      const $set   = {};
      const $unset = {};

      const SCALARS = [
        'businessName', 'tagline', 'whatsappNumber', 'whatsappDefaultMessage',
        'phone', 'email', 'address', 'city', 'openingHours',
        'defaultSeoTitle', 'defaultSeoDescription',
      ];
      for (const key of SCALARS) {
        if (key in data) $set[key] = data[key];
      }

      // ogImage: null → unset, object → set
      if ('ogImage' in data) {
        if (data.ogImage === null) {
          $unset['ogImage'] = '';
        } else {
          $set['ogImage'] = data.ogImage;
        }
      }

      // socialLinks: flatten into dot-paths
      if (data.socialLinks && typeof data.socialLinks === 'object') {
        for (const [k, v] of Object.entries(data.socialLinks)) {
          $set[`socialLinks.${k}`] = v;
        }
      }

      // Nothing to do?
      if (Object.keys($set).length === 0 && Object.keys($unset).length === 0) {
        return res.status(400).json({ error: 'Nothing to update' });
      }

      const update = {};
      if (Object.keys($set).length   > 0) update.$set   = $set;
      if (Object.keys($unset).length > 0) update.$unset = $unset;

      await connectToDatabase();

      let doc;
      try {
        doc = await SiteSettings.findOneAndUpdate(
          { key: 'main' },
          update,
          { upsert: true, returnDocument: 'after', runValidators: true }
        );
      } catch (err) {
        if (err.code === 11000) {
          // Race on first-time upsert – retry without upsert
          doc = await SiteSettings.findOneAndUpdate(
            { key: 'main' },
            update,
            { returnDocument: 'after', runValidators: true }
          );
        } else {
          throw err;
        }
      }

      const plain = doc.toObject();
      delete plain.__v;
      return res.status(200).json(JSON.parse(JSON.stringify(plain)));

    } catch (err) {
      console.error(err.message);
      return res.status(500).json({ error: 'Something went wrong' });
    }
  }

  // ── Any other method ──────────────────────────────────────────────────────
  res.setHeader('Allow', 'GET, PUT');
  return res.status(405).json({ error: 'Method not allowed' });
}
