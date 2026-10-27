/**
 * pages/sitemap.xml.js
 * Generates /sitemap.xml with absolute URLs, ISR-friendly Cache-Control headers,
 * and lastmod dates from updatedAt on dynamic content.
 */
import { SITE_URL } from '../lib/site';
// server-only: connectToDatabase and models required inline inside getServerSideProps

/** XML-escape a string for use inside a URL element. */
function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function loc(path) {
  return `<loc>${esc(`${SITE_URL}${path}`)}</loc>`;
}

function url(path, lastmod, changefreq = 'weekly', priority = '0.7') {
  return [
    '<url>',
    `  ${loc(path)}`,
    lastmod ? `  <lastmod>${lastmod}</lastmod>` : '',
    `  <changefreq>${changefreq}</changefreq>`,
    `  <priority>${priority}</priority>`,
    '</url>',
  ].filter(Boolean).join('\n');
}

function isoDate(d) {
  if (!d) return '';
  try { return new Date(d).toISOString().split('T')[0]; } catch { return ''; }
}

export default function Sitemap() { return null; }

export async function getServerSideProps({ res }) {
  let products = [], benefits = [], posts = [];
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { connectToDatabase } = require('../lib/mongodb');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Product  = require('../models/Product');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const Benefit  = require('../models/Benefit');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const BlogPost = require('../models/BlogPost');
    await connectToDatabase();
    [products, benefits, posts] = await Promise.all([
      Product.find({ published: true }).select('slug updatedAt').lean(),
      Benefit.find({ published: true }).select('slug updatedAt').lean(),
      BlogPost.find({ published: true }).select('slug updatedAt').lean(),
    ]);
  } catch { /* serve partial sitemap on DB error */ }

  const today = new Date().toISOString().split('T')[0];

  const staticPages = [
    url('/', today, 'daily', '1.0'),
    url('/about', today, 'monthly', '0.6'),
    url('/products', today, 'daily', '0.9'),
    url('/benefits', today, 'weekly', '0.8'),
    url('/blog', today, 'daily', '0.8'),
    url('/faq', today, 'monthly', '0.7'),
    url('/testimonial', today, 'monthly', '0.6'),
    url('/contact', today, 'monthly', '0.6'),
    url('/privacy', today, 'yearly', '0.4'),
    url('/terms', today, 'yearly', '0.4'),
  ];

  const productUrls  = products.map((p) => url(`/products/${p.slug}`,  isoDate(p.updatedAt), 'weekly', '0.8'));
  const benefitUrls  = benefits.map((b) => url(`/benefits/${b.slug}`,  isoDate(b.updatedAt), 'weekly', '0.7'));
  const postUrls     = posts.map((p)    => url(`/blog/${p.slug}`,       isoDate(p.updatedAt), 'weekly', '0.7'));

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...staticPages,
    ...productUrls,
    ...benefitUrls,
    ...postUrls,
    '</urlset>',
  ].join('\n');

  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.write(xml);
  res.end();

  return { props: {} };
}
