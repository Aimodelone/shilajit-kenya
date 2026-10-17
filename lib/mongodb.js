import mongoose from 'mongoose';

// Cache the connection promise on the global object so Next.js dev hot-reload
// doesn't open a new connection on every module re-evaluation.
let cached = global._mongooseCache;

if (!cached) {
  cached = global._mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase() {
  // Read the URI inside the function — never at module top-level — so
  // `next build` succeeds even when env vars are not set.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not defined. Add it to .env.local before starting the server.'
    );
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, {
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance)
      .catch((err) => {
        // Clear the cached promise so the next call can retry the connection
        // rather than permanently re-throwing the same rejected promise.
        cached.promise = null;
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
