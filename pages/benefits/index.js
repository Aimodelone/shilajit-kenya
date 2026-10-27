/**
 * pages/benefits/index.js
 * Database-driven benefits list page with ISR.
 */
import React, { Fragment } from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import BenefitsSection from '../../components/BenefitsSection/BenefitsSection';
// server-only data helpers required inline inside getStaticProps (see below)



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
      {/* PageTitle banner — renders the page h1 */}
      <PageTitle pageTitle="Shilajit Benefits" pagesub="Benefits" as="h1" />

      {/* Card grid — same style as About page */}
      <BenefitsSection
        benefits={benefits}
        heading="Health Benefits of Shilajit"
        showViewAll={false}
      />

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
