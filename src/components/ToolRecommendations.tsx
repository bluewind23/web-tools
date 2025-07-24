'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getRandomTools, getPopularTools, Tool } from '@/data/tools';

interface ToolRecommendationsProps {
  currentToolId?: string;
  type?: 'random' | 'popular';
  count?: number;
  title?: string;
  className?: string;
}

export default function ToolRecommendations({
  currentToolId,
  type = 'random',
  count = 4,
  title,
  className = ''
}: ToolRecommendationsProps) {
  const [recommendedTools, setRecommendedTools] = useState<Tool[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const tools = type === 'popular' 
      ? getPopularTools().filter(tool => tool.id !== currentToolId).slice(0, count)
      : getRandomTools(count, currentToolId);
    setRecommendedTools(tools);
  }, [currentToolId, type, count]);

  // 클라이언트에서만 렌더링하여 Hydration 오류 방지
  if (!isClient) {
    return (
      <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {title || (type === 'popular' ? '인기 도구' : '다른 도구 둘러보기')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 로딩 스켈레톤 */}
          {Array.from({ length: count }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-200 rounded"></div>
                <div className="flex-1 min-w-0">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const defaultTitle = type === 'popular' ? '인기 도구' : '다른 도구 둘러보기';

  if (recommendedTools.length === 0) return null;

  return (
    <div className={`bg-gray-50 rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {title || defaultTitle}
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {recommendedTools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="group bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{tool.icon}</span>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                  {tool.name}
                </h4>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                  {tool.shortDesc}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* 더 많은 도구 보기 링크 */}
      <div className="mt-6 text-center">
        <Link
          href="/#tools"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          모든 도구 보기
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}

// 사용하기 쉬운 사전 정의된 컴포넌트들
export function PopularToolsRecommendation({ currentToolId, className }: { 
  currentToolId?: string; 
  className?: string; 
}) {
  return (
    <ToolRecommendations
      currentToolId={currentToolId}
      type="popular"
      count={3}
      title="인기 도구"
      className={className}
    />
  );
}

export function RandomToolsRecommendation({ currentToolId, className }: { 
  currentToolId?: string; 
  className?: string; 
}) {
  return (
    <ToolRecommendations
      currentToolId={currentToolId}
      type="random"
      count={4}
      title="다른 도구들도 사용해보세요"
      className={className}
    />
  );
}

export function CompactToolsRecommendation({ currentToolId }: { currentToolId?: string }) {
  const [tools, setTools] = useState<Tool[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setTools(getRandomTools(3, currentToolId));
  }, [currentToolId]);

  if (!isClient) {
    return (
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
        <h4 className="text-sm font-medium text-blue-900 mb-3">
          🔧 다른 유용한 도구들
        </h4>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex items-center space-x-2 p-2 rounded-md animate-pulse">
              <div className="w-4 h-4 bg-blue-200 rounded"></div>
              <div className="h-3 bg-blue-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
      <h4 className="text-sm font-medium text-blue-900 mb-3">
        🔧 다른 유용한 도구들
      </h4>
      <div className="space-y-2">
        {tools.map((tool) => (
          <Link
            key={tool.id}
            href={tool.href}
            className="flex items-center space-x-2 text-sm text-blue-700 hover:text-blue-900 hover:bg-blue-100 p-2 rounded-md transition-colors"
          >
            <span className="text-base">{tool.icon}</span>
            <span>{tool.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}