/**
 * pages/admin/inquiries.js — Inbox for contact + order inquiries.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import AdminLayout from '../../components/admin/AdminLayout.js';
import { requireAdminPage } from '../../lib/adminPage.js';
import s from '../../styles/Admin.module.css';

function formatDate(d) {
  if (!d) return '';
  return new Date(d).toLocaleString('en-KE', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

/** Convert a phone number to a clean international WhatsApp number */
function toWaNumber(phone) {
  if (!phone) return null;
  let digits = phone.replace(/[\s+\-().]/g, '');
  if (digits.startsWith('0')) digits = '254' + digits.slice(1);
  return digits.length >= 7 ? digits : null;
}

function InquiryCard({ item, onToggleRead, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [acting,   setActing]   = useState(false);
  const msg     = item.message || '';
  const truncated = !expanded && msg.length > 200;
  const waNum   = toWaNumber(item.phone);

  async function toggleRead() {
    setActing(true);
    try { await onToggleRead(item._id, !item.read); } finally { setActing(false); }
  }
  async function del() {
    if (!window.confirm('Delete this message? This cannot be undone.')) return;
    setActing(true);
    try { await onDelete(item._id); } finally { setActing(false); }
  }

  return (
    <div className={`${s.inquiryCard} ${!item.read ? s.inquiryUnread : ''}`}>
      <div className={s.inquiryMeta}>
        <div>
          <span className={s.inquiryName}>{item.name}</span>
          {' '}
          <span className={`${s.pill} ${item.type === 'order' ? s.pillBlue : s.pillGray}`} style={{ marginLeft: 6 }}>
            {item.type === 'order' ? 'Order' : 'Contact'}
          </span>
          {!item.read && (
            <span className={`${s.pill} ${s.pillAmber}`} style={{ marginLeft: 4 }}>Unread</span>
          )}
        </div>
        <span className={s.inquiryDate}>{formatDate(item.createdAt)}</span>
      </div>

      <div className={s.inquiryContacts}>
        {item.phone && (
          <a href={`tel:${item.phone}`}>{item.phone}</a>
        )}
        {item.email && (
          <a href={`mailto:${item.email}`}>{item.email}</a>
        )}
      </div>

      {item.productName && (
        <p className={s.resourceMeta}>
          Product: <strong>{item.productName}</strong>
          {item.quantity && ` × ${item.quantity}`}
        </p>
      )}

      <div className={s.inquiryMsg}>
        {truncated ? `${msg.slice(0, 200)}…` : msg}
        {msg.length > 200 && (
          <> <button className={s.showMore} onClick={() => setExpanded((e) => !e)}>
            {expanded ? 'show less' : 'show more'}
          </button></>
        )}
      </div>

      <div className={s.inquiryActions}>
        <button
          className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}
          disabled={acting}
          onClick={toggleRead}
        >
          {item.read ? 'Mark unread' : 'Mark read'}
        </button>
        <button
          className={`${s.btn} ${s.btnDanger} ${s.btnSm}`}
          disabled={acting}
          onClick={del}
        >
          Delete
        </button>
        {waNum && (
          <a
            href={`https://wa.me/${waNum}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${s.btn} ${s.btnGhost} ${s.btnSm}`}
          >
            Reply on WhatsApp ↗
          </a>
        )}
      </div>
    </div>
  );
}

export default function AdminInquiries() {
  const [items,       setItems]       = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [search,      setSearch]      = useState('');
  const [debQ,        setDebQ]        = useState('');
  const [readFilter,  setReadFilter]  = useState('');
  const timer = useRef(null);

  function handleSearch(e) {
    setSearch(e.target.value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setDebQ(e.target.value); setPage(1); }, 400);
  }

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const p = new URLSearchParams({ page, limit: 10 });
      if (debQ)       p.set('q',    debQ);
      if (readFilter) p.set('read', readFilter);
      const res = await fetch(`/api/admin/inquiries?${p}`);
      if (res.ok) {
        const d = await res.json();
        setItems(d.items || []);
        setTotal(d.total || 0);
        setTotalPages(d.totalPages || 1);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, [page, debQ, readFilter]);

  useEffect(() => { fetchList(); }, [fetchList]);

  async function handleToggleRead(id, read) {
    const res = await fetch(`/api/admin/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ read }),
    });
    if (res.ok) {
      setItems((prev) => prev.map((i) => i._id === id ? { ...i, read } : i));
    }
  }

  async function handleDelete(id) {
    const res = await fetch(`/api/admin/inquiries/${id}`, { method: 'DELETE' });
    if (res.ok) {
      const newTotal = total - 1;
      const maxPage  = Math.max(1, Math.ceil(newTotal / 10));
      if (page > maxPage) setPage(maxPage);
      else fetchList();
    }
  }

  return (
    <AdminLayout title="Messages">
      <h1 className={s.pageTitle}>Messages</h1>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>
        {total} total{total !== 1 ? 's' : ''}
      </p>

      {/* Toolbar */}
      <div className={s.toolbar}>
        <input
          type="search"
          placeholder="Search name, message, phone…"
          value={search}
          onChange={handleSearch}
          className={s.searchInput}
        />
        <select
          value={readFilter}
          onChange={(e) => { setReadFilter(e.target.value); setPage(1); }}
          className={s.filterSelect}
          aria-label="Filter by read status"
        >
          <option value="">All</option>
          <option value="false">Unread</option>
          <option value="true">Read</option>
        </select>
      </div>

      {loading
        ? <p style={{ color: '#6b7280' }}>Loading…</p>
        : items.length === 0
          ? <p style={{ color: '#6b7280' }}>No messages found.</p>
          : items.map((item) => (
            <InquiryCard
              key={item._id}
              item={item}
              onToggleRead={handleToggleRead}
              onDelete={handleDelete}
            />
          ))
      }

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={s.pagination}>
          <button className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            ← Prev
          </button>
          <span>Page {page} of {totalPages}</span>
          <button className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`} disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
            Next →
          </button>
        </div>
      )}
    </AdminLayout>
  );
}

export async function getServerSideProps(ctx) {
  return requireAdminPage(ctx);
}
