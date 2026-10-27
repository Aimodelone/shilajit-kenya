/**
 * pages/api/admin/logout.js
 * POST only — clears the admin auth cookie.
 */

import { clearAuthCookie } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  clearAuthCookie(res);
  return res.status(200).json({ success: true });
}
