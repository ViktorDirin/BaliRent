import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
      },
      {
        protocol: 'https',
        hostname: 'www.thespruce.com',
      },
      {
        protocol: 'https',
        hostname: 'www.travelandleisure.com',
      },
    ],
  },
};

export default nextConfig;
