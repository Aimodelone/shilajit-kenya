/**
 * pages/contact/index.js
 * Contact page with:
 * - Contact info from site settings (hides empty fields)
 * - Form wired to POST /api/inquiries (honeypot, formStartedAt, validation)
 * - LocalBusiness JSON-LD from settings
 * - One h1, Seo component
 */
import React, { Fragment, useState, useEffect, useRef } from 'react';
import Navbar2 from '../../components/Navbar2/Navbar2';
import PageTitle from '../../components/pagetitle/PageTitle';
import Footer from '../../components/footer/Footer';
import Scrollbar from '../../components/scrollbar/scrollbar';
import Seo from '../../components/Seo/Seo';
// server-only data helpers required inline inside getStaticProps (see below)
import { absoluteUrl } from '../../lib/site';

export default function ContactPage({ settings }) {
  const s = settings || {};

  /* ── LocalBusiness JSON-LD ─────────────────────────────────────────────── */
  const localBizLd = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: s.businessName || 'Shilajit Kenya',
    url: absoluteUrl('/'),
    ...(s.phone    ? { telephone: s.phone }    : {}),
    ...(s.email    ? { email: s.email }         : {}),
    ...(s.address  ? { address: { '@type': 'PostalAddress', streetAddress: s.address, addressCountry: 'KE' } } : {}),
    ...(s.openingHours ? { openingHours: s.openingHours } : {}),
    sameAs: Object.values(s.socialLinks || {}).filter(Boolean),
  };

  /* ── Form state ─────────────────────────────────────────────────────────── */
  const [form, setForm]       = useState({ name: '', phone: '', email: '', subject: '', message: '', website: '' });
  const [sending, setSending] = useState(false);
  const [result,  setResult]  = useState(null); // { ok: bool, msg: string }
  const startedAt             = useRef(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);

  const change = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setResult(null);

    // Browser validation
    if (!form.name.trim())                              return setResult({ ok: false, msg: 'Your name is required.' });
    if (!form.message.trim())                           return setResult({ ok: false, msg: 'Message is required.' });
    if (!form.phone.trim() && !form.email.trim())       return setResult({ ok: false, msg: 'Please provide at least a phone number or email.' });

    setSending(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:          form.name.trim(),
          phone:         form.phone.trim() || undefined,
          email:         form.email.trim() || undefined,
          subject:       form.subject.trim() || undefined,
          message:       form.message.trim(),
          sourcePage:    '/contact',
          formStartedAt: startedAt.current,
          website:       form.website, // honeypot
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (res.status === 201 || (res.ok && data.success)) {
        setForm({ name: '', phone: '', email: '', subject: '', message: '', website: '' });
        startedAt.current = Date.now();
        setResult({ ok: true, msg: 'Thank you! We received your message and will be in touch shortly.' });
      } else if (res.status === 429) {
        setResult({ ok: false, msg: 'Too many requests. Please wait a moment and try again.' });
      } else if (res.status === 400) {
        setResult({ ok: false, msg: data.error || 'Please check your details and try again.' });
      } else {
        setResult({ ok: false, msg: 'Something went wrong. Please try again or contact us by phone.' });
      }
    } catch {
      setResult({ ok: false, msg: 'Could not reach the server. Please check your connection and try again.' });
    } finally {
      setSending(false);
    }
  };

  return (
    <Fragment>
      <Seo
        title="Contact Shilajit Kenya | Order or Ask a Question"
        description="Get in touch with Shilajit Kenya — order products, ask about Shilajit benefits or get delivery information for Nairobi and across Kenya."
        path="/contact"
        settings={settings}
        jsonLd={[localBizLd]}
      />
      <Navbar2 />
      <PageTitle pageTitle="Contact Us" pagesub="Contact" />

      <section className="wpo-contact-pg-section section-padding">
        <div className="container">
          <div className="row">
            <div className="col col-lg-10 offset-lg-1">

              <h1 style={{ fontSize: '2rem', marginBottom: '8px', textAlign: 'center' }}>Get in Touch</h1>
              <p style={{ textAlign: 'center', marginBottom: '32px', color: '#666' }}>
                Questions about Shilajit, orders, or delivery? We are here to help.
              </p>

              {/* Contact info cards — hide empty fields */}
              <div className="office-info">
                <div className="row justify-content-center">
                  {s.address && (
                    <div className="col-md-4 mb-4">
                      <div className="office-info-item text-center p-4 h-100 shadow rounded bg-white">
                        <div className="office-info-icon mb-3"><i className="fi flaticon-maps-and-flags" style={{ fontSize: '2rem' }}></i></div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Address</h2>
                        <p style={{ color: '#555' }}>{s.address}{s.city ? `, ${s.city}` : ''}</p>
                      </div>
                    </div>
                  )}
                  {s.phone && (
                    <div className="col-md-4 mb-4">
                      <div className="office-info-item text-center p-4 h-100 shadow rounded bg-white">
                        <div className="office-info-icon mb-3"><i className="fi flaticon-phone-call" style={{ fontSize: '2rem' }}></i></div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Call Us</h2>
                        <p><a href={`tel:${s.phone}`} style={{ color: '#c9a84c' }}>{s.phone}</a></p>
                      </div>
                    </div>
                  )}
                  {s.email && (
                    <div className="col-md-4 mb-4">
                      <div className="office-info-item text-center p-4 h-100 shadow rounded bg-white">
                        <div className="office-info-icon mb-3"><i className="fi flaticon-email" style={{ fontSize: '2rem' }}></i></div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Email</h2>
                        <p><a href={`mailto:${s.email}`} style={{ color: '#c9a84c' }}>{s.email}</a></p>
                      </div>
                    </div>
                  )}
                  {s.openingHours && (
                    <div className="col-md-4 mb-4">
                      <div className="office-info-item text-center p-4 h-100 shadow rounded bg-white">
                        <div className="office-info-icon mb-3"><i className="fi flaticon-calendar" style={{ fontSize: '2rem' }}></i></div>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Hours</h2>
                        <p style={{ color: '#555', whiteSpace: 'pre-line' }}>{s.openingHours}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact form */}
              <div className="wpo-contact-title text-center mt-4" style={{ marginBottom: '24px' }}>
                <h2 style={{ fontSize: '1.5rem' }}>Send Us a Message</h2>
              </div>

              {result && (
                <div style={{
                  padding: '12px 20px',
                  borderRadius: '6px',
                  marginBottom: '20px',
                  background: result.ok ? '#d4edda' : '#f8d7da',
                  color:      result.ok ? '#155724' : '#721c24',
                  border:     `1px solid ${result.ok ? '#c3e6cb' : '#f5c6cb'}`,
                }}>
                  {result.msg}
                </div>
              )}

              <form onSubmit={submit} className="contact-validation-active" noValidate>
                {/* Honeypot — visually hidden */}
                <div style={{ position: 'absolute', left: '-9999px', top: '-9999px' }} aria-hidden="true">
                  <label htmlFor="website">Leave this empty</label>
                  <input
                    id="website"
                    name="website"
                    type="text"
                    value={form.website}
                    onChange={change}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="row">
                  <div className="col col-lg-6 col-12">
                    <div className="form-field">
                      <input
                        type="text"
                        name="name"
                        id="contact-name"
                        placeholder="Your Name *"
                        value={form.name}
                        onChange={change}
                        required
                        autoComplete="name"
                      />
                    </div>
                  </div>
                  <div className="col col-lg-6 col-12">
                    <div className="form-field">
                      <input
                        type="tel"
                        name="phone"
                        id="contact-phone"
                        placeholder="Phone Number"
                        value={form.phone}
                        onChange={change}
                        autoComplete="tel"
                      />
                    </div>
                  </div>
                  <div className="col col-lg-6 col-12">
                    <div className="form-field">
                      <input
                        type="email"
                        name="email"
                        id="contact-email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={change}
                        autoComplete="email"
                      />
                    </div>
                  </div>
                  <div className="col col-lg-6 col-12">
                    <div className="form-field">
                      <input
                        type="text"
                        name="subject"
                        id="contact-subject"
                        placeholder="Subject (optional)"
                        value={form.subject}
                        onChange={change}
                      />
                    </div>
                  </div>
                  <div className="col col-lg-12 col-12">
                    <textarea
                      name="message"
                      id="contact-message"
                      placeholder="Your Message *"
                      value={form.message}
                      onChange={change}
                      required
                      rows={5}
                    />
                  </div>
                </div>

                <div className="submit-area" style={{ textAlign: 'center', marginTop: '16px' }}>
                  <button type="submit" className="theme-btn" disabled={sending}>
                    {sending ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Map */}
        <section className="wpo-contact-map-section mt-10" style={{ marginTop: '48px' }}>
          <div className="wpo-contact-map" style={{ height: '400px' }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.864516071451!2d36.81930387496539!3d-1.2920655356174386!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1149e06e36cf%3A0x3b3e8a6cfbb6b09b!2sKusi%20Ln%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1723875600000!5m2!1sen!2ske"
              style={{ width: '100%', height: '100%', border: 0, borderRadius: '4px' }}
              allowFullScreen=""
              loading="lazy"
              title="Shilajit Kenya location"
            />
          </div>
        </section>
      </section>

      <Footer />
      <Scrollbar />
    </Fragment>
  );
}

export async function getStaticProps() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getSettings } = require('../../lib/data');
    const settings = await getSettings();
    return { props: { settings }, revalidate: 60 };
  } catch {
    return { props: { settings: {} }, revalidate: 60 };
  }
}
