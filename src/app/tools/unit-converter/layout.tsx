import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '단위 변환기 - 길이/무게/온도/부피 변환 도구',
  description: '다양한 단위를 쉽게 변환합니다. 길이, 무게, 온도, 부피, 면적, 속도 등의 단위를 실시간으로 변환할 수 있습니다.',
  keywords: ['단위변환', '길이변환', '무게변환', '온도변환', '부피변환', '변환기'],
  openGraph: {
    title: '단위 변환기 - 다양한 단위 변환 도구',
    description: '길이, 무게, 온도, 부피 등 다양한 단위를 쉽게 변환하세요. 실시간 변환 결과 제공!',
    url: 'https://toolbox-online.netlify.app/tools/unit-converter',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/unit-converter.png',
        width: 1200,
        height: 630,
        alt: '단위 변환기 - 다양한 단위 변환 도구'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '단위 변환기 - 다양한 단위 변환 도구',
    description: '길이, 무게, 온도, 부피 등 다양한 단위를 쉽게 변환하세요.',
    images: ['https://toolbox-online.netlify.app/og-images/unit-converter.png'],
  },
};

export default function UnitConverterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}