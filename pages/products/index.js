import React, { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '../../components/Navbar/Navbar';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import PageTitle from '../../components/pagetitle/PageTitle';
import Seo from '../../components/Seo/Seo';
// server-only data helpers required inline inside getStaticProps (see below)

const ClickHandler = () => { window.scrollTo(0, 0); };

export default function ProductsPage({ products, settings }) {
  return (
    <Fragment>
      <Seo
        title="Shilajit Products in Kenya | Shilajit Kenya"
        description="Browse our range of pure Himalayan Shilajit products in Kenya — Resin, Capsules, Gummies and 8-in-1 Capsules. Natural energy, immunity and wellness."
        path="/products"
        settings={settings}
      />
      <Navbar hclass="wpo-site-header-s1" topbarNone="topbar-none" Logo="/images/logo.png" />
      <PageTitle pageTitle="Our Products" pagesub="Products" />

      <section className="wpo-team-section section-padding">
        <div className="container">
          <div className="wpo-section-title">
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Shop Shilajit Products in Kenya</h1>
          </div>
            <div className="row">
              {products.map((product) => (
                <div className="col col-lg-3 col-md-6 col-12" key={product._id}>
                  <div className="wpo-team-item">
                    <div className="wpo-team-img">
                      <div className="wpo-team-img-box">
                        {product.coverImage?.url ? (
                          <Image
                            src={product.coverImage.url}
                            alt={product.coverImage.alt || product.name}
                            width={400}
                            height={400}
                            style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="wpo-team-text">
                      <h2>
                        <Link onClick={ClickHandler} href={`/products/${product.slug}`}>
                          {product.name}
                        </Link>
                      </h2>
                      <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
                        KES {product.price?.toLocaleString()}
                      </span>
                      {product.inStock === false && (
                        <span style={{ display: 'block', color: '#c00', fontSize: '14px' }}>Out of Stock</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </section>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getProducts, getSettings } = require('../../lib/data');
    const [products, settings] = await Promise.all([
      getProducts({ featuredOnly: false }),
      getSettings(),
    ]);
    return { props: { products, settings }, revalidate: 60 };
  } catch {
    return { props: { products: [], settings: {} }, revalidate: 60 };
  }
}
