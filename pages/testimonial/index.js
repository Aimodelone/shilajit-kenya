/**
 * pages/testimonial/index.js
 * Database-driven testimonials page with ISR.
 * No star ratings or Review/AggregateRating structured data.
 */
import React, { Fragment } from 'react';
import Image from 'next/image';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
import { getTestimonials, getSettings } from '../../lib/data';

export default function TestimonialPage({ testimonials, settings }) {
  return (
    <Fragment>
      <Seo
        title="Customer Testimonials | Shilajit Kenya"
        description="Read what Kenyans say about Shilajit Kenya's products — real reviews from customers who improved their energy, focus and wellness with Shilajit."
        path="/testimonial"
        settings={settings}
      />
      <Navbar2 />
      <PageTitle pageTitle="Testimonials" pagesub="Testimonials" />

      <section className="wpo-testimonial-section section-padding pt-100">
        <div className="container">
          <div className="wpo-section-title" style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontSize: '2rem' }}>What Our Customers Say</h1>
            <p>Real stories from Kenyans who use Shilajit Kenya products every day.</p>
          </div>
          <div className="row justify-content-center">
            {testimonials.map((t) => (
              <div className="col-lg-4 col-md-6 col-12" key={t._id} style={{ marginBottom: '32px' }}>
                <div className="wpo-testimonial-item" style={{
                  background: '#fff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 16px rgba(0,0,0,0.08)',
                  padding: '28px',
                  height: '100%',
                }}>
                  <div className="wpo-testimonial-text">
                    <i className="fi flaticon-right-quote-sign" style={{ fontSize: '2rem', color: '#c9a84c', marginBottom: '12px', display: 'block' }}></i>
                    <p style={{ fontStyle: 'italic', marginBottom: '20px' }}>"{t.review}"</p>
                    <div className="wpo-testimonial-text-btm" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {t.image?.url ? (
                        <Image
                          src={t.image.url}
                          alt={`${t.name} — Shilajit Kenya customer`}
                          width={56}
                          height={56}
                          style={{ borderRadius: '50%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div style={{
                          width: 56, height: 56, borderRadius: '50%',
                          background: '#c9a84c', display: 'flex',
                          alignItems: 'center', justifyContent: 'center',
                          color: '#fff', fontWeight: 700, fontSize: '1.2rem',
                        }}>
                          {t.name ? t.name.charAt(0) : '?'}
                        </div>
                      )}
                      <div>
                        <h3 style={{ fontSize: '1rem', margin: 0 }}>{t.name}</h3>
                        {t.role && <span style={{ fontSize: '0.875rem', color: '#888' }}>{t.role}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {testimonials.length === 0 && (
              <p style={{ textAlign: 'center' }}>Testimonials coming soon.</p>
            )}
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
    const [testimonials, settings] = await Promise.all([getTestimonials(), getSettings()]);
    return { props: { testimonials, settings }, revalidate: 60 };
  } catch {
    return { props: { testimonials: [], settings: {} }, revalidate: 60 };
  }
}
