import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'HTML 편집기 - 실시간 HTML 미리보기',
  description: 'HTML 코드를 실시간으로 편집하고 미리보기할 수 있습니다. 모바일/PC 반응형 테스트를 지원합니다.',
  keywords: ['HTML', '편집기', '미리보기', '코드편집', '웹개발', '반응형테스트'],
  openGraph: {
    title: 'HTML 편집기 - 실시간 웹 코드 에디터',
    description: 'HTML 코드를 실시간으로 편집하고 미리보기하세요. 모바일/PC 반응형 테스트 지원!',
    url: 'https://toolbox-online.netlify.app/tools/html-preview',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/html-preview.png',
        width: 1200,
        height: 630,
        alt: 'HTML 편집기 - 실시간 웹 코드 에디터'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HTML 편집기 - 실시간 웹 코드 에디터',
    description: 'HTML 코드를 실시간으로 편집하고 미리보기하세요.',
    images: ['https://toolbox-online.netlify.app/og-images/html-preview.png'],
  },
};

export default function HtmlPreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}