'use client';

const ADSENSE_PUBLISHER_ID = 'ca-pub-5809883478660758';

export default function GoogleAdSense() {
  return (
    <>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
        crossOrigin="anonymous"
      />
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            // 중복 실행 방지
            if (!window.adsensePageLevelAdsInitialized) {
              (adsbygoogle = window.adsbygoogle || []).push({
                google_ad_client: "${ADSENSE_PUBLISHER_ID}",
                enable_page_level_ads: true
              });
              window.adsensePageLevelAdsInitialized = true;
            }
          `
        }}
      />
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
  if (typeof window !== 'undefined') {
    try {
      // adsbygoogle 배열이 존재하는지 확인
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense 초기화 오류:', error);
    }
  }
};

// 타입 선언
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
    adsensePageLevelAdsInitialized?: boolean;
  }
}