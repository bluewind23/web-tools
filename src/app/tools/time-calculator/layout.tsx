import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '시간 계산기 - 시간 덧셈/뺄셈/변환 도구',
  description: '시간의 덧셈, 뺄셈, 변환을 쉽게 계산합니다. 시:분:초 형식으로 계산하고 다양한 단위로 변환할 수 있습니다.',
  keywords: ['시간계산', '시간변환', '시간덧셈', '시간뺄셈', '계산기', '시분초'],
  openGraph: {
    title: '시간 계산기 - 시간 덧셈/뺄셈 도구',
    description: '시간의 덧셈, 뺄셈, 변환을 쉽게 계산하세요. 시:분:초 형식으로 정확한 계산!',
    url: 'https://toolbox-online.netlify.app/tools/time-calculator',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/time-calculator.png',
        width: 1200,
        height: 630,
        alt: '시간 계산기 - 시간 덧셈/뺄셈 도구'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '시간 계산기 - 시간 덧셈/뺄셈 도구',
    description: '시간의 덧셈, 뺄셈, 변환을 쉽게 계산하세요.',
    images: ['https://toolbox-online.netlify.app/og-images/time-calculator.png'],
  },
};

export default function TimeCalculatorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}