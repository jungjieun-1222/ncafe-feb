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
        // 백엔드 API 프록시 (설정 등)
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`,
      },
      {
        // 브라우저에서 <img src="/images/..." /> 라고 부를 때 동작
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