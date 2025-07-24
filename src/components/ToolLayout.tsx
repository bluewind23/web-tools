import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { ContentBottomAd } from './AdBanner';
import { RandomToolsRecommendation } from './ToolRecommendations';

interface ToolLayoutProps {
  children: ReactNode;
  toolId?: string;
  showAds?: boolean;
  showRecommendations?: boolean;
}

export default function ToolLayout({
  children,
  toolId,
  showAds = true,
  showRecommendations = true
}: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-0 pb-4">
        {/* [수정] 페이지 상단 광고 제거 */}

        {/* 메인 콘텐츠 */}
        <div className="bg-white rounded-lg shadow-sm border p-6 md:p-8">
          {children}
        </div>

        {/* 하단 광고 */}
        {showAds && (
          <div className="mt-8">
            <ContentBottomAd />
          </div>
        )}

        {/* 도구 추천 섹션 */}
        {showRecommendations && (
          <div className="mt-8">
            <RandomToolsRecommendation currentToolId={toolId} />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}