'use client';

import { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'rectangle' | 'vertical' | 'horizontal';
  responsive?: boolean;
  className?: string;
}

export default function AdBanner({ 
  slot, 
  format = 'auto', 
  responsive = true, 
  className = '' 
}: AdBannerProps) {
  useEffect(() => {
    try {
      // AdSense 광고 로드 (실제 운영시에는 Google AdSense 코드 사용)
      if (typeof window !== 'undefined' && (window as typeof window & { adsbygoogle?: unknown[] }).adsbygoogle) {
        const adsbygoogle = (window as typeof window & { adsbygoogle: unknown[] }).adsbygoogle;
        (adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Ad loading error:', error);
    }
  }, []);

  // 개발 환경에서는 플레이스홀더 표시
  const isDevelopment = process.env.NODE_ENV === 'development';

  if (isDevelopment) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center min-h-[100px] ${className}`}>
        <div className="text-gray-500 text-sm">
          <div className="text-xs mb-1">광고 영역</div>
          <div className="text-xs opacity-60">AdSense Slot: {slot}</div>
          <div className="text-xs opacity-60">Format: {format}</div>
          {responsive && <div className="text-xs opacity-60">Responsive: Yes</div>}
        </div>
      </div>
    );
  }

  // [추가] 환경 변수에서 클라이언트 ID 가져오기
  const adClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  // [추가] 클라이언트 ID가 없으면 광고를 렌더링하지 않음
  if (!adClient) {
    return null; // 또는 개발 환경과 동일한 플레이스홀더 표시
  }

  return (
    <div className={`ad-container min-h-[100px] ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={adClient} // [수정] 환경 변수 사용
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}

// 사전 정의된 광고 슬롯들
export const AdSlots = {
  HEADER_BANNER: 'header-banner',
  CONTENT_TOP: 'content-top', 
  CONTENT_BOTTOM: 'content-bottom',
  SIDEBAR: 'sidebar',
  TOOL_RESULT: 'tool-result',
  FOOTER_BANNER: 'footer-banner',
  MOBILE_BANNER: 'mobile-banner'
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