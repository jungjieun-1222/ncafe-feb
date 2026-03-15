/** @type {import('next').NextConfig} */

const nextConfig = {
  output: 'standalone',
  async rewrites() {
    // 도커 환경변수가 있으면 쓰고, 없으면 로컬 8081을 사용해요.
    //const backendUrl = process.env.BACKEND_URL || 'http://localhost:8081';
    // 에이전트 서버 주소 (도커 서비스 이름 사용)
    //const agentUrl = process.env.AGENT_URL || 'http://agent-server:8000';

    return [
      // 정적 이미지(/images/...) 리라이트를 제거하여 Next.js public/images 가 직접 서빙되게 합니다.
      // 메뉴 이미지(/api/images/...)는 [ ...path ]/route.ts 에서 처리합니다.
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