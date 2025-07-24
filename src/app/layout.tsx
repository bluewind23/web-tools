import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Noto_Sans_KR, Nanum_Gothic, Montserrat, Lato } from "next/font/google";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import GoogleAdSense from "@/components/GoogleAdSense";
import "./globals.css";

// --- 자바스크립트 로직 부분 (여기서 폰트와 메타데이터를 정의합니다) ---
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-sans-kr',
});

const nanumGothic = Nanum_Gothic({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-nanum-gothic',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

const lato = Lato({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-lato',
});

export const metadata: Metadata = {
  title: {
    default: "WebTools - 무료 웹 도구 모음",
    template: "%s | WebTools"
  },
  description: "일상에서 유용한 웹 도구들을 무료로 제공합니다. 글자 수 세기, GIF 제작, QR 코드 생성, Base64 변환, 컬러 변환, 단위 변환 등 다양한 유틸리티를 만나보세요.",
  keywords: ["웹도구", "무료도구", "유틸리티", "글자수세기", "QR코드", "Base64", "컬러변환", "시간계산", "GIF제작", "HTML편집기", "IP확인", "단위변환", "이모지", "텍스트이미지"],
  authors: [{ name: "WebTools" }],
  creator: "WebTools",
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://toolbox-online.netlify.app",
    siteName: "WebTools",
    title: "WebTools - 무료 웹 도구 모음",
    description: "일상에서 유용한 웹 도구들을 무료로 제공합니다. 설치 없이 바로 사용 가능한 온라인 유틸리티입니다.",
    images: [
      {
        url: "https://toolbox-online.netlify.app/og-images/webtools-main.png",
        width: 1200,
        height: 630,
        alt: "WebTools - 무료 웹 도구 모음"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WebTools - 무료 웹 도구 모음",
    description: "일상에서 유용한 웹 도구들을 무료로 제공합니다.",
    images: ["https://toolbox-online.netlify.app/og-images/webtools-main.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


// --- React 컴포넌트 부분 (여기서 화면의 구조를 정의합니다) ---
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <GoogleAnalytics />
        <GoogleAdSense />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansKr.variable} ${nanumGothic.variable} ${montserrat.variable} ${lato.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}