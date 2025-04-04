/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ['images.unsplash.com', 'via.placeholder.com'],
    },
    output: 'standalone',

    reactStrictMode: true,
    swcMinify: true,
    eslint: {
      ignoreDuringBuilds: true,
    },
  }
  
  module.exports = nextConfig;
  