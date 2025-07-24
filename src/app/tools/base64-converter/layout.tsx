import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Base64 인코더/디코더 - 텍스트 및 이미지 변환',
  description: '텍스트와 이미지를 Base64로 인코딩/디코딩합니다. 한글 지원, 파일 업로드, 다운로드 기능을 제공합니다.',
  keywords: ['Base64', '인코딩', '디코딩', '변환', '텍스트변환', '이미지변환'],
};

export default function Base64ConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}