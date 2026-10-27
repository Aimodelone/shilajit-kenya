/**
 * lib/cloudinary.js — ES module
 * Returns a configured Cloudinary v2 SDK instance.
 *
 * Env vars are read INSIDE the function, never at module top level,
 * so builds never fail when the values are absent.
 */

import { v2 as cloudinary } from 'cloudinary';

/**
 * getCloudinary()
 * Reads CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET
 * from process.env, validates they are present, configures the SDK and returns it.
 *
 * @returns {typeof cloudinary} configured Cloudinary v2 instance
 * @throws {Error} if any env var is missing (message = the missing key name only)
 */
export function getCloudinary() {
  const cloud_name  = process.env.CLOUDINARY_CLOUD_NAME;
  const api_key     = process.env.CLOUDINARY_API_KEY;
  const api_secret  = process.env.CLOUDINARY_API_SECRET;

  if (!cloud_name)  throw new Error('CLOUDINARY_CLOUD_NAME');
  if (!api_key)     throw new Error('CLOUDINARY_API_KEY');
  if (!api_secret)  throw new Error('CLOUDINARY_API_SECRET');

  cloudinary.config({ cloud_name, api_key, api_secret, secure: true });
  return cloudinary;
}
