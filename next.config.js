/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [],
    };
    return config;
  }
};

module.exports = nextConfig;
