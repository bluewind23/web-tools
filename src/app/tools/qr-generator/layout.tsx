import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'QR 코드 생성기 - 텍스트/URL을 QR 코드로 변환',
  description: '텍스트나 URL을 QR 코드로 변환합니다. 커스텀 색상, 크기 조절, SVG/PNG 다운로드를 지원합니다.',
  keywords: ['QR코드', 'QR', '큐알코드', '바코드', 'URL변환', '텍스트변환'],
};

export default function QRGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}