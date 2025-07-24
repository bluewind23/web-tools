import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'HTML 편집기 - 실시간 HTML 미리보기',
  description: 'HTML 코드를 실시간으로 편집하고 미리보기할 수 있습니다. 모바일/PC 반응형 테스트를 지원합니다.',
  keywords: ['HTML', '편집기', '미리보기', '코드편집', '웹개발', '반응형테스트'],
};

export default function HtmlPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}