/**
 * pages/about/index.js
 * About page — keeps the existing design, adds Seo, one h1.
 */
import React, { Fragment } from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import About from '../../components/about/about';
import CampaignSection from '../../components/CampaignSection/CampaignSection';
import Testimonial from '../../components/Testimonial/Testimonial';
import FunFact from '../../components/FunFact/FunFact';
import Donors from '../../components/Donors/Donors';
import PartnerSection from '../../components/PartnerSection/PartnerSection';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import { getSettings } from '../../lib/data';
import abimg from '/public/images/about.jpg';

export default function AboutPage({ settings }) {
  return (
    <Fragment>
      <Seo
        title="About Shilajit Kenya | Pure Himalayan Shilajit Supplier in Kenya"
        description="Learn about Shilajit Kenya — your trusted source for pure, authentic Himalayan Shilajit Resin, Capsules and Gummies delivered across Kenya."
        path="/about"
        settings={settings}
      />
      <Navbar2 />
      <PageTitle pageTitle="About Us" pagesub="About" />

      {/* Visually hidden h1 so the page has exactly one h1 while About section keeps its h2 */}
      <h1 style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: 0,
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0,0,0,0)',
        whiteSpace: 'nowrap',
        border: 0,
      }}>About Shilajit Kenya</h1>

      <About abimg={abimg} abClass="pt-padding" />
      <CampaignSection />
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
    const settings = await getSettings();
    return { props: { settings }, revalidate: 60 };
  } catch {
    return { props: { settings: {} }, revalidate: 60 };
  }
}
