/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    const backendOrigin = process.env.API_BACKEND_ORIGIN || 'http://127.0.0.1:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backendOrigin.replace(/\/$/, '')}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
