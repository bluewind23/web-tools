import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'GIF 제작 툴 - 이미지/동영상을 GIF로 변환',
  description: '여러 이미지나 동영상을 업로드해 고품질 GIF 애니메이션으로 변환하세요. 크기 최적화, FPS 조절, 투명 배경 등 다양한 옵션을 제공합니다.',
  keywords: ['GIF', '움짤', '애니메이션', '이미지변환', '동영상변환', 'GIF제작'],
  openGraph: {
    title: 'GIF 메이커 - 원하는 움짤을 만들어요!',
    description: '간단한 설정으로 GIF를 만들 수 있는 도구입니다. 투명, 불투명, 프레임 설정 등 다양한 옵션 지원!',
    url: 'https://toolbox-online.netlify.app/tools/gif-maker',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/gif-maker.png',
        width: 1200,
        height: 630,
        alt: 'GIF 메이커 - 원하는 움짤을 만들어요!'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GIF 메이커 - 원하는 움짤을 만들어요!',
    description: '간단한 설정으로 GIF를 만들 수 있는 도구입니다.',
    images: ['https://toolbox-online.netlify.app/og-images/gif-maker.png'],
  },
};

export default function GifMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}