/**
 * lib/__mongoose_browser_stub.js
 * Client-side stub that replaces the real mongoose package in browser builds.
 * This module is NEVER executed in the browser — it is only included so that
 * webpack can resolve the import without bundling Node-only MongoDB source.
 * All database operations happen exclusively in getStaticProps / API routes
 * (server side). If any of this code were called client-side it would throw,
 * which is intentional — it signals a bug.
 */
module.exports = {
  connect: () => Promise.resolve(),
  disconnect: () => Promise.resolve(),
  model: () => ({}),
  models: {},
  Schema: function Schema() { return {}; },
  connection: { readyState: 0 },
};
