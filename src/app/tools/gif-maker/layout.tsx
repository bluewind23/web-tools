import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'GIF 제작 툴 - 이미지/동영상을 GIF로 변환',
  description: '여러 이미지나 동영상을 업로드해 고품질 GIF 애니메이션으로 변환하세요. 크기 최적화, FPS 조절, 투명 배경 등 다양한 옵션을 제공합니다.',
  keywords: ['GIF', '움짤', '애니메이션', '이미지변환', '동영상변환', 'GIF제작'],
};

export default function GifMakerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}