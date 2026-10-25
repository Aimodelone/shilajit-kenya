/**
 * lib/adminPage.js — server-side auth guards for admin pages.
 * Import in getServerSideProps on every admin page.
 */
import { getAdminFromReq } from './auth.js';

/**
 * requireAdminPage(ctx)
 * Sets Cache-Control: no-store, then redirects to /admin/login if not authenticated.
 * Returns { props: { adminEmail } } when authenticated.
 */
export function requireAdminPage(ctx) {
  ctx.res.setHeader('Cache-Control', 'no-store');
  const admin = getAdminFromReq(ctx.req);
  if (!admin) {
    return { redirect: { destination: '/admin/login', permanent: false } };
  }
  return { props: { adminEmail: admin.email } };
}

/**
 * redirectIfLoggedIn(ctx)
 * Used on the login page: redirects to /admin when already authenticated.
 */
export function redirectIfLoggedIn(ctx) {
  ctx.res.setHeader('Cache-Control', 'no-store');
  const admin = getAdminFromReq(ctx.req);
  if (admin) {
    return { redirect: { destination: '/admin', permanent: false } };
  }
  return { props: {} };
}
