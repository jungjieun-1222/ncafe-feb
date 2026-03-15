/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // 도커 환경변수가 있으면 쓰고, 없으면 로컬 8081을 사용해요.
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';
    // 에이전트 서버 주소 (도커 서비스 이름 사용)
    const agentUrl = process.env.AGENT_URL || 'http://agent-server:8000';

    return [
      {
        // 모든 이미지 요청을 백엔드로 넘겨서 통합 서빙합니다.
        // 백엔드는 upload 폴더와 프론트엔드의 public/images(extra-static)를 모두 알고 있습니다.
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