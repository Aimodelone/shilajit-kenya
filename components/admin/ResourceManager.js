/**
 * components/admin/ResourceManager.js
 * Generic config-driven CRUD UI: card list + inline form.
 *
 * Props:
 *   config   — one of the objects from resources.js
 *   onAction — optional callback after save/delete (e.g. to update a parent counter)
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ImageUploader from './ImageUploader.js';
import s from '../../styles/Admin.module.css';

// ── Helpers ───────────────────────────────────────────────────────────────────

function slugify(text) {
  return text.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 120);
}

function toDateValue(v) {
  if (!v) return '';
  try { return new Date(v).toISOString().slice(0, 10); } catch { return ''; }
}

function buildInitial(fields, item) {
  const vals = {};
  for (const f of fields) {
    if (item) {
      // Editing: populate from item
      if (f.type === 'date') {
        vals[f.key] = toDateValue(item[f.key]);
      } else if (f.type === 'strings') {
        vals[f.key] = Array.isArray(item[f.key]) ? item[f.key].join('\n') : (item[f.key] || '');
      } else if (f.type === 'tags') {
        vals[f.key] = Array.isArray(item[f.key]) ? item[f.key].join(', ') : (item[f.key] || '');
      } else if (f.type === 'images') {
        vals[f.key] = Array.isArray(item[f.key]) ? item[f.key] : [];
      } else if (f.type === 'image') {
        vals[f.key] = item[f.key] || null;
      } else if (f.type === 'checkbox') {
        vals[f.key] = typeof item[f.key] === 'boolean' ? item[f.key] : (f.defaultValue ?? false);
      } else if (f.type === 'number') {
        vals[f.key] = item[f.key] != null ? String(item[f.key]) : '';
      } else {
        vals[f.key] = item[f.key] != null ? String(item[f.key]) : '';
      }
    } else {
      // Adding new
      if (f.type === 'checkbox') vals[f.key] = f.defaultValue ?? false;
      else if (f.type === 'images') vals[f.key] = [];
      else if (f.type === 'image')  vals[f.key] = null;
      else vals[f.key] = '';
    }
  }
  return vals;
}

function buildPayload(fields, vals, isNew) {
  const payload = {};
  for (const f of fields) {
    // Skip the slug field when editing (it's locked)
    if (f.slugField && !isNew) continue;

    const v = vals[f.key];

    if (f.type === 'checkbox') {
      payload[f.key] = !!v;
    } else if (f.type === 'number') {
      const n = v === '' || v === undefined ? undefined : Number(v);
      if (n !== undefined && !isNaN(n)) payload[f.key] = n;
      // omit empty optional numbers
    } else if (f.type === 'strings') {
      const arr = typeof v === 'string'
        ? v.split('\n').map(l => l.trim()).filter(Boolean)
        : [];
      payload[f.key] = arr;
    } else if (f.type === 'tags') {
      const arr = typeof v === 'string'
        ? v.split(',').map(t => t.trim()).filter(Boolean)
        : [];
      payload[f.key] = arr;
    } else if (f.type === 'image') {
      // Only include if it has a URL
      if (v && v.url) payload[f.key] = v;
    } else if (f.type === 'images') {
      if (Array.isArray(v)) payload[f.key] = v.filter(img => img && img.url);
    } else if (f.type === 'date') {
      if (v) payload[f.key] = v; // sent as YYYY-MM-DD string
    } else {
      if (v !== '' || f.required) payload[f.key] = v;
    }
  }
  return payload;
}

// Background revalidation — fires and forgets
async function triggerRevalidate(type, slug) {
  try {
    await fetch('/api/admin/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, slug: slug || undefined }),
    });
  } catch { /* ignore */ }
}

// ── Sub-component: one field ──────────────────────────────────────────────────

function Field({ f, vals, onChange, errors, isNew, idx }) {
  const val = vals[f.key];
  const err = errors[f.key];
  const inputId = `field-${f.key}-${idx}`;
  const charLen = typeof val === 'string' ? val.length : 0;

  const commonProps = {
    id:       inputId,
    disabled: f.slugField && !isNew,
    readOnly: f.slugField && !isNew,
  };

  let input;
  switch (f.type) {
    case 'textarea':
      input = (
        <textarea
          {...commonProps}
          className={s.textarea}
          value={val || ''}
          onChange={(e) => onChange(f.key, e.target.value)}
          rows={f.large ? 10 : 4}
          maxLength={f.maxLength}
        />
      );
      break;
    case 'checkbox':
      return (
        <div key={f.key} className={s.field}>
          <div className={s.checkRow}>
            <input
              id={inputId}
              type="checkbox"
              checked={!!val}
              onChange={(e) => onChange(f.key, e.target.checked)}
            />
            <label htmlFor={inputId} className={s.label}>{f.label}</label>
          </div>
          {err && <span className={s.fieldError}>{err}</span>}
        </div>
      );
    case 'number':
      input = (
        <input
          {...commonProps}
          id={inputId}
          type="number"
          className={s.input}
          value={val || ''}
          onChange={(e) => onChange(f.key, e.target.value)}
          min={0}
        />
      );
      break;
    case 'date':
      input = (
        <input
          {...commonProps}
          id={inputId}
          type="date"
          className={s.input}
          value={val || ''}
          onChange={(e) => onChange(f.key, e.target.value)}
        />
      );
      break;
    case 'image':
      return (
        <div key={f.key} className={`${s.field} ${s.formGridFull}`}>
          <label className={s.label}>{f.label}</label>
          {err && <span className={s.fieldError}>{err}</span>}
          <ImageUploader
            id={inputId}
            value={val}
            onChange={(v) => onChange(f.key, v)}
            section={f.section}
          />
        </div>
      );
    case 'images': {
      const imgs = Array.isArray(val) ? val : [];
      return (
        <div key={f.key} className={`${s.field} ${s.formGridFull}`}>
          <label className={s.label}>{f.label}</label>
          {err && <span className={s.fieldError}>{err}</span>}
          {imgs.map((img, i) => (
            <div key={i} style={{ border: '1px solid #e5e7eb', borderRadius: 6, padding: 12, marginBottom: 8, position: 'relative' }}>
              <ImageUploader
                id={`${inputId}-${i}`}
                value={img}
                onChange={(v) => {
                  const next = [...imgs];
                  next[i] = v;
                  onChange(f.key, next);
                }}
                section={f.section}
              />
              <button
                type="button"
                className={`${s.btn} ${s.btnDanger} ${s.btnSm}`}
                style={{ marginTop: 6 }}
                onClick={() => {
                  const next = imgs.filter((_, j) => j !== i);
                  onChange(f.key, next);
                }}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}
            onClick={() => onChange(f.key, [...imgs, null])}
          >
            + Add image
          </button>
        </div>
      );
    }
    case 'strings':
    case 'tags':
      input = (
        <textarea
          {...commonProps}
          className={s.textarea}
          value={val || ''}
          onChange={(e) => onChange(f.key, e.target.value)}
          rows={3}
          placeholder={f.type === 'tags' ? 'energy, immunity, focus' : 'One item per line'}
        />
      );
      break;
    default:
      input = (
        <input
          {...commonProps}
          id={inputId}
          type="text"
          className={s.input}
          value={val || ''}
          onChange={(e) => onChange(f.key, e.target.value)}
          maxLength={f.maxLength}
        />
      );
  }

  return (
    <div key={f.key} className={s.field}>
      <label htmlFor={inputId} className={s.label}>
        {f.label}
        {f.required && <span style={{ color: '#dc2626' }}> *</span>}
        {f.slugField && !isNew && (
          <span className={s.labelHint}> — Changing a URL hurts Google rankings, so the slug is locked.</span>
        )}
        {f.hint && <span className={s.labelHint}> — {f.hint}</span>}
      </label>
      {err && <span className={s.fieldError}>{err}</span>}
      {input}
      {f.maxLength && f.type !== 'image' && f.type !== 'images' && (
        <span className={`${s.counter} ${charLen > f.maxLength ? s.counterOver : ''}`}>
          {charLen}/{f.maxLength}
        </span>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function ResourceManager({ config }) {
  const router = useRouter();
  const { apiBase, type, label, single, viewBase, getSlug, cardTitle, cardSub, cardImage, cardBadges, fields } = config;

  // List state
  const [items,      setItems]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [listLoading, setListLoading] = useState(true);

  // Toolbar state
  const [search,         setSearch]         = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [pubFilter,      setPubFilter]      = useState('');

  // Form state
  const [view,       setView]       = useState('list'); // 'list' | 'form'
  const [editItem,   setEditItem]   = useState(null);   // null = new
  const [formVals,   setFormVals]   = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [formSaving, setFormSaving] = useState(false);
  const [formSaved,  setFormSaved]  = useState(false);
  const [globalErr,  setGlobalErr]  = useState('');

  // Delete state
  const [deleting,   setDeleting]   = useState(null);

  const searchTimer = useRef(null);

  // Open form via URL param (e.g. ?action=add from dashboard)
  useEffect(() => {
    if (router.query.action === 'add' && view === 'list') {
      openForm(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.action]);

  // Debounce search
  function handleSearchChange(e) {
    setSearch(e.target.value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setDebouncedSearch(e.target.value);
      setPage(1);
    }, 400);
  }

  // Fetch list
  const fetchList = useCallback(async () => {
    setListLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 10 });
      if (debouncedSearch) params.set('q', debouncedSearch);
      if (pubFilter)       params.set('published', pubFilter);
      const res = await fetch(`${apiBase}?${params}`);
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
    } catch {
      // ignore
    } finally {
      setListLoading(false);
    }
  }, [apiBase, page, debouncedSearch, pubFilter, router]);

  useEffect(() => { if (view === 'list') fetchList(); }, [fetchList, view]);

  // Open form
  function openForm(item) {
    setEditItem(item);
    setFormVals(buildInitial(fields, item));
    setFormErrors({});
    setGlobalErr('');
    setFormSaved(false);
    setView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function closeForm() {
    setView('list');
    setEditItem(null);
    // Remove ?action=add from URL if present
    if (router.query.action) {
      router.replace(router.pathname, undefined, { shallow: true });
    }
  }

  // Field change handler
  function handleChange(key, val) {
    setFormVals((prev) => {
      const next = { ...prev, [key]: val };
      // Auto-fill slug from name/title when creating and slug is empty
      const nameKey = fields.find(f => f.slugField)?.key;
      const srcField = fields.find(f => f.key === 'name' || f.key === 'title');
      if (nameKey && srcField && key === srcField.key && !editItem) {
        if (!prev[nameKey]) { // only auto-fill if slug not manually set
          next[nameKey] = slugify(val);
        }
      }
      return next;
    });
    if (formErrors[key]) setFormErrors((prev) => { const n = { ...prev }; delete n[key]; return n; });
    setFormSaved(false);
  }

  // Save
  async function handleSave(e) {
    e.preventDefault();
    setFormSaving(true);
    setFormErrors({});
    setGlobalErr('');
    setFormSaved(false);

    const isNew = !editItem;
    const payload = buildPayload(fields, formVals, isNew);

    try {
      const url    = isNew ? apiBase : `${apiBase}/${editItem._id}`;
      const method = isNew ? 'POST' : 'PUT';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 401) { router.push('/admin/login'); return; }

      const data = await res.json();

      if (!res.ok) {
        if (data.details) {
          const errs = {};
          for (const { path, message } of data.details) { errs[path] = message; }
          setFormErrors(errs);
          setGlobalErr('Please fix the errors above.');
        } else {
          setGlobalErr(data.error || 'Save failed.');
        }
        return;
      }

      // Success
      setFormSaved(true);
      const savedSlug = getSlug(data);
      triggerRevalidate(type, savedSlug);

      if (isNew) {
        // Switch to editing the newly created item
        setEditItem(data);
        setFormVals(buildInitial(fields, data));
      } else {
        setEditItem(data);
        setFormVals(buildInitial(fields, data));
      }
    } catch {
      setGlobalErr('Network error — please try again.');
    } finally {
      setFormSaving(false);
    }
  }

  // Delete
  async function handleDelete(item) {
    if (!window.confirm(`Delete this ${single.toLowerCase()}? This cannot be undone.`)) return;
    setDeleting(item._id);
    try {
      const res = await fetch(`${apiBase}/${item._id}`, { method: 'DELETE' });
      if (res.status === 401) { router.push('/admin/login'); return; }
      if (res.ok) {
        const slug = getSlug(item);
        triggerRevalidate(type, slug);
        // If this was the last item on the page, go back one page
        const newTotal = total - 1;
        const maxPage  = Math.max(1, Math.ceil(newTotal / 10));
        if (page > maxPage) setPage(maxPage);
        else fetchList();
      }
    } catch { /* ignore */ } finally {
      setDeleting(null);
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div>
      {/* Form view */}
      {view === 'form' && (
        <div className={s.formPanel}>
          <h2 className={s.formTitle}>
            {editItem ? `Edit ${single}` : `Add ${single}`}
          </h2>

          {globalErr && <div className={s.apiError}>{globalErr}</div>}

          <form onSubmit={handleSave} noValidate>
            <div className={s.formGrid}>
              {fields.map((f, i) => (
                <div
                  key={f.key}
                  className={
                    f.type === 'image' || f.type === 'images' || f.type === 'textarea' || f.type === 'strings' || f.type === 'tags' || f.large
                      ? s.formGridFull
                      : undefined
                  }
                >
                  <Field
                    f={f}
                    vals={formVals}
                    onChange={handleChange}
                    errors={formErrors}
                    isNew={!editItem}
                    idx={i}
                  />
                </div>
              ))}
            </div>

            <div className={s.formActions}>
              <button
                type="submit"
                className={`${s.btn} ${s.btnPrimary}`}
                disabled={formSaving}
              >
                {formSaving ? 'Saving…' : `Save ${single}`}
              </button>
              <button
                type="button"
                className={`${s.btn} ${s.btnSecondary}`}
                onClick={closeForm}
              >
                ← Back to list
              </button>
              {formSaved && <span className={s.savedMsg}>✓ Saved!</span>}
            </div>
          </form>
        </div>
      )}

      {/* Toolbar */}
      <div className={s.toolbar}>
        <input
          type="search"
          placeholder={`Search ${label.toLowerCase()}…`}
          value={search}
          onChange={handleSearchChange}
          className={s.searchInput}
          aria-label={`Search ${label}`}
        />
        <select
          value={pubFilter}
          onChange={(e) => { setPubFilter(e.target.value); setPage(1); }}
          className={s.filterSelect}
          aria-label="Filter by status"
        >
          <option value="">All</option>
          <option value="true">Published</option>
          <option value="false">Draft</option>
        </select>
        <button
          className={`${s.btn} ${s.btnPrimary}`}
          onClick={() => openForm(null)}
        >
          + Add {single}
        </button>
      </div>

      {/* List */}
      {listLoading
        ? <p style={{ color: '#6b7280', padding: '20px 0' }}>Loading…</p>
        : items.length === 0
          ? <p style={{ color: '#6b7280', padding: '20px 0' }}>No {label.toLowerCase()} found.</p>
          : (
            <div className={s.resourceGrid}>
              {items.map((item) => {
                const thumb   = cardImage(item);
                const badges  = cardBadges(item);
                const slug    = getSlug(item);
                const isPublished = item.published !== false;

                return (
                  <div key={item._id} className={s.resourceCard}>
                    {/* Thumbnail */}
                    {thumb?.url
                      ? <img src={thumb.url} alt={thumb.alt || cardTitle(item)} className={s.resourceThumb} />
                      : <div className={s.thumbPlaceholder}>📄</div>
                    }

                    <div className={s.resourceBody}>
                      {/* Badges */}
                      {badges.length > 0 && (
                        <div className={s.badgeRow}>
                          {badges.map((b, i) => (
                            <span key={i} className={`${s.pill} ${s[b.style]}`}>{b.label}</span>
                          ))}
                        </div>
                      )}
                      <p className={s.resourceTitle}>{cardTitle(item)}</p>
                      {cardSub(item) && <p className={s.resourceSub}>{cardSub(item)}</p>}
                    </div>

                    <div className={s.resourceActions}>
                      <button
                        className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}
                        onClick={() => openForm(item)}
                      >
                        Edit
                      </button>
                      <button
                        className={`${s.btn} ${s.btnDanger} ${s.btnSm}`}
                        disabled={deleting === item._id}
                        onClick={() => handleDelete(item)}
                      >
                        {deleting === item._id ? '…' : 'Delete'}
                      </button>
                      {isPublished && slug && (
                        <a
                          href={`${viewBase}/${slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${s.btn} ${s.btnGhost} ${s.btnSm}`}
                        >
                          View ↗
                        </a>
                      )}
                      {isPublished && !slug && viewBase && (
                        <a
                          href={viewBase}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`${s.btn} ${s.btnGhost} ${s.btnSm}`}
                        >
                          View ↗
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )
      }

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={s.pagination}>
          <button
            className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Prev
          </button>
          <span>Page {page} of {totalPages} ({total} total)</span>
          <button
            className={`${s.btn} ${s.btnSecondary} ${s.btnSm}`}
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
