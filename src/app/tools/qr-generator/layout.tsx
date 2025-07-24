import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'QR 코드 생성기 - 텍스트/URL을 QR 코드로 변환',
  description: '텍스트나 URL을 QR 코드로 변환합니다. 커스텀 색상, 크기 조절, SVG/PNG 다운로드를 지원합니다.',
  keywords: ['QR코드', 'QR', '큐알코드', '바코드', 'URL변환', '텍스트변환'],
  openGraph: {
    title: 'QR 코드 생성기 - 무료 큐알코드 만들기',
    description: '텍스트/URL을 QR 코드로 변환하세요. 커스텀 색상, 크기 조절, SVG/PNG 다운로드 지원!',
    url: 'https://toolbox-online.netlify.app/tools/qr-generator',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/qr-generator.png',
        width: 1200,
        height: 630,
        alt: 'QR 코드 생성기 - 무료 큐알코드 만들기'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QR 코드 생성기 - 무료 큐알코드 만들기',
    description: '텍스트/URL을 QR 코드로 변환하세요. 커스텀 색상, 크기 조절 지원!',
    images: ['https://toolbox-online.netlify.app/og-images/qr-generator.png'],
  },
};

export default function QRGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}