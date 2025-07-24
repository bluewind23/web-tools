import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '컬러 컨버터 - HEX, RGB, HSL, CMYK 색상 변환',
  description: 'HEX, RGB, HSL, CMYK 색상 코드를 실시간으로 변환합니다. PANTONE 색상 매칭, 색상 팔레트, 컬러 피커를 제공합니다.',
  keywords: ['컬러', '색상', 'HEX', 'RGB', 'HSL', 'CMYK', 'PANTONE', '색상변환'],
};

export default function ColorConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}