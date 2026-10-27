/**
 * pages/api/admin/me.js
 * GET only — returns the email of the currently authenticated admin.
 */

import { requireAdminApi } from '../../../lib/auth';

export default function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const payload = requireAdminApi(req, res);
  if (!payload) return; // requireAdminApi already sent 401
  return res.status(200).json({ email: payload.email });
}
