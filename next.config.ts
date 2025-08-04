import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: 'export', // 이 라인을 삭제 또는 주석 처리
  // trailingSlash: true, // 필요 없다면 삭제
  images: {
    // unoptimized: true, // 필요 없다면 삭제
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'twemoji.maxcdn.com',
      },
    ],
  },
};

export default nextConfig;