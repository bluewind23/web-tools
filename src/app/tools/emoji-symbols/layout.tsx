import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '이모지 심볼 - 다양한 이모지와 특수문자 모음',
  description: '다양한 카테고리의 이모지와 특수문자를 쉽게 복사하여 사용하세요. 얼굴, 동물, 음식, 심볼 등 1000개 이상의 이모지를 제공합니다.',
  keywords: ['이모지', '특수문자', '심볼', '아이콘', '문자', '복사'],
  openGraph: {
    title: '이모지 심볼 - 다양한 이모지 복사하기',
    description: '다양한 카테고리의 이모지와 특수문자를 쉽게 복사하여 사용하세요. 1000개 이상의 이모지 제공!',
    url: 'https://toolbox-online.netlify.app/tools/emoji-symbols',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/emoji-symbols.png',
        width: 1200,
        height: 630,
        alt: '이모지 심볼 - 다양한 이모지 복사하기'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '이모지 심볼 - 다양한 이모지 복사하기',
    description: '다양한 카테고리의 이모지와 특수문자를 쉽게 복사하여 사용하세요.',
    images: ['https://toolbox-online.netlify.app/og-images/emoji-symbols.png'],
  },
};

export default function EmojiSymbolsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}