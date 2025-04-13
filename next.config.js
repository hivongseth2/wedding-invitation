/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com', 'media-api.xogrp.com', 'freepik.com', 'metricleo.com', 'i.pinimg.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Giữ cấu hình snapshot hiện có
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [],
    };

    // Bỏ qua react-native-fs để tránh lỗi Module not found
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'react-native-fs': false,
    };

    return config;
  },
};

module.exports = nextConfig;