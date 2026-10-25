/**
 * pages/api/public/settings.js
 * GET /api/public/settings — limited public subset of site settings.
 * No authentication required. Cached at the CDN / Next.js cache.
 */
import { getSiteSettings } from '../../../lib/siteSettings.js';

const PUBLIC_FIELDS = [
  'businessName', 'whatsappNumber', 'whatsappDefaultMessage',
  'phone', 'email', 'address', 'city', 'openingHours', 'socialLinks',
];

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const settings = await getSiteSettings();
    const data = {};
    for (const key of PUBLIC_FIELDS) {
      if (key in settings) data[key] = settings[key];
    }
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    return res.status(200).json(data);
  } catch (err) {
    console.error('[public/settings GET]', err.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}
