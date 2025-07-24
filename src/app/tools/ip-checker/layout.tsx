import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'IP 주소 조회기 - 내 IP 확인 및 위치 정보',
  description: '현재 IP 주소를 확인하고 위치 정보, ISP, 시간대 등을 조회합니다. 다른 IP 주소의 정보도 조회할 수 있습니다.',
  keywords: ['IP주소', 'IP확인', '위치정보', 'ISP', '네트워크', '인터넷주소'],
  openGraph: {
    title: 'IP 주소 조회기 - 무료 IP 확인 도구',
    description: '현재 IP 주소를 확인하고 위치 정보, ISP를 조회하세요. 사설 IP 구분 기능 포함!',
    url: 'https://toolbox-online.netlify.app/tools/ip-checker',
    type: 'website',
    images: [
      {
        url: 'https://toolbox-online.netlify.app/og-images/ip-checker.png',
        width: 1200,
        height: 630,
        alt: 'IP 주소 조회기 - 무료 IP 확인 도구'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'IP 주소 조회기 - 무료 IP 확인 도구',
    description: '현재 IP 주소를 확인하고 위치 정보, ISP를 조회하세요.',
    images: ['https://toolbox-online.netlify.app/og-images/ip-checker.png'],
  },
};

export default function IPCheckerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}