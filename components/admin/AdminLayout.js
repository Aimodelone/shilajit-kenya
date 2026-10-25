/**
 * components/admin/AdminLayout.js
 * Top-bar nav layout for all admin pages.
 * - Renders noindex meta + admin title in <head>
 * - Sticky top bar with brand, nav links, view-site and logout
 * - Mobile: nav hides behind a hamburger button
 * - Fetches /api/admin/stats for the unread message badge
 */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import s from '../../styles/Admin.module.css';

const NAV = [
  { href: '/admin',             label: 'Dashboard' },
  { href: '/admin/products',    label: 'Products' },
  { href: '/admin/benefits',    label: 'Benefits' },
  { href: '/admin/blog',        label: 'Blog' },
  { href: '/admin/testimonials',label: 'Testimonials' },
  { href: '/admin/faqs',        label: 'FAQs' },
  { href: '/admin/inquiries',   label: 'Messages' },
  { href: '/admin/settings',    label: 'Settings' },
];

export default function AdminLayout({ children, title }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unread, setUnread]     = useState(0);

  // Fetch unread count for the badge
  useEffect(() => {
    fetch('/api/admin/stats')
      .then((r) => r.ok ? r.json() : null)
      .then((d) => { if (d) setUnread(d.unreadInquiries || 0); })
      .catch(() => {});
  }, [router.pathname]);

  async function handleLogout() {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch { /* ignore */ }
    router.push('/admin/login');
  }

  // Close mobile menu on navigation
  useEffect(() => { setMenuOpen(false); }, [router.pathname]);

  return (
    <div className={s.wrap}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>{title ? `${title} | Admin` : 'Admin | Shilajit Kenya'}</title>
      </Head>

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className={s.topbar}>
        <button
          className={s.menuBtn}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        <Link href="/admin" className={s.brand}>
          Shilajit Kenya
        </Link>

        <nav className={s.nav} aria-label="Admin navigation">
          {NAV.map(({ href, label }) => {
            const active = href === '/admin'
              ? router.pathname === '/admin'
              : router.pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`${s.navLink} ${active ? s.navLinkActive : ''}`}
              >
                {label}
                {label === 'Messages' && unread > 0 && (
                  <span className={s.badge}>{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className={s.navActions}>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.navBtn} ${s.viewSite}`}
          >
            View site ↗
          </a>
          <button className={s.navBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      {/* ── Mobile nav drawer ────────────────────────────────── */}
      <nav
        className={`${s.mobileNav} ${menuOpen ? s.mobileNavOpen : ''}`}
        aria-label="Mobile admin navigation"
      >
        {NAV.map(({ href, label }) => {
          const active = href === '/admin'
            ? router.pathname === '/admin'
            : router.pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`${s.mobileNavLink} ${active ? s.mobileNavLinkActive : ''}`}
            >
              {label}
              {label === 'Messages' && unread > 0 && (
                <> <span className={s.badge}>{unread}</span></>
              )}
            </Link>
          );
        })}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className={s.mobileNavLink}
        >
          View site ↗
        </a>
        <button
          className={s.mobileNavLink}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left', color: '#fca5a5' }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </nav>

      {/* ── Page content ─────────────────────────────────────── */}
      <main className={s.main}>
        {children}
      </main>
    </div>
  );
}
