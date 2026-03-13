/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // 도커 환경변수가 있으면 쓰고, 없으면 로컬 8081을 사용해요.
    const backendUrl = process.env.BACKEND_URL || 'http://mochijj-backend:8081';
    // 에이전트 서버 주소 (도커 서비스 이름 사용)
    const agentUrl = 'http://agent-server:8000';

    return [
      {
        // 브라우저에서 <img src="/images/..." /> 라고 부를 때 동작
        source: '/images/:path*',
        destination: `${backendUrl}/images/:path*`,
      },
      {
        // 만약 코드에서 /api/images/... 라고 부르고 있다면 이것도 필요합니다.
        source: '/api/images/:path*',
        destination: `${backendUrl}/images/:path*`,
      },
      {
        // 메뉴 데이터 등 일반 API 처리
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        // 3. 지식관리(RAG) 챗봇 처리
        source: '/api/agent/:path*',
        destination: `${agentUrl}/:path*`,
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