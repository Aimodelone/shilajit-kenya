/**
 * pages/benefits/index.js
 * Database-driven benefits list page with ISR.
 */
import React, { Fragment } from 'react';
import Link from 'next/link';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
// server-only data helpers required inline inside getStaticProps (see below)

const ICONS = [
  'flaticon-volunteer',
  'flaticon-charity',
  'flaticon-heart',
  'flaticon-solidarity',
  'flaticon-volunteer-1',
];

export default function BenefitsPage({ benefits, settings }) {
  return (
    <Fragment>
      <Seo
        title="Shilajit Benefits: Energy, Immunity, Clarity and More | Shilajit Kenya"
        description="Discover the proven health benefits of Shilajit — from boosting energy and mental clarity to strengthening immunity and improving physical performance."
        path="/benefits"
        settings={settings}
      />
      <Navbar2 />
      <PageTitle pageTitle="Shilajit Benefits" pagesub="Benefits" />

      <section className="wpo-service-section section-padding">
        <div className="container">
          <div className="wpo-section-title">
            <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Health Benefits of Shilajit</h1>
            <p>Pure Himalayan Shilajit is packed with minerals, fulvic acid and bioactive compounds that support whole-body wellness.</p>
          </div>
          <div className="row align-items-stretch" style={{ marginTop: '32px' }}>
            {benefits.map((benefit, i) => (
              <div className="col col-lg-4 col-md-6 col-12" key={benefit._id} style={{ marginBottom: '24px' }}>
                <div className="wpo-service-item" style={{ height: '100%' }}>
                  <div className="wpo-service-text">
                    <div className="service-icon">
                      <i className={`fi ${ICONS[i % ICONS.length]}`}></i>
                    </div>
                    <h2 style={{ fontSize: '1.25rem' }}>
                      <Link href={`/benefits/${benefit.slug}`}>{benefit.title}</Link>
                    </h2>
                    <p>{benefit.shortDescription}</p>
                    <Link href={`/benefits/${benefit.slug}`} className="read-more" style={{ fontWeight: 600 }}>
                      Learn more →
                    </Link>
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
    const { getBenefits, getSettings } = require('../../lib/data');
    const [benefits, settings] = await Promise.all([getBenefits(), getSettings()]);
    return { props: { benefits, settings }, revalidate: 60 };
  } catch {
    return { props: { benefits: [], settings: {} }, revalidate: 60 };
  }
}
