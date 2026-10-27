/**
 * pages/about/index.js
 * About page — keeps the existing design, adds Seo, one h1.
 */
import React, { Fragment } from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import About from '../../components/about/about';

import Testimonial from '../../components/Testimonial/Testimonial';
import FunFact from '../../components/FunFact/FunFact';
import Donors from '../../components/Donors/Donors';
import PartnerSection from '../../components/PartnerSection/PartnerSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import BenefitsSection from '../../components/BenefitsSection/BenefitsSection';
import abimg from '/public/images/about.jpg';

export default function AboutPage({ settings, benefits = [] }) {
  return (
    <Fragment>
      <Seo
        title="About Shilajit Kenya | Pure Himalayan Shilajit Supplier in Kenya"
        description="Learn about Shilajit Kenya — your trusted source for pure, authentic Himalayan Shilajit Resin, Capsules and Gummies delivered across Kenya."
        path="/about"
        settings={settings}
      />
      <Navbar2 />
      <PageTitle pageTitle="About Us" pagesub="About" as="h1" />

      <About abimg={abimg} abClass="pt-padding" />
      <BenefitsSection
        benefits={benefits}
        label="Benefits"
        heading="Benefits of Shilajit"
        showViewAll
      />
      <Testimonial />
      <FunFact />
      <Donors />
      <PartnerSection />
      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getSettings, getBenefits } = require('../../lib/data');
    const [settings, benefits] = await Promise.all([
      getSettings(),
      getBenefits({ limit: 3 }),
    ]);
    return { props: { settings, benefits }, revalidate: 60 };
  } catch {
    return { props: { settings: {}, benefits: [] }, revalidate: 60 };
  }
}
