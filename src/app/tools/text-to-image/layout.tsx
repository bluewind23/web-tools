import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '텍스트를 이미지로 - 텍스트 이미지 생성기',
  description: '텍스트를 이미지로 변환합니다. 커스텀 폰트, 색상, 배경, 정렬 옵션을 제공하며 PNG/JPEG 포맷으로 다운로드할 수 있습니다.',
  keywords: ['텍스트이미지', '텍스트변환', '이미지생성', '폰트', '캘리그래피', '텍스트디자인'],
};

export default function TextToImageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}