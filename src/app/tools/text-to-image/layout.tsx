import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '텍스트를 이미지로 - 텍스트 이미지 생성기',
  description: '텍스트를 이미지로 변환합니다. 커스텀 폰트, 색상, 배경, 정렬 옵션을 제공하며 PNG/JPEG 포맷으로 다운로드할 수 있습니다.',
  keywords: ['텍스트이미지', '텍스트변환', '이미지생성', '폰트', '캘리그래피', '텍스트디자인'],
  openGraph: {
    title: '텍스트를 이미지로 - 무료 텍스트 이미지 생성기',
    description: '텍스트를 아름다운 이미지로 변환하세요. 다양한 폰트, 색상, 스타일 옵션으로 커스터마이징!',
    url: 'https://toolbox-online.netlify.app/tools/text-to-image',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/text-to-image.png',
        width: 1200,
        height: 630,
        alt: '텍스트를 이미지로 - 무료 텍스트 이미지 생성기'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '텍스트를 이미지로 - 무료 텍스트 이미지 생성기',
    description: '텍스트를 아름다운 이미지로 변환하세요. 다양한 폰트와 스타일 옵션 제공!',
    images: ['https://toolbox-online.netlify.app/og-images/text-to-image.png'],
  },
};

export default function TextToImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}