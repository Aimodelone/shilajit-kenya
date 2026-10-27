/**
 * components/admin/AdminLayout.js
 * Left-sidebar layout for all admin pages.
 *
 * Desktop (≥768px): fixed 250px sidebar + scrollable main content area.
 * Mobile (<768px):  slim sticky top bar + off-canvas drawer, dark overlay,
 *                   closes on overlay tap / link tap / route change / Escape.
 *
 * Keeps: noindex meta, "Admin | Shilajit Kenya" title pattern.
 * Never renders public header, footer, or widgets.
 */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import s from '../../styles/Admin.module.css';

const NAV = [
  { href: '/admin',              label: 'Dashboard',    exact: true },
  { href: '/admin/products',     label: 'Products' },
  { href: '/admin/benefits',     label: 'Benefits' },
  { href: '/admin/blog',         label: 'Blog' },
  { href: '/admin/testimonials', label: 'Testimonials' },
  { href: '/admin/faqs',         label: 'FAQs' },
  { href: '/admin/inquiries',    label: 'Messages' },
  { href: '/admin/settings',     label: 'Settings' },
];

const SIDEBAR_ID = 'admin-sidebar';

export default function AdminLayout({ children, title, adminEmail }) {
  const router = useRouter();
  const [open,   setOpen]   = useState(false);
  const [unread, setUnread] = useState(0);

  // Refresh unread badge on every route change
  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setUnread(d.unreadInquiries || 0); })
      .catch(() => {});
  }, [router.pathname]);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [router.pathname]);

  // Close drawer on Escape key
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Prevent body scroll while drawer is open (mobile)
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  async function handleLogout() {
    try { await fetch('/api/admin/logout', { method: 'POST' }); } catch { /* ignore */ }
    router.push('/admin/login');
  }

  function isActive({ href, exact }) {
    if (exact) return router.pathname === href;
    return router.pathname === href || router.pathname.startsWith(href + '/');
  }

  // ── Sidebar interior (shared between desktop fixed + mobile drawer) ────
  function SidebarInner() {
    return (
      <>
        {/* Brand */}
        <Link href="/admin" className={s.sidebarBrand} onClick={() => setOpen(false)}>
          <span className={s.brandName}>Shilajit Kenya</span>
          <span className={s.brandLabel}>Admin</span>
        </Link>

        {/* Nav links */}
        <nav className={s.sidebarNav} aria-label="Admin navigation">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${s.navLink} ${active ? s.navLinkActive : ''}`}
                aria-current={active ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                {item.label}
                {item.label === 'Messages' && unread > 0 && (
                  <span className={s.badge}>{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: email, view site, logout */}
        <div className={s.sidebarBottom}>
          {adminEmail && (
            <span className={s.sidebarEmail} title={adminEmail}>{adminEmail}</span>
          )}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={s.sidebarLink}
          >
            View site ↗
          </a>
          <button className={s.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </>
    );
  }

  return (
    <div className={s.wrap}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>{title ? `${title} | Admin` : 'Admin | Shilajit Kenya'}</title>
      </Head>

      {/* ── Mobile top bar (hidden on desktop) ─────────────── */}
      <div className={s.topbar} role="banner">
        <button
          className={s.menuBtn}
          aria-label="Open navigation menu"
          aria-expanded={open}
          aria-controls={SIDEBAR_ID}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
        <Link href="/admin" className={s.topbarBrand}>
          Shilajit Kenya
        </Link>
      </div>

      {/* ── Overlay (mobile only, behind the drawer) ────────── */}
      <div
        className={`${s.overlay} ${open ? s.overlayOpen : ''}`}
        aria-hidden="true"
        onClick={() => setOpen(false)}
      />

      {/* ── Sidebar: fixed on desktop, drawer on mobile ──────── */}
      <aside
        id={SIDEBAR_ID}
        className={`${s.sidebar} ${open ? s.sidebarOpen : ''}`}
        aria-label="Admin sidebar"
      >
        <SidebarInner />
      </aside>

      {/* ── Main content ────────────────────────────────────── */}
      <main className={s.main}>
        {children}
      </main>
    </div>
  );
}
