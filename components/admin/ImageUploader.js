/**
 * components/admin/ImageUploader.js
 * Props:
 *   value    { url: string, alt: string } | null
 *   onChange ({ url, alt }) => void
 *   section  string  — Cloudinary upload section
 *   id       string  — unique id for the file input (for labels)
 */
import { useState, useRef } from 'react';
import s from '../../styles/Admin.module.css';

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_INPUT_BYTES = 15 * 1024 * 1024;  // 15 MB
const MAX_OUTPUT_BYTES = 9 * 1024 * 1024;  // 9 MB
const MAX_SIDE = 1600;

async function resizeToWebp(file) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    const blobUrl = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      let w = img.naturalWidth;
      let h = img.naturalHeight;

      // Only downscale, never upscale
      if (w > MAX_SIDE || h > MAX_SIDE) {
        if (w >= h) { h = Math.round((h * MAX_SIDE) / w); w = MAX_SIDE; }
        else        { w = Math.round((w * MAX_SIDE) / h); h = MAX_SIDE; }
      }

      const canvas = document.createElement('canvas');
      canvas.width  = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);

      canvas.toBlob(
        (blob) => blob ? resolve(blob) : reject(new Error('toBlob returned null')),
        'image/webp',
        0.85
      );
    };
    img.onerror = () => { URL.revokeObjectURL(blobUrl); reject(new Error('Image load failed')); };
    img.src = blobUrl;
  });
}

export default function ImageUploader({ value, onChange, section, id = 'img-upload' }) {
  const [uploading, setUploading] = useState(false);
  const [error,     setError]     = useState('');
  const [altText,   setAltText]   = useState(value?.alt || '');
  const fileRef = useRef(null);

  async function handleFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');

    if (!ACCEPTED.includes(file.type)) {
      setError('Only JPEG, PNG, or WebP images are accepted.');
      e.target.value = '';
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError('File is too large (max 15 MB).');
      e.target.value = '';
      return;
    }

    setUploading(true);
    try {
      // 1. Resize / convert to webp
      let blob;
      try {
        blob = await resizeToWebp(file);
      } catch {
        // Canvas failed — fall back to original file
        blob = file;
      }

      if (blob.size > MAX_OUTPUT_BYTES) {
        setError('Processed image exceeds 9 MB — please use a smaller source image.');
        setUploading(false);
        e.target.value = '';
        return;
      }

      // 2. Get upload signature
      const sigRes = await fetch('/api/admin/upload-signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section }),
      });
      if (sigRes.status === 401) { window.location.href = '/admin/login'; return; }
      if (!sigRes.ok) throw new Error('Could not get upload signature');
      const { uploadUrl, fields } = await sigRes.json();

      // 3. POST to Cloudinary (do NOT set Content-Type — browser sets multipart boundary)
      const form = new FormData();
      Object.entries(fields).forEach(([k, v]) => form.append(k, v));
      form.append('file', blob, 'upload.webp');

      const uploadRes = await fetch(uploadUrl, { method: 'POST', body: form });
      if (!uploadRes.ok) throw new Error('Cloudinary upload failed');
      const uploadData = await uploadRes.json();

      const newAlt = altText || '';
      onChange({ url: uploadData.secure_url, alt: newAlt });
    } catch (err) {
      setError(err.message || 'Upload failed — please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  function handleAltChange(e) {
    const newAlt = e.target.value;
    setAltText(newAlt);
    if (value?.url) {
      onChange({ url: value.url, alt: newAlt });
    }
  }

  return (
    <div className={s.imgUploader}>
      {/* Preview */}
      {value?.url ? (
        <img src={value.url} alt={value.alt || 'Preview'} className={s.imgPreview} />
      ) : (
        <div className={s.imgPlaceholder}>No image selected</div>
      )}

      {/* File picker */}
      <input
        ref={fileRef}
        id={id}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        onChange={handleFile}
        disabled={uploading}
        style={{ fontSize: 13 }}
      />

      {uploading && <span className={s.uploading}>Uploading…</span>}
      {error     && <span className={s.uploadErr}>{error}</span>}

      {/* Alt text */}
      <label htmlFor={`${id}-alt`} className={s.label} style={{ marginTop: 4 }}>
        Alt text{' '}
        <span className={s.labelHint}>(describe the image; it helps Google)</span>
      </label>
      <input
        id={`${id}-alt`}
        type="text"
        value={altText}
        onChange={handleAltChange}
        placeholder="e.g. Shilajit resin jar on a wooden surface"
        className={s.input}
        maxLength={200}
      />
    </div>
  );
}
