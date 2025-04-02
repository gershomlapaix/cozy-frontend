/** @type {import('next').NextConfig} */
const nextConfig = {
  // ignore TypeScript errors during build
  typescript: {
    ignoreBuildErrors: true,
  },
  // ignore ESLint errors during build
  eslint: {
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.pixabay.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      }
    ],
  },
  env: {
    API_URL: process.env.API_URL || 'https://cozy-backend-fmzo.onrender.com/api/v1',
  },
};

module.exports = nextConfig;