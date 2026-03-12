import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
      },
      {
        protocol: 'https',
        hostname: 'contents.mediadecathlon.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'https',
        hostname: 'www.fitmarket.it',
      },
      {
        protocol: 'https',
        hostname: 'image.uniqlo.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.media.amplience.net',
      },
    ],
  },
};

export default nextConfig;
