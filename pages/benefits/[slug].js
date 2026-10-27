/**
 * pages/benefits/[slug].js
 * Database-driven benefit detail page with ISR.
 * JSON-LD: BreadcrumbList only (Article JSON-LD not applicable for benefit pages).
 */
import React, { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
// server-only data helpers required inline inside getStaticPaths/getStaticProps (see below)
import { absoluteUrl } from '../../lib/site';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

const SANITIZE_OPTS = {
  allowedTags: ['p', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'strong', 'em', 'a', 'blockquote', 'br'],
  allowedAttributes: { a: ['href', 'title', 'rel'] },
  transformTags: {
    a: (tagName, attribs) => {
      const href = attribs.href || '';
      if (!/^https?:\/\//.test(href) && !href.startsWith('/')) return { tagName: 'span', attribs: {} };
      return { tagName, attribs: { ...attribs, rel: 'noopener noreferrer' } };
    },
  },
};

function renderMarkdown(md) {
  if (!md) return '';
  return sanitizeHtml(marked(md), SANITIZE_OPTS);
}

export default function BenefitDetailPage({ benefit, relatedBenefits, settings }) {
  if (!benefit) return null;

  const seoTitle = benefit.seoTitle || `${benefit.title} | Shilajit Kenya`;
  const seoDesc  = benefit.seoDescription || benefit.shortDescription;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Benefits', item: absoluteUrl('/benefits') },
      { '@type': 'ListItem', position: 3, name: benefit.title, item: absoluteUrl(`/benefits/${benefit.slug}`) },
    ],
  };

  const contentHtml = renderMarkdown(benefit.content);

  return (
    <Fragment>
      <Seo
        title={seoTitle}
        description={seoDesc}
        path={`/benefits/${benefit.slug}`}
        image={benefit.image?.url || null}
        settings={settings}
        jsonLd={[breadcrumbLd]}
      />
      <Navbar2 />
      <PageTitle pageTitle={benefit.title} pagesub="Benefits" />

      <div className="wpo-service-single-area section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-12">
              <div className="wpo-service-single-wrap">
                <div className="wpo-service-single-item">

                  {benefit.image?.url && (
                    <div className="wpo-service-single-main-img">
                      <Image
                        src={benefit.image.url}
                        alt={benefit.image.alt || benefit.title}
                        width={800}
                        height={450}
                        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
                        priority
                      />
                    </div>
                  )}

                  <div className="wpo-service-single-title">
                    <h1>{benefit.title}</h1>
                  </div>

                  <p style={{ fontSize: '1.1rem', marginBottom: '16px' }}>{benefit.shortDescription}</p>

                  {contentHtml ? (
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                  ) : null}
                </div>

                {/* Related benefits */}
                {relatedBenefits && relatedBenefits.length > 0 && (
                  <div className="wpo-service-single-item">
                    <div className="wpo-service-single-title">
                      <h3>Other Shilajit Benefits</h3>
                    </div>
                    <div className="wpo-service-area">
                      <div className="row align-items-center">
                        {relatedBenefits.map((b) => (
                          <div className="col-lg-4 col-md-6 col-12" key={b._id}>
                            <div className="wpo-service-item">
                              <h2 style={{ fontSize: '1rem' }}>
                                <Link href={`/benefits/${b.slug}`}>{b.title}</Link>
                              </h2>
                              <p style={{ fontSize: '0.875rem' }}>{b.shortDescription}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar — benefits list */}
            <div className="col-lg-4 col-12">
              <div style={{ padding: '24px', background: '#f8f8f8', borderRadius: '8px' }}>
                <h3 style={{ marginBottom: '16px' }}>All Benefits</h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {relatedBenefits && [benefit, ...relatedBenefits].map((b) => (
                    <li key={b._id} style={{ marginBottom: '8px' }}>
                      <Link
                        href={`/benefits/${b.slug}`}
                        style={{ fontWeight: b.slug === benefit.slug ? 700 : 400 }}
                      >
                        {b.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                <div style={{ marginTop: '24px' }}>
                  <Link href="/products" className="theme-btn" style={{ display: 'inline-block' }}>
                    Shop Shilajit
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export async function getStaticPaths() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getAllBenefitSlugs } = require('../../lib/data');
    const slugs = await getAllBenefitSlugs();
    return { paths: slugs.map((slug) => ({ params: { slug } })), fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getBenefitBySlug, getBenefits, getSettings } = require('../../lib/data');
    const [benefit, allBenefits, settings] = await Promise.all([
      getBenefitBySlug(params.slug),
      getBenefits(),
      getSettings(),
    ]);
    if (!benefit) return { notFound: true };
    const relatedBenefits = allBenefits.filter((b) => b.slug !== benefit.slug);
    return { props: { benefit, relatedBenefits, settings }, revalidate: 60 };
  } catch {
    return { notFound: true };
  }
}
