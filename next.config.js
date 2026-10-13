/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

      // Deleted blog layout variants → canonical blog routes
      { source: '/blog-fullwidth',                   destination: '/blog',             permanent: true },
      { source: '/blog-left-sidebar',                destination: '/blog',             permanent: true },
      { source: '/blog-single-fullwidth/:slug',      destination: '/blog-single/:slug', permanent: true },
      { source: '/blog-single-left-sidebar/:slug',   destination: '/blog-single/:slug', permanent: true },
    ];
  },
};

module.exports = nextConfig;
