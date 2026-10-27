import React, { Fragment } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Seo from '../../components/Seo/Seo';
// server-only data helpers required inline inside getStaticPaths/getStaticProps (see below)
import { whatsappLink, absoluteUrl } from '../../lib/site';

const ClickHandler = () => { window.scrollTo(0, 0); };

export default function ProductPage({ product, related, settings }) {
  if (!product) return null; // fallback (normally handled by notFound)

  const waLink = whatsappLink(settings, `Hello, I'd like to order ${product.name}`);

  const seoTitle = product.seoTitle || `${product.name} | Shilajit Kenya`;
  const seoDesc  = product.seoDescription || product.shortDescription || '';
  const seoImage = product.coverImage?.url
    ? (product.coverImage.url.startsWith('http') ? product.coverImage.url : absoluteUrl(product.coverImage.url))
    : undefined;

  // JSON-LD: Product
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.shortDescription || '',
    image: [product.coverImage?.url, ...(product.images || []).map(i => i.url)]
      .filter(Boolean)
      .map(u => u.startsWith('http') ? u : absoluteUrl(u)),
    sku: product.slug,
    brand: { '@type': 'Brand', name: 'Shilajit Kenya' },
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'KES',
      availability: product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: absoluteUrl(`/products/${product.slug}`),
    },
  };

  // JSON-LD: BreadcrumbList
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home',     item: absoluteUrl('/') },
      { '@type': 'ListItem', position: 2, name: 'Products', item: absoluteUrl('/products') },
      { '@type': 'ListItem', position: 3, name: product.name, item: absoluteUrl(`/products/${product.slug}`) },
    ],
  };

  return (
    <Fragment>
      <Seo
        title={seoTitle}
        description={seoDesc}
        path={`/products/${product.slug}`}
        image={seoImage}
        type="product"
        settings={settings}
        jsonLd={[productLd, breadcrumbLd]}
      />
      <Navbar hclass="wpo-site-header-s1" topbarNone="topbar-none" Logo="/images/logo.png" />
      <PageTitle pageTitle={product.name} pagesub="Products" />

      <div className="team-pg-area section-padding">
        <div className="container">
          <div className="team-single-wrap">

            {/* Main product info */}
            <div className="team-info-wrap">
              <div className="row align-items-start">

                {/* Image gallery */}
                <div className="col-lg-5">
                  <div className="team-info-img">
                    {product.coverImage?.url && (
                      <Image
                        src={product.coverImage.url}
                        alt={product.coverImage.alt || product.name}
                        width={500}
                        height={500}
                        style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                        priority
                      />
                    )}
                    {/* Additional images */}
                    {product.images?.length > 0 && (
                      <div style={{ display: 'flex', gap: '8px', marginTop: '12px', flexWrap: 'wrap' }}>
                        {product.images.map((img, i) => img.url && (
                          <Image
                            key={i}
                            src={img.url}
                            alt={img.alt || product.name}
                            width={120}
                            height={120}
                            style={{ objectFit: 'cover', borderRadius: '4px' }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Product details */}
                <div className="col-lg-7">
                  <div className="team-info-text">
                    <h1 className="team-title" style={{ fontSize: '2rem', marginBottom: '16px' }}>
                      {product.name}
                    </h1>

                    {/* Price */}
                    <div style={{ marginBottom: '20px' }}>
                      {product.compareAtPrice && (
                        <span style={{ textDecoration: 'line-through', color: '#999', marginRight: '12px', fontSize: '20px' }}>
                          KES {product.compareAtPrice.toLocaleString()}
                        </span>
                      )}
                      <span style={{ fontSize: '28px', fontWeight: 'bold', color: '#c8a951' }}>
                        KES {product.price?.toLocaleString()}
                      </span>
                    </div>

                    {/* Stock status */}
                    <p style={{ marginBottom: '16px' }}>
                      <strong>Availability:</strong>{' '}
                      {product.inStock !== false ? (
                        <span style={{ color: '#2d8a2d' }}>In Stock</span>
                      ) : (
                        <span style={{ color: '#c00' }}>Out of Stock</span>
                      )}
                    </p>

                    {/* Short description */}
                    {product.shortDescription && (
                      <p style={{ marginBottom: '20px', lineHeight: '1.7' }}>{product.shortDescription}</p>
                    )}

                    {/* Order button */}
                    <div style={{ marginBottom: '24px' }}>
                      <a
                        href={waLink}
                        className="theme-btn"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#000' }}
                      >
                        Order on WhatsApp
                      </a>
                    </div>

                    {/* Certificates */}
                    {product.certificates?.length > 0 && (
                      <div className="certificates-wrap">
                        <h2>Certificates</h2>
                        <div className="certificates-items">
                          {product.certificates.map((cert, i) => cert.url && (
                            <div className="certificates-item" key={i}>
                              <Image
                                src={cert.url}
                                alt={cert.alt || `Certificate ${i + 1}`}
                                width={120}
                                height={120}
                                style={{ objectFit: 'contain' }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Long description */}
            {product.description && (
              <div className="team-exprience-area team-widget">
                <div className="exprience-wrap">
                  <h2>About This Product</h2>
                  {product.description.split('\n').map((para, i) =>
                    para.trim() ? <p key={i}>{para}</p> : null
                  )}
                </div>
              </div>
            )}

            {/* Benefits list */}
            {product.benefits?.length > 0 && (
              <div className="team-widget">
                <h2>Key Benefits</h2>
                <ul>
                  {product.benefits.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              </div>
            )}

            {/* How to use */}
            {product.howToUse && (
              <div className="team-widget">
                <h2>How to Use</h2>
                <p>{product.howToUse}</p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && (
              <div className="team-widget">
                <h2>Ingredients</h2>
                <p>{product.ingredients}</p>
              </div>
            )}

            {/* Related products */}
            {related?.length > 0 && (
              <div className="team-widget">
                <h2>Other Products</h2>
                <div className="row">
                  {related.map((rel) => (
                    <div className="col col-lg-4 col-md-6 col-12" key={rel._id}>
                      <div className="wpo-team-item">
                        <div className="wpo-team-img">
                          {rel.coverImage?.url && (
                            <Image
                              src={rel.coverImage.url}
                              alt={rel.coverImage.alt || rel.name}
                              width={300}
                              height={300}
                              style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                            />
                          )}
                        </div>
                        <div className="wpo-team-text">
                          <h2>
                            <Link onClick={ClickHandler} href={`/products/${rel.slug}`}>
                              {rel.name}
                            </Link>
                          </h2>
                          <span style={{ fontWeight: 'bold' }}>KES {rel.price?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
    const { getProducts } = require('../../lib/data');
    const products = await getProducts({ featuredOnly: false });
    const paths = products.map(p => ({ params: { slug: p.slug } }));
    return { paths, fallback: 'blocking' };
  } catch {
    return { paths: [], fallback: 'blocking' };
  }
}

export async function getStaticProps({ params }) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getProductBySlug, getRelatedProducts, getSettings } = require('../../lib/data');
    const [product, settings] = await Promise.all([
      getProductBySlug(params.slug),
      getSettings(),
    ]);

    if (!product) return { notFound: true };

    const related = await getRelatedProducts(params.slug);
    return { props: { product, related, settings }, revalidate: 60 };
  } catch {
    return { notFound: true };
  }
}
