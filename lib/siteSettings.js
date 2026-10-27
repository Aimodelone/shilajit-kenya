/**
 * lib/siteSettings.js — ES module
 * Fetches the singleton SiteSettings document and returns it as a
 * JSON-safe plain object (no Date, no ObjectId instances).
 *
 * Public pages will call this from getStaticProps later, which only
 * accepts JSON-serializable data, so no Date or ObjectId objects may
 * leak out.
 */

import { connectToDatabase } from './mongodb.js';
import SiteSettings from '../models/SiteSettings.js';

/**
 * getSiteSettings()
 * Connects to the database, calls SiteSettings.getMain() to fetch
 * (or upsert) the singleton document, and returns a plain object.
 *
 * On a duplicate-key error (code 11000 – first-time upsert race),
 * retries once with a plain findOne({ key: 'main' }).
 *
 * @returns {Promise<Record<string, unknown>>} JSON-safe settings object
 */
export async function getSiteSettings() {
  await connectToDatabase();

  let doc;
  try {
    doc = await SiteSettings.getMain();
  } catch (err) {
    if (err.code === 11000) {
      // Race on first-time upsert – another request created the doc first.
      doc = await SiteSettings.findOne({ key: 'main' });
    } else {
      throw err;
    }
  }

  const plain = doc.toObject();
  delete plain.__v;
  // JSON.parse(JSON.stringify(...)) converts Dates → strings and
  // ObjectIds → strings, ensuring no non-serialisable values leak out.
  return JSON.parse(JSON.stringify(plain));
}
