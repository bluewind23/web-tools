import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export',  // 정적 익스포트로 설정
  trailingSlash: true,  // URL 끝에 슬래시 추가
  images: {
    unoptimized: true,  // 정적 익스포트에서는 이미지 최적화 비활성화
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'twemoji.maxcdn.com',
      },
    ],
  },
};

export default nextConfig;