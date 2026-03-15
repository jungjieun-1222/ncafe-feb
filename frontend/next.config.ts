/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // 도커 환경변수가 있으면 쓰고, 없으면 로컬 8081을 사용해요.
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';

    return [
      {
        // 공통적으로 사용하는 정적 이미지들은 프론트엔드가 직접 서빙하도록 리라이트에서 제외합니다.
        // 그 외의 이미지(메뉴 업로드 등)는 백엔드로 넘깁니다.
        source: '/images/:path((?!wolha\\.png|user_male\\.png|user_female\\.png|map\\.png|blank\\.png).*)',
        destination: `${backendUrl}/images/:path*`,
      },
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