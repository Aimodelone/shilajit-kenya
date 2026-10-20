/**
 * lib/site.js — ES module
 * Site-wide URL utilities. Safe to import in both server-side and client-side code.
 */

/** Canonical site URL — no trailing slash. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || '').replace(/\/$/, '');

/**
 * Build an absolute URL for the given path.
 * @param {string} path  Must start with "/".
 */
export function absoluteUrl(path) {
  return `${SITE_URL}${path}`;
}

/**
 * Build a WhatsApp deep link.
 * @param {object} settings  SiteSettings plain object from getSettings().
 * @param {string} [text]    Custom message; falls back to settings.whatsappDefaultMessage.
 * @returns {string}         https://wa.me/... URL.
 */
export function whatsappLink(settings, text) {
  const number  = (settings?.whatsappNumber || '').replace(/\D/g, '');
  const message = text || settings?.whatsappDefaultMessage || '';
  const base    = number ? `https://wa.me/${number}` : 'https://wa.me/';
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}
