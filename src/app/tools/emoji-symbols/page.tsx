'use client';





import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

interface SymbolCategory {
  id: string;
  name: string;
  icon: string;
  symbols: string[];
}

const symbolCategories: SymbolCategory[] = [
  {
    id: 'faces',
    name: '얼굴 & 감정',
    icon: '😀',
    symbols: [
      '😀', '😃', '😄', '😁', '😆', '😅', '🤣', '😂', '🙂', '🙃',
      '😉', '😊', '😇', '🥰', '😍', '🤩', '😘', '😗', '😚', '😙',
      '😋', '😛', '😜', '🤪', '😝', '🤑', '🤗', '🤭', '🤫', '🤔',
      '🤐', '🤨', '😐', '😑', '😶', '😏', '😒', '🙄', '😬', '🤥',
      '😔', '😪', '🤤', '😴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
      '🥵', '🥶', '🥴', '😵', '🤯', '🤠', '🥳', '😎', '🤓', '🧐'
    ]
  },
  {
    id: 'gestures',
    name: '손동작 & 제스처',
    icon: '👋',
    symbols: [
      '👋', '🤚', '🖐️', '✋', '🖖', '👌', '🤏', '✌️', '🤞', '🤟',
      '🤘', '🤙', '👈', '👉', '👆', '🖕', '👇', '☝️', '👍', '👎',
      '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲', '🤝', '🙏',
      '✍️', '💅', '🤳', '💪', '🦾', '🦿', '🦵', '🦶', '👂', '🦻'
    ]
  },
  {
    id: 'hearts',
    name: '하트 & 사랑',
    icon: '❤️',
    symbols: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔',
      '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '♥️',
      '💋', '💌', '💒', '💐', '🌹', '🌺', '🌻', '🌷', '🌸', '💍'
    ]
  },
  {
    id: 'korean',
    name: '한글 감정표현',
    icon: '😢',
    symbols: [
      '😢', '😭', '😂', '🤣', '😊', '😁', '😔', '😞',
      '😑', '🖕', '😢', '😭', '^_^', '^o^', '^.^', '😏', '😤',
      '😵', '😲', '😭', '😒', '😐', '😶', '👍', '👎',
      '👌', '🙏', '👋', '👊', '✌️', '👀', '🤷', '😤'
    ]
  },
];

export default function EmojiSymbolsPage() {
  const [selectedCategory, setSelectedCategory] = useState('faces');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSymbol, setCopiedSymbol] = useState<string>('');

  const copyToClipboard = (symbol: string) => {
    navigator.clipboard.writeText(symbol);
    setCopiedSymbol(symbol);
    setTimeout(() => setCopiedSymbol(''), 1000);
  };

  const currentCategory = symbolCategories.find(cat => cat.id === selectedCategory);
  const displaySymbols = searchQuery.trim()
    ? Array.from(new Set(symbolCategories.flatMap(cat => {
      const query = searchQuery.toLowerCase().trim();
      return cat.symbols.filter(symbol => {
        // 심볼 자체에서 검색
        if (symbol.toLowerCase().includes(query)) return true;
        // 카테고리 이름에서 검색
        if (cat.name.toLowerCase().includes(query)) return true;
        // 특별 키워드 검색 (감정, 하트, 손동작 등)
        const keywords = {
          '웃음': ['😀', '😁', '😄', '😆', '😂', '🤣', '😊'],
          '슬픔': ['😢', '😭', '😔', '😞', '😪'],
          '화남': ['😠', '😡', '🤬', '😤'],
          '사랑': ['❤️', '💕', '💖', '💗', '💘', '💝', '😍', '🥰'],
          '하트': ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔'],
          '박수': ['👏'],
          '좋아': ['👍', '😊', '😍', '🥰'],
          '싫어': ['👎', '😤', '😠', '😡']
        };

        for (const [keyword, emojis] of Object.entries(keywords)) {
          if (keyword.includes(query) && emojis.includes(symbol)) {
            return true;
          }
        }
        return false;
      });
    })))
    : currentCategory?.symbols || [];

  return (
    <ToolLayout toolId="emoji-symbols">
      {/* 헤더 */}
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center">
          <span className="mr-2 text-4xl">😀</span>
          <span>특수 문자표 / 이모지</span>
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          이모지, 특수문자, 기호 모음 - 클릭으로 간편 복사
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          <span>✓ 크로스 플랫폼 지원</span>
          <span>•</span>
          <span>✓ 카테고리별 분류</span>
          <span>•</span>
          <span>✓ 한글 감정표현</span>
          <span>•</span>
          <span>✓ 클릭 복사</span>
        </div>
      </div>

      {/* 검색창 */}
      <div className="mb-6">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="이모지나 카테고리 검색..."
            className="w-full px-4 py-3 pl-12 text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <svg className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 카테고리 탭 */}
      {!searchQuery && (
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-2">
            {symbolCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center ${selectedCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border border-gray-200'
                  }`}
              >
                <span className="mr-2 text-lg">{category.icon}</span>
                {category.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 복사 상태 표시 */}
      {copiedSymbol && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 animate-pulse">
          <span className="text-lg mr-2">{copiedSymbol}</span>
          복사됨!
        </div>
      )}

      {/* 심볼 그리드 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {searchQuery ? `"${searchQuery}" 검색 결과` : currentCategory?.name}
        </h2>

        {displaySymbols.length > 0 ? (
          <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 xl:grid-cols-15 gap-2">
            {displaySymbols.map((symbol, index) => (
              <button
                key={`${symbol}-${index}`}
                onClick={() => copyToClipboard(symbol)}
                className="aspect-square p-2 text-3xl hover:bg-blue-50 hover:scale-110 transition-all duration-200 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-sm flex items-center justify-center"
                title={`클릭하여 "${symbol}" 복사`}
              >
                {symbol}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl mb-4 block">🔍</span>
            검색 결과가 없습니다.
          </div>
        )}
      </div>

      {/* 광고 영역 */}
      <ToolResultAd />

      {/* 사용법 안내 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 사용법</h3>
          <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
            <li>원하는 이모지나 기호를 클릭하면 자동으로 복사됩니다</li>
            <li>검색창에서 특정 이모지나 카테고리를 찾을 수 있습니다</li>
            <li>복사된 내용을 다른 곳에 붙여넣기(Ctrl+V)하세요</li>
            <li>모든 기기와 플랫폼에서 동일한 모양으로 보입니다</li>
          </ul>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">🔥 인기 조합</h3>
          <div className="space-y-2 text-sm">
            <button onClick={() => copyToClipboard('( ͡° ͜ʖ ͡°)')} className="block w-full text-left p-2 bg-white rounded border hover:bg-yellow-100">
              <span className="font-mono">( ͡° ͜ʖ ͡°)</span> - 르네상스
            </button>
            <button onClick={() => copyToClipboard('¯\\_(ツ)_/¯')} className="block w-full text-left p-2 bg-white rounded border hover:bg-yellow-100">
              <span className="font-mono">¯\\_(ツ)_/¯</span> - 어깨동작
            </button>
            <button onClick={() => copyToClipboard('(╯°□°）╯︵ ┻━┻')} className="block w-full text-left p-2 bg-white rounded border hover:bg-yellow-100">
              <span className="font-mono">(╯°□°）╯︵ ┻━┻</span> - 테이블 뒤집기
            </button>
            <button onClick={() => copyToClipboard('ಠ_ಠ')} className="block w-full text-left p-2 bg-white rounded border hover:bg-yellow-100">
              <span className="font-mono">ಠ_ಠ</span> - 째려보기
            </button>
          </div>
        </div>
      </div>

      {/* 한글 감정표현 특별 섹션 */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
          <span className="mr-2">🇰🇷</span>
          <span>한글 감정표현 모음</span>
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
          {symbolCategories.find(cat => cat.id === 'korean')?.symbols.slice(0, 20).map((symbol, index) => (
            <button
              key={`korean-${index}`}
              onClick={() => copyToClipboard(symbol)}
              className="p-2 text-base font-mono hover:bg-purple-100 transition-colors rounded border border-purple-100 hover:border-purple-300 text-gray-900 font-medium"
              title={`클릭하여 "${symbol}" 복사`}
            >
              {symbol}
            </button>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}