/**
 * pages/admin/settings.js — Site settings editor
 * Loads GET /api/admin/settings, submits PUT, calls revalidate type=settings.
 */
import { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.js';
import ImageUploader from '../../components/admin/ImageUploader.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

const SOCIAL_KEYS = ['facebook', 'instagram', 'tiktok', 'twitter', 'youtube'];

function Counter({ value, max }) {
  const len = (value || '').length;
  return (
    <span className={`${s.counter} ${len > max ? s.counterOver : ''}`}>
      {len}/{max}
    </span>
  );
}

function Field({ label, hint, children, error }) {
  return (
    <div className={s.field}>
      <label className={s.label}>
        {label}
        {hint && <span className={s.labelHint}> — {hint}</span>}
      </label>
      {error && <span className={s.fieldError}>{error}</span>}
      {children}
    </div>
  );
}

export default function AdminSettings() {
  const [form,    setForm]    = useState(null);
  const [errors,  setErrors]  = useState({});
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [loadErr, setLoadErr] = useState('');
  const [saveErr, setSaveErr] = useState('');

  // Load settings
  useEffect(() => {
    fetch('/api/admin/settings')
      .then((r) => r.ok ? r.json() : Promise.reject(r.status))
      .then((data) => {
        setForm({
          businessName:           data.businessName           || '',
          tagline:                data.tagline                || '',
          whatsappNumber:         data.whatsappNumber         || '',
          whatsappDefaultMessage: data.whatsappDefaultMessage || '',
          phone:                  data.phone                  || '',
          email:                  data.email                  || '',
          address:                data.address                || '',
          city:                   data.city                   || '',
          openingHours:           data.openingHours           || '',
          facebook:               data.socialLinks?.facebook  || '',
          instagram:              data.socialLinks?.instagram || '',
          tiktok:                 data.socialLinks?.tiktok    || '',
          twitter:                data.socialLinks?.twitter   || '',
          youtube:                data.socialLinks?.youtube   || '',
          defaultSeoTitle:        data.defaultSeoTitle        || '',
          defaultSeoDescription:  data.defaultSeoDescription  || '',
          ogImage:                data.ogImage                || null,
        });
      })
      .catch(() => setLoadErr('Could not load settings.'));
  }, []);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
    if (errors[key]) setErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    setSaved(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setSaveErr('');
    setErrors({});
    setSaved(false);

    // Build payload — never send empty businessName or whatsappNumber
    const payload = {
      tagline:                form.tagline,
      whatsappDefaultMessage: form.whatsappDefaultMessage,
      phone:                  form.phone,
      email:                  form.email,
      address:                form.address,
      city:                   form.city,
      openingHours:           form.openingHours,
      defaultSeoTitle:        form.defaultSeoTitle,
      defaultSeoDescription:  form.defaultSeoDescription,
      socialLinks: {
        facebook:  form.facebook,
        instagram: form.instagram,
        tiktok:    form.tiktok,
        twitter:   form.twitter,
        youtube:   form.youtube,
      },
    };
    if (form.businessName.trim())   payload.businessName   = form.businessName;
    if (form.whatsappNumber.trim()) payload.whatsappNumber = form.whatsappNumber;
    if (form.ogImage?.url)          payload.ogImage        = form.ogImage;

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.details) {
          const errs = {};
          for (const { path, message } of data.details) errs[path] = message;
          setErrors(errs);
          setSaveErr('Please fix the errors above.');
        } else {
          setSaveErr(data.error || 'Save failed.');
        }
        return;
      }
      setSaved(true);
      // Revalidate all settings-dependent pages in background
      fetch('/api/admin/revalidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'settings' }),
      }).catch(() => {});
    } catch {
      setSaveErr('Network error — please try again.');
    } finally {
      setSaving(false);
    }
  }

  if (loadErr) return <AdminLayout title="Settings"><p style={{ color: '#dc2626', padding: 20 }}>{loadErr}</p></AdminLayout>;
  if (!form)   return <AdminLayout title="Settings"><p style={{ color: '#6b7280', padding: 20 }}>Loading…</p></AdminLayout>;

  return (
    <AdminLayout title="Settings">
      <h1 className={s.pageTitle}>Site Settings</h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className={s.formPanel}>
          {saveErr && <div className={s.apiError}>{saveErr}</div>}

          <h2 className={s.formTitle} style={{ fontSize: 16 }}>Business info</h2>
          <div className={s.settingsGrid}>
            <Field label="Business name" error={errors.businessName}>
              <input id="sett-name" className={s.input} value={form.businessName} onChange={(e) => set('businessName', e.target.value)} />
            </Field>
            <Field label="Tagline" error={errors.tagline}>
              <input id="sett-tagline" className={s.input} value={form.tagline} onChange={(e) => set('tagline', e.target.value)} />
            </Field>
            <Field
              label="WhatsApp number"
              hint="International format, e.g. 254712345678 (no leading 0)"
              error={errors.whatsappNumber}
            >
              <input id="sett-wa" className={s.input} value={form.whatsappNumber} onChange={(e) => set('whatsappNumber', e.target.value)} placeholder="254712345678" />
            </Field>
            <Field label="WhatsApp default message" error={errors.whatsappDefaultMessage}>
              <textarea id="sett-wamsg" className={s.textarea} rows={3} value={form.whatsappDefaultMessage} onChange={(e) => set('whatsappDefaultMessage', e.target.value)} />
            </Field>
            <Field label="Phone" error={errors.phone}>
              <input id="sett-phone" className={s.input} value={form.phone} onChange={(e) => set('phone', e.target.value)} />
            </Field>
            <Field label="Email" error={errors.email}>
              <input id="sett-email" className={s.input} type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
            </Field>
            <Field label="Address" error={errors.address}>
              <input id="sett-addr" className={s.input} value={form.address} onChange={(e) => set('address', e.target.value)} />
            </Field>
            <Field label="City" error={errors.city}>
              <input id="sett-city" className={s.input} value={form.city} onChange={(e) => set('city', e.target.value)} />
            </Field>
            <Field label="Opening hours" error={errors.openingHours}>
              <input id="sett-hours" className={s.input} value={form.openingHours} onChange={(e) => set('openingHours', e.target.value)} placeholder="Mon–Sat 8am–6pm" />
            </Field>
          </div>

          <h2 className={s.formTitle} style={{ fontSize: 16, marginTop: 24 }}>Social links</h2>
          <div className={s.settingsGrid}>
            {SOCIAL_KEYS.map((k) => (
              <Field key={k} label={k.charAt(0).toUpperCase() + k.slice(1)} error={errors[`socialLinks.${k}`]}>
                <input
                  id={`sett-social-${k}`}
                  className={s.input}
                  type="url"
                  value={form[k]}
                  onChange={(e) => set(k, e.target.value)}
                  placeholder={`https://${k}.com/yourpage`}
                />
              </Field>
            ))}
          </div>

          <h2 className={s.formTitle} style={{ fontSize: 16, marginTop: 24 }}>SEO defaults</h2>
          <div className={s.settingsGrid}>
            <Field label="Default SEO title" error={errors.defaultSeoTitle}>
              <input
                id="sett-seotitle"
                className={s.input}
                maxLength={70}
                value={form.defaultSeoTitle}
                onChange={(e) => set('defaultSeoTitle', e.target.value)}
              />
              <Counter value={form.defaultSeoTitle} max={70} />
            </Field>
            <Field label="Default SEO description" error={errors.defaultSeoDescription}>
              <textarea
                id="sett-seodesc"
                className={s.textarea}
                rows={3}
                maxLength={170}
                value={form.defaultSeoDescription}
                onChange={(e) => set('defaultSeoDescription', e.target.value)}
              />
              <Counter value={form.defaultSeoDescription} max={170} />
            </Field>
          </div>

          <h2 className={s.formTitle} style={{ fontSize: 16, marginTop: 24 }}>OG / share image</h2>
          <ImageUploader
            id="sett-ogimage"
            value={form.ogImage}
            onChange={(v) => set('ogImage', v)}
            section="site"
          />

          <div className={s.formActions} style={{ marginTop: 24 }}>
            <button type="submit" className={`${s.btn} ${s.btnPrimary}`} disabled={saving}>
              {saving ? 'Saving…' : 'Save settings'}
            </button>
            {saved && <span className={s.savedMsg}>✓ Saved!</span>}
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
