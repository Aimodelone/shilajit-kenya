/**
 * pages/admin/index.js — Admin dashboard
 * Shows count cards from /api/admin/stats, quick action buttons.
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '../../components/admin/AdminLayout.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

const SECTIONS = [
  { key: 'products',     label: 'Products',      href: '/admin/products' },
  { key: 'benefits',     label: 'Benefits',      href: '/admin/benefits' },
  { key: 'posts',        label: 'Blog Posts',    href: '/admin/blog' },
  { key: 'testimonials', label: 'Testimonials',  href: '/admin/testimonials' },
  { key: 'faqs',         label: 'FAQs',          href: '/admin/faqs' },
  { key: 'inquiries',    label: 'All Messages',  href: '/admin/inquiries' },
];

export default function AdminDashboard({ adminEmail }) {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { setStats(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <h1 className={s.pageTitle}>Dashboard</h1>
      <p style={{ color: '#6b7280', marginBottom: 24, fontSize: 14 }}>
        Signed in as {adminEmail}
      </p>

      {loading && <p style={{ color: '#6b7280' }}>Loading stats…</p>}

      {stats && (
        <>
          {/* Unread messages highlight */}
          <Link href="/admin/inquiries?read=false" className={s.statCard} style={{ marginBottom: 20, display: 'block', borderColor: stats.unreadInquiries > 0 ? '#4f46e5' : undefined }}>
            <div className={`${s.statNum} ${stats.unreadInquiries > 0 ? s.statUnread : ''}`}>
              {stats.unreadInquiries}
            </div>
            <div className={s.statLabel}>
              {stats.unreadInquiries === 1 ? 'Unread message' : 'Unread messages'}
              {stats.unreadInquiries > 0 && ' — click to view →'}
            </div>
          </Link>

          <div className={s.cardGrid}>
            {SECTIONS.map(({ key, label, href }) => (
              <Link key={key} href={href} className={s.statCard}>
                <div className={s.statNum}>{stats[key] ?? '—'}</div>
                <div className={s.statLabel}>{label}</div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Quick actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 8 }}>
        <Link href="/admin/products?action=add" className={`${s.btn} ${s.btnPrimary}`}>
          + Add product
        </Link>
        <Link href="/admin/blog?action=add" className={`${s.btn} ${s.btnSecondary}`}>
          + Add blog post
        </Link>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
