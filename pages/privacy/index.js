/**
 * pages/privacy/index.js
 * Privacy Policy — keeps existing text, adds Seo, one h1.
 */
import React from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import FaqSection from './FaqSection';
import Image from 'next/image';
import fagImg1 from '/public/images/terms/terms.jpg';
import fagImg2 from '/public/images/terms/1.jpg';
import fagImg3 from '/public/images/terms/2.jpg';
import { getSettings } from '../../lib/data';

export default function PrivacyPage({ settings }) {
  return (
    <div>
      <Seo
        title="Privacy Policy | Shilajit Kenya"
        description="Read Shilajit Kenya's Privacy Policy to understand how we collect, use and protect your personal information when you use our website or place an order."
        path="/privacy"
        settings={settings}
      />
      <Navbar2 />
      <PageTitle pageTitle="Privacy Policy" pagesub="Privacy Policy" />
      <section className="wpo-terms-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col-lg-10 offset-lg-1">
              <div className="wpo-terms-wrap">
                <div className="wpo-terms-img">
                  <Image src={fagImg1} alt="Privacy Policy document" />
                </div>
                <div className="wpo-terms-text">
                  <h1 style={{ fontSize: '1.75rem', marginBottom: '16px' }}>Privacy Policy</h1>
                  <p>
                    When you are planning to create a website, it's very easy to overlook creating and
                    adding a website Privacy Policy template. This is because when you are
                    browsing through sites, you may not look at this part unless you really have to —
                    and even then, you might not actually read all the content! However, it's very
                    important to have the terms page on your website, for a number of reasons. Once
                    you've learned all about these reasons, you may realize that adding this part to
                    your website is really essential.
                  </p>
                  <p>
                    Even a short Privacy Policy agreement should include several key clauses to
                    safeguard your business. For example, if you're selling online and incorrectly price
                    an item, your Privacy Policy are what will enable you to cancel the order.
                  </p>
                  <ul>
                    <li>Acceptable use of your website and all of its content.</li>
                    <li>Rules on uploading any content in your website.</li>
                    <li>Any and all websites which are linked to your own.</li>
                    <li>The availability of your website.</li>
                    <li>Returns and Guarantees for Customers</li>
                  </ul>
                  <p>
                    If any estimates of how long it will take the cleaning operatives to complete the job
                    are being provided those are only estimates based on the average time it takes to
                    clean a home or an office of similar size to the Client's, it being difficult to
                    calculate precisely how long such tasks may take and that a degree of flexibility
                    may be required.
                  </p>
                  <div className="row t-sub">
                    <div className="col-md-6 col-sm-6 col-12">
                      <div className="pf-p-details-img">
                        <Image src={fagImg2} alt="Privacy policy illustration" />
                      </div>
                    </div>
                    <div className="col-md-6 col-sm-6 col-12">
                      <div className="pf-p-details-img">
                        <Image src={fagImg3} alt="Data protection illustration" />
                      </div>
                    </div>
                  </div>
                  <p>
                    Post Construction Cleaning (Builders Cleaning), Event Cleaning or badly neglected
                    homes may take up to three times longer than a well maintained home requiring
                    general cleaning.
                  </p>
                </div>
                <div className="pf-faq-section">
                  <h4>Frequently Asked Questions</h4>
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-12">
                      <FaqSection />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <Scrollbar />
    </div>
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
