'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { HeaderAd } from '@/components/AdBanner';
import { tools, categories, getPopularTools, getToolsByCategory } from '@/data/tools';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const popularTools = getPopularTools();

  // 검색 결과 필터링
  const searchResults = tools.filter(tool => {
    if (!searchQuery.trim()) return false;
    
    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
    
    const searchableText = [
      tool.name,
      tool.description,
      tool.shortDesc,
      ...tool.keywords
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  }).slice(0, 5); // 최대 5개 결과만 표시
  
  const filteredTools = getToolsByCategory(selectedCategory).filter(tool => {
    if (!searchQuery.trim()) return true;
    
    const query = searchQuery.toLowerCase().trim();
    const searchTerms = query.split(/\s+/).filter(term => term.length > 0);
    
    const searchableText = [
      tool.name,
      tool.description,
      tool.shortDesc,
      ...tool.keywords
    ].join(' ').toLowerCase();
    
    return searchTerms.every(term => searchableText.includes(term));
  });

  // 검색창 외부 클릭 시 결과 숨기기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false);
        setSelectedSearchIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 키보드 네비게이션
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSearchIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSearchIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length) {
          router.push(searchResults[selectedSearchIndex].href);
        } else if (searchResults.length > 0) {
          router.push(searchResults[0].href);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedSearchIndex(-1);
        break;
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSearchResults(value.trim().length > 0);
    setSelectedSearchIndex(-1);
  };

  const handleSearchResultClick = (tool: typeof tools[0]) => {
    router.push(tool.href);
    setShowSearchResults(false);
    setSelectedSearchIndex(-1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main>
        {/* 히어로 섹션 */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                <span className="text-blue-600">무료</span> 웹 도구 모음
              </h1>
              <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
                일상에서 자주 사용하는 유용한 도구들을 웹에서 간편하게 이용하세요. 
                설치 없이 바로 사용 가능한 온라인 유틸리티입니다.
              </p>

              {/* 검색 박스 */}
              <div className="max-w-md mx-auto mb-8">
                <div className="relative" ref={searchRef}>
                  <input
                    type="text"
                    placeholder="도구 검색... (예: gif, 글자수, color)"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => searchQuery.trim() && setShowSearchResults(true)}
                    className="w-full px-4 py-3 pl-12 text-gray-900 bg-white border-2 border-gray-300 rounded-full shadow-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-medium placeholder:text-gray-500"
                  />
                  <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>

                  {/* 검색 결과 드롭다운 */}
                  {showSearchResults && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                      {searchResults.map((tool, index) => (
                        <button
                          key={tool.id}
                          onClick={() => handleSearchResultClick(tool)}
                          className={`w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors ${
                            index === selectedSearchIndex ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <span className="text-2xl">{tool.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 truncate">
                                {tool.name}
                              </div>
                              <div className="text-sm text-gray-500 truncate">
                                {tool.shortDesc}
                              </div>
                            </div>
                            <div className="text-blue-600">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* 검색 결과가 없을 때 */}
                  {showSearchResults && searchQuery.trim() && searchResults.length === 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50">
                      <div className="px-4 py-6 text-center text-gray-500">
                        <span className="text-2xl mb-2 block">🔍</span>
                        <div className="text-sm">&apos;{searchQuery}&apos;에 대한 검색 결과가 없습니다.</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 인기 도구 섹션 */}
        <section className="py-4 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              🔥 인기 도구
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 hover:border-blue-200"
                >
                  <div className="flex items-start space-x-4">
                    <span className="text-4xl">{tool.icon}</span>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {tool.name}
                      </h3>
                      <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {tool.shortDesc}
                      </p>
                      <span className="inline-block mt-3 text-blue-600 text-sm font-medium group-hover:text-blue-800">
                        바로 사용하기 →
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* 광고 영역 */}
        <section className="py-6 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <HeaderAd />
          </div>
        </section>

        {/* 전체 도구 섹션 */}
        <section id="tools" className="py-12 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
              🔧 모든 도구
            </h2>

            {/* 카테고리 필터 */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    // 카테고리 변경 시 검색어는 유지
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                  }`}
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>

            {/* 도구 그리드 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group bg-white rounded-lg p-5 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-blue-200"
                >
                  <div className="text-center">
                    <span className="text-3xl mb-3 block">{tool.icon}</span>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                      {tool.name}
                    </h3>
                    <p className="text-gray-500 text-xs mt-2 line-clamp-2">
                      {tool.shortDesc}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {filteredTools.length === 0 && (
              <div className="text-center py-12">
                <span className="text-4xl mb-4 block">🔍</span>
                <p className="text-gray-500">검색 결과가 없습니다.</p>
              </div>
            )}
          </div>
        </section>

        {/* 특징 섹션 */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              왜 WebTools를 선택해야 할까요?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">빠르고 간편</h3>
                <p className="text-gray-600">설치나 회원가입 없이 바로 사용할 수 있습니다.</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">안전한 처리</h3>
                <p className="text-gray-600">모든 데이터는 브라우저에서만 처리되어 안전합니다.</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💎</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">완전 무료</h3>
                <p className="text-gray-600">모든 기능을 제한 없이 무료로 이용하실 수 있습니다.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
