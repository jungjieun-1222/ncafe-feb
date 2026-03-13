/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // 도커 환경변수가 있으면 쓰고, 없으면 로컬 8081을 사용해요.
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';
    // 에이전트 서버 주소 (도커 서비스 이름 사용)
    const agentUrl = 'http://agent-server:8000';

    return [
      {
        // 1. 이미지 처리
        source: '/api/images/:path*',
        destination: `${backendUrl}/images/:path*`,
      },
      {
        // 2. 업로드 파일 처리
        source: '/api/uploads/:path*',
        destination: `${backendUrl}/uploads/:path*`,
      },
      {
        // 3. 지식관리(RAG) 챗봇 처리
        source: '/api/agent/:path*',
        destination: `${agentUrl}/:path*`,
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