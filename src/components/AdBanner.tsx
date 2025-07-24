'use client';

import { useEffect, useRef } from 'react';

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5809883478660758';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export default function AdBanner({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '',
  style = {}
}: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // 개발 환경에서는 광고 로드 시도하지 않음
    if (process.env.NODE_ENV === 'development') return;
    
    const loadAd = () => {
      if (isLoaded.current) return;
      
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
          // 광고가 이미 초기화되었는지 확인
          const adElement = adRef.current;
          if (adElement && !adElement.getAttribute('data-adsbygoogle-status')) {
            window.adsbygoogle.push({});
            isLoaded.current = true;
          }
        }
      } catch (error) {
        console.error('AdSense 로딩 오류:', error);
      }
    };

    // 컴포넌트가 마운트된 후 광고 로드
    const timer = setTimeout(loadAd, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 개발 환경에서는 플레이스홀더 표시
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[100px] ${className}`}>
        <div className="text-gray-500 text-sm">
          <div className="text-xs mb-1">📢 광고 영역</div>
          <div className="text-xs opacity-60">AdSense Client: {ADSENSE_PUBLISHER_ID}</div>
          <div className="text-xs opacity-60">Slot: {slot}</div>
          <div className="text-xs opacity-60">Format: {format}</div>
          {responsive && <div className="text-xs opacity-60">Responsive: Yes</div>}
        </div>
      </div>
    );
  }

  const defaultStyle = {
    display: 'block',
    ...style
  };

  return (
    <div className={`ad-container min-h-[100px] ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={defaultStyle}
        data-ad-client={ADSENSE_PUBLISHER_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}


// 광고 슬롯 ID들 - 환경 변수에서 가져오거나 기본값 사용
export const AdSlots = {
  HEADER_BANNER: process.env.NEXT_PUBLIC_AD_SLOT_HEADER || '1234567890',
  CONTENT_TOP: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT_TOP || '1234567891',
  CONTENT_BOTTOM: process.env.NEXT_PUBLIC_AD_SLOT_CONTENT_BOTTOM || '1234567892',
  SIDEBAR: process.env.NEXT_PUBLIC_AD_SLOT_SIDEBAR || '1234567893',
  TOOL_RESULT: process.env.NEXT_PUBLIC_AD_SLOT_TOOL_RESULT || '1234567894',
  FOOTER_BANNER: process.env.NEXT_PUBLIC_AD_SLOT_FOOTER || '1234567895',
  MOBILE_BANNER: process.env.NEXT_PUBLIC_AD_SLOT_MOBILE || '1234567896'
} as const;

// 광고 배치를 위한 헬퍼 컴포넌트들
export function HeaderAd() {
  return (
    <AdBanner 
      slot={AdSlots.HEADER_BANNER}
      format="horizontal"
      className="w-full max-w-4xl mx-auto mb-4 min-h-[90px]"
    />
  );
}

export function ContentTopAd() {
  return (
    <AdBanner 
      slot={AdSlots.CONTENT_TOP}
      format="rectangle"
      className="w-full max-w-md mx-auto mb-6 min-h-[250px]"
    />
  );
}

export function ContentBottomAd() {
  return (
    <AdBanner 
      slot={AdSlots.CONTENT_BOTTOM}
      format="rectangle"
      className="w-full max-w-md mx-auto mt-6 min-h-[250px]"
    />
  );
}

export function ToolResultAd() {
  return (
    <AdBanner 
      slot={AdSlots.TOOL_RESULT}
      format="auto"
      className="w-full max-w-lg mx-auto my-4 min-h-[120px]"
    />
  );
}

export function SidebarAd() {
  return (
    <AdBanner 
      slot={AdSlots.SIDEBAR}
      format="vertical"
      className="w-full max-w-xs min-h-[600px]"
    />
  );
}

export function MobileAd() {
  return (
    <div className="block md:hidden">
      <AdBanner 
        slot={AdSlots.MOBILE_BANNER}
        format="auto"
        className="w-full mx-auto my-4 min-h-[100px]"
      />
    </div>
  );
}