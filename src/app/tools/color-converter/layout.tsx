import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '컬러 컨버터 - HEX, RGB, HSL, CMYK 색상 변환',
  description: 'HEX, RGB, HSL, CMYK 색상 코드를 실시간으로 변환합니다. PANTONE 색상 매칭, 색상 팔레트, 컬러 피커를 제공합니다.',
  keywords: ['컬러', '색상', 'HEX', 'RGB', 'HSL', 'CMYK', 'PANTONE', '색상변환'],
  openGraph: {
    title: '컬러 컨버터 - 색상 코드 변환기',
    description: 'HEX, RGB, HSL, CMYK 색상 코드를 실시간으로 변환합니다. PANTONE 색상 매칭과 컬러 피커 지원!',
    url: 'https://toolbox-online.netlify.app/tools/color-converter',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/color-converter.png',
        width: 1200,
        height: 630,
        alt: '컬러 컨버터 - 색상 코드 변환기'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '컬러 컨버터 - 색상 코드 변환기',
    description: 'HEX, RGB, HSL, CMYK 색상 코드를 실시간으로 변환합니다.',
    images: ['https://toolbox-online.netlify.app/og-images/color-converter.png'],
  },
};

export default function ColorConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}