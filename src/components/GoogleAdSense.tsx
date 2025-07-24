'use client';

import Script from 'next/script';

const ADSENSE_PUBLISHER_ID = 'ca-pub-5809883478660758';

export default function GoogleAdSense() {
  return (
    <>
      <Script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <Script id="adsense-auto-ads" strategy="afterInteractive">
        {`
          (adsbygoogle = window.adsbygoogle || []).push({
            google_ad_client: "${ADSENSE_PUBLISHER_ID}",
            enable_page_level_ads: true
          });
        `}
      </Script>
    </>
  );
}

// 광고 유닛 컴포넌트들
interface AdUnitProps {
  slot: string;
  format?: string;
  responsive?: boolean;
  style?: React.CSSProperties;
  className?: string;
}

// 자동 광고 (반응형)
export function ResponsiveAd({ 
  slot, 
  className = "",
  style = { display: 'block' }
}: AdUnitProps) {
  return (
    <div className={`min-h-[100px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}

// 배너 광고 (고정 크기)
export function BannerAd({ 
  slot, 
  className = "",
  style = { display: 'inline-block', width: '728px', height: '90px' }
}: AdUnitProps) {
  return (
    <div className={`min-h-[90px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
      />
    </div>
  );
}

// 스퀘어 광고
export function SquareAd({ 
  slot, 
  className = "",
  style = { display: 'inline-block', width: '300px', height: '250px' }
}: AdUnitProps) {
  return (
    <div className={`min-h-[250px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
      />
    </div>
  );
}

// 수직 배너 광고
export function VerticalAd({ 
  slot, 
  className = "",
  style = { display: 'inline-block', width: '160px', height: '600px' }
}: AdUnitProps) {
  return (
    <div className={`min-h-[600px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
      />
    </div>
  );
}

// 모바일 배너 광고
export function MobileBannerAd({ 
  slot, 
  className = "",
  style = { display: 'inline-block', width: '320px', height: '50px' }
}: AdUnitProps) {
  return (
    <div className={`min-h-[50px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={style}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
      />
    </div>
  );
}

// 광고 초기화 함수
export const initializeAds = () => {
  if (typeof window !== 'undefined' && window.adsbygoogle) {
    try {
      window.adsbygoogle.push({});
    } catch (error) {
      console.error('AdSense 초기화 오류:', error);
    }
  }
};

// 타입 선언
declare global {
  interface Window {
    adsbygoogle: any[];
  }
}