import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Base64 인코더/디코더 - 텍스트 및 이미지 변환',
  description: '텍스트와 이미지를 Base64로 인코딩/디코딩합니다. 한글 지원, 파일 업로드, 다운로드 기능을 제공합니다.',
  keywords: ['Base64', '인코딩', '디코딩', '변환', '텍스트변환', '이미지변환'],
  openGraph: {
    title: 'Base64 변환기 - 텍스트/이미지 인코딩',
    description: '텍스트와 이미지를 Base64로 쉽게 변환하세요. 한글 지원, 이미지 자동 감지 기능 포함!',
    url: 'https://toolbox-online.netlify.app/tools/base64-converter',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/base64-converter.png',
        width: 1200,
        height: 630,
        alt: 'Base64 변환기 - 텍스트/이미지 인코딩'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Base64 변환기 - 텍스트/이미지 인코딩',
    description: '텍스트와 이미지를 Base64로 쉽게 변환하세요.',
    images: ['https://toolbox-online.netlify.app/og-images/base64-converter.png'],
  },
};

export default function Base64ConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}