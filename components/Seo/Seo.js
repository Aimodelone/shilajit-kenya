/**
 * components/Seo/Seo.js — ES module
 * Renders per-page <head> tags: title, meta description, canonical, Open Graph,
 * Twitter Card, robots noindex, and JSON-LD structured data.
 *
 * Usage:
 *   <Seo
 *     title="Page Title"
 *     description="Page description up to 160 chars"
 *     path="/about"
 *     image="/images/og-image.jpg"   (absolute or relative)
 *     type="website"                  (website | product | article)
 *     noindex={false}
 *     jsonLd={{ "@type": "Organization", ... }}   (object or array of objects)
 *     settings={settingsObject}
 *   />
 */

import Head from 'next/head';
import { SITE_URL, absoluteUrl } from '../../lib/site.js';

export default function Seo({
  title,
  description,
  path = '/',
  image,
  type = 'website',
  noindex = false,
  jsonLd,
  settings,
}) {
  const siteName = settings?.businessName || 'Shilajit Kenya';
  const fallbackOg = settings?.ogImage?.url
    ? (settings.ogImage.url.startsWith('http') ? settings.ogImage.url : absoluteUrl(settings.ogImage.url))
    : absoluteUrl('/images/logo.png');

  // Canonical URL — strip query strings
  const canonicalPath = path.split('?')[0];
  const canonical = absoluteUrl(canonicalPath);

  // Description trimmed to 160 chars
  const metaDesc = (description || settings?.defaultSeoDescription || '').slice(0, 160);

  // OG image — make absolute
  let ogImage = image || fallbackOg;
  if (ogImage && !ogImage.startsWith('http')) {
    ogImage = absoluteUrl(ogImage);
  }

  // JSON-LD: accept object or array; serialize safely (replace < to avoid XSS)
  const ldArray = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const ldScripts = ldArray.map((ld, i) => {
    const json = JSON.stringify(ld).replace(/</g, '\\u003c');
    return (
      <script
        key={i}
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: json }}
      />
    );
  });

  return (
    <Head>
      <title>{title || settings?.defaultSeoTitle || siteName}</title>

      {metaDesc && <meta name="description" content={metaDesc} />}

      {canonical && <link rel="canonical" href={canonical} />}

      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:title"       content={title || settings?.defaultSeoTitle || siteName} />
      {metaDesc && <meta property="og:description" content={metaDesc} />}
      <meta property="og:url"         content={canonical} />
      <meta property="og:type"        content={type} />
      {ogImage && <meta property="og:image" content={ogImage} />}
      <meta property="og:site_name"   content={siteName} />

      {/* Twitter Card */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title || settings?.defaultSeoTitle || siteName} />
      {metaDesc && <meta name="twitter:description" content={metaDesc} />}
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* JSON-LD structured data */}
      {ldScripts}
    </Head>
  );
}
