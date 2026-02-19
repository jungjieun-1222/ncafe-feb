/** @type {import('next').NextConfig} */
// import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8012';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/images/:path*',
        destination: `${backendUrl}/:path*`,
      },
      {
        source: '/upload/:path*', // Adding upload path just in case, based on static resources config
        destination: `${backendUrl}/upload/:path*`,
      }
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true,
    dangerouslyAllowSVG: true,
  },
};

export default nextConfig;