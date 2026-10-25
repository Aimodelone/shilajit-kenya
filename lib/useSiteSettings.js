/**
 * lib/useSiteSettings.js
 * Client-side hook — fetches /api/public/settings once (module-level cache).
 * Keeps the hardcoded fallback values so SSR is unchanged and nothing breaks
 * if the fetch fails.
 */
import { useState, useEffect } from 'react';

const HARDCODED_FALLBACK = {
  businessName:           'Shilajit Kenya',
  whatsappNumber:         '254793313743',
  whatsappDefaultMessage: "Welcome!\n\nWe're now selling pure Himalayan Shilajit – known for boosting energy and vitality.\n100% natural, straight from the Himalayas!\n\nWould you like to place an order?",
  phone:                  '+254 793 313743',
  email:                  '',
  address:                '',
  city:                   'Nairobi',
  openingHours:           '',
  socialLinks: {
    facebook:  'https://facebook.com/shilajitkenya',
    instagram: 'https://instagram.com/shilajitkenya',
    tiktok:    '',
    twitter:   '',
    youtube:   '',
  },
};

// Module-level cache — shared across all component instances
let _cache = null;
let _promise = null;

async function fetchSettings() {
  if (_cache) return _cache;
  if (_promise) return _promise;

  _promise = fetch('/api/public/settings')
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (data) _cache = { ...HARDCODED_FALLBACK, ...data };
      _promise = null;
      return _cache || HARDCODED_FALLBACK;
    })
    .catch(() => {
      _promise = null;
      return HARDCODED_FALLBACK;
    });

  return _promise;
}

/**
 * useSiteSettings()
 * Returns the settings object (starts with hardcoded fallback, then updates
 * from the API on first client-side render).
 */
export default function useSiteSettings() {
  const [settings, setSettings] = useState(HARDCODED_FALLBACK);

  useEffect(() => {
    let cancelled = false;
    fetchSettings().then((data) => {
      if (!cancelled) setSettings(data);
    });
    return () => { cancelled = true; };
  }, []);

  return settings;
}
