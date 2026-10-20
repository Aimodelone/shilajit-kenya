/**
 * pages/faq/index.js
 * Database-driven FAQ page with ISR.
 * JSON-LD FAQPage built from visible Q&A pairs (plain text answers, HTML stripped).
 */
import React, { useState, Fragment } from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import { getFaqs, getSettings } from '../../lib/data';
import { absoluteUrl } from '../../lib/site';

/** Strip HTML tags from a string for JSON-LD (answers must be plain text). */
function stripHtml(str) {
  return String(str || '').replace(/<[^>]*>/g, '').trim();
}

export default function FaqPage({ faqs, settings }) {
  const [expanded, setExpanded] = useState(false);
  const handleChange = (panel) => (_, isExpanded) => setExpanded(isExpanded ? panel : false);

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: stripHtml(faq.answer),
      },
    })),
  };

  return (
    <Fragment>
      <Seo
        title="Shilajit FAQ: Questions About Use, Safety and Benefits | Shilajit Kenya"
        description="Answers to the most common questions about Shilajit — how to use it, its safety, what benefits to expect and how to buy in Kenya."
        path="/faq"
        settings={settings}
        jsonLd={[faqLd]}
      />
      <Navbar2 />
      <PageTitle pageTitle="FAQ" pagesub="FAQ" />

      <section className="wpo-faq-section section-padding">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-8 offset-lg-2">
              <div className="wpo-section-title">
                <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Frequently Asked Questions</h1>
              </div>
            </div>
            <div className="col-lg-8 offset-lg-2">
              <div className="wpo-benefits-section">
                <div className="row">
                  <div className="col-lg-12 col-12">
                    <div className="wpo-benefits-item">
                      {faqs.map((faq, i) => (
                        <Accordion
                          key={faq._id}
                          expanded={expanded === `panel${i}`}
                          onChange={handleChange(`panel${i}`)}
                        >
                          <AccordionSummary
                            expandIcon=""
                            aria-controls={`panel${i}-content`}
                            id={`panel${i}-header`}
                          >
                            <Typography>{faq.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>{faq.answer}</Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
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
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    const [faqs, settings] = await Promise.all([getFaqs(), getSettings()]);
    return { props: { faqs, settings }, revalidate: 60 };
  } catch {
    return { props: { faqs: [], settings: {} }, revalidate: 60 };
  }
}
