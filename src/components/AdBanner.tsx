'use client';

import { useEffect, useRef } from 'react';

const ADSENSE_CLIENT_ID = 'ca-pub-5809883478660758';

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
    const loadAd = () => {
      if (isLoaded.current) return;
      
      try {
        if (typeof window !== 'undefined' && window.adsbygoogle && adRef.current) {
          window.adsbygoogle.push({});
          isLoaded.current = true;
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
          <div className="text-xs opacity-60">AdSense Client: {ADSENSE_CLIENT_ID}</div>
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
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// 타입 선언
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}

// 사전 정의된 광고 슬롯들 (실제 AdSense에서 생성한 슬롯 ID로 교체 필요)
export const AdSlots = {
  HEADER_BANNER: '1234567890',      // 헤더 배너 광고
  CONTENT_TOP: '1234567891',        // 콘텐츠 상단 광고  
  CONTENT_BOTTOM: '1234567892',     // 콘텐츠 하단 광고
  SIDEBAR: '1234567893',            // 사이드바 광고
  TOOL_RESULT: '1234567894',        // 도구 결과 광고
  FOOTER_BANNER: '1234567895',      // 푸터 배너 광고
  MOBILE_BANNER: '1234567896'       // 모바일 배너 광고
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