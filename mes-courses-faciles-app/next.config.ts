import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['@base-ui/react'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      }
    ],
  },
  /* config options here */
};

export default nextConfig;
