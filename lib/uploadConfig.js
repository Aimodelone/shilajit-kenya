/**
 * lib/uploadConfig.js — ES module
 * Shared constants for the Cloudinary signed-upload flow.
 */

/**
 * UPLOAD_FOLDERS
 * Maps section keys (sent by the browser) to Cloudinary folder paths.
 * The browser always sends the KEY, never the folder path.
 */
export const UPLOAD_FOLDERS = {
  products:     'shilajit-kenya/products',
  benefits:     'shilajit-kenya/benefits',
  blog:         'shilajit-kenya/blog',
  testimonials: 'shilajit-kenya/testimonials',
  site:         'shilajit-kenya/site',
};

/**
 * ALLOWED_FORMATS
 * Comma-separated list of file extensions Cloudinary will accept.
 * Bound into the signature so the browser cannot change it.
 */
export const ALLOWED_FORMATS = 'jpg,jpeg,png,webp';
