import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/v1/:path*',
          destination: 'http://localhost:8080/:path*',
        },
        {
          source: '/images/:path*',
          destination: 'http://localhost:8080/:path*',
        },
      ];
    }
    return [];
  },
  images: {
    remotePatterns: [

    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;