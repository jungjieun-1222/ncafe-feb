/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // 도커 환경변수가 있으면 쓰고, 없으면 로컬 8081을 사용해요.
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';

    return [
      {
        // 모든 이미지 요청(/images/...)을 백엔드로 넘겨서 통합 서빙합니다.
        // 백엔드는 업로드 폴더와 정적 이미지 폴더를 모두 알고 있습니다.
        source: '/images/:path*',
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