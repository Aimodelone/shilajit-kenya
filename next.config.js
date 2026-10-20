/** @type {import('next').NextConfig} */
const path = require('path');
const nextConfig = {
  reactStrictMode: true,

  // In client (browser) builds, alias the entire `mongoose` package to an
  // empty stub.  This prevents webpack from trying to parse MongoDB's Node-only
  // source (net, tls, timers/promises, async_hooks, etc.) — none of which
  // exist in a browser environment.
  //
  // Why this is safe: all mongoose usage lives inside getStaticProps / API
  // routes, which run exclusively server-side.  Next.js strips getStaticProps
  // from client bundles at the function level, but it still sees the top-level
  // `import` statements that reach into mongoose.  The stub gives webpack
  // something to bundle without pulling in Node built-ins.
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        mongoose: path.resolve(__dirname, 'lib/__mongoose_browser_stub.js'),
      };
    }
    return config;
  },
  poweredByHeader: false,

  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },

  async redirects() {
    return [
      // Deleted home variants → homepage
      { source: '/home',   destination: '/', permanent: true },
      { source: '/home2',  destination: '/', permanent: true },
      { source: '/home3',  destination: '/', permanent: true },
      { source: '/home4',  destination: '/', permanent: true },

      // Deleted campaign pages → homepage
      { source: '/campaign',              destination: '/', permanent: true },
      { source: '/campaign-2',            destination: '/', permanent: true },
      { source: '/campaign-3',            destination: '/', permanent: true },
      { source: '/campaign-single/:slug', destination: '/', permanent: true },

      // Deleted misc pages → homepage
      { source: '/donate',          destination: '/', permanent: true },
      { source: '/volunteer',       destination: '/', permanent: true },
      { source: '/login',           destination: '/', permanent: true },
      { source: '/register',        destination: '/', permanent: true },
      { source: '/forgot-password', destination: '/', permanent: true },

      // Deleted gallery page → homepage
      { source: '/gallery', destination: '/', permanent: true },

      // Deleted blog layout variants → canonical blog routes
      { source: '/blog-fullwidth',                   destination: '/blog',             permanent: true },
      { source: '/blog-left-sidebar',                destination: '/blog',             permanent: true },
      { source: '/blog-single-fullwidth/:slug',      destination: '/blog-single/:slug', permanent: true },
      { source: '/blog-single-left-sidebar/:slug',   destination: '/blog-single/:slug', permanent: true },

      // E-commerce / team pages → new /products routes
      { source: '/team',                                           destination: '/products',                          permanent: true },
      { source: '/shop',                                           destination: '/products',                          permanent: true },
      { source: '/team-single/Esther-Howard',                      destination: '/products/shilajit-resin',           permanent: true },
      { source: '/team-single/Guy-Hawkins',                        destination: '/products/shilajit-capsules',        permanent: true },
      { source: '/team-single/Robert-Fox',                         destination: '/products/shilajit-gummies',         permanent: true },
      { source: '/team-single/Devon-Lane',                         destination: '/products/shilajit-8-in-1-capsules', permanent: true },
      { source: '/team-single/:slug',                              destination: '/products',                          permanent: true },
      { source: '/product-single/:slug',                           destination: '/products',                          permanent: true },
      { source: '/cart',                                           destination: '/products',                          permanent: true },
      { source: '/checkout',                                       destination: '/products',                          permanent: true },
      { source: '/order-received',                                 destination: '/products',                          permanent: true },
    ];
  },
};

module.exports = nextConfig;
