'use client';


import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';
import { trackEvent } from '@/components/GoogleAnalytics';

// metadata는 layout.tsx에서 관리됩니다

export default function WordCounterPage() {
  const [text, setText] = useState('');
  const [includeSpaces, setIncludeSpaces] = useState(true);
  const [stats, setStats] = useState({
    characters: 0,
    charactersNoSpaces: 0,
    words: 0,
    sentences: 0,
    paragraphs: 0,
    bytes: 0
  });

  // 페이지 방문 추적
  useEffect(() => {
    trackEvent('page_view', 'tool_usage', 'word_counter');
  }, []);

  useEffect(() => {
    const calculateStats = () => {
      const characters = text.length;
      const charactersNoSpaces = text.replace(/\s/g, '').length;
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const sentences = text.trim() ? text.split(/[.!?]+/).filter(s => s.trim().length > 0).length : 0;
      const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length : 0;
      const bytes = new Blob([text]).size;

      setStats({
        characters,
        charactersNoSpaces,
        words,
        sentences,
        paragraphs,
        bytes
      });
    };

    calculateStats();
  }, [text]);

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
  };

  const clearText = () => {
    setText('');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setText(content);
      };
      reader.readAsText(file);
    }
  };

  return (
    <ToolLayout toolId="word-counter">
      {/* 헤더 */}
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          📝 글자 수 세기
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          한글/영문 실시간 글자 수 카운트 - 공백 포함/제외 옵션 지원
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
          <span>✓ 실시간 카운트</span>
          <span>•</span>
          <span>✓ 한글/영문 지원</span>
          <span>•</span>
          <span>✓ 파일 업로드</span>
          <span>•</span>
          <span>✓ 상세 통계</span>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="space-y-6">
        {/* 옵션 */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={includeSpaces}
                onChange={(e) => setIncludeSpaces(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">공백 포함</span>
            </label>
            <div>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-sm text-gray-700 transition-colors"
              >
                📁 파일 업로드
              </label>
            </div>
          </div>
          <button
            onClick={clearText}
            className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm transition-colors"
          >
            🗑️ 전체 삭제
          </button>
        </div>

        {/* 텍스트 입력 */}
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="여기에 텍스트를 입력하거나 붙여넣으세요..."
            className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none placeholder:text-gray-500 text-gray-800"
          />
          {text && (
            <button
              onClick={() => copyToClipboard(text)}
              className="absolute top-4 right-4 p-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded transition-colors"
              title="텍스트 복사"
            >
              📋
            </button>
          )}
        </div>

        {/* 통계 결과 */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">
              {includeSpaces ? stats.characters : stats.charactersNoSpaces}
            </div>
            <div className="text-sm text-gray-700">
              글자 수{includeSpaces ? '' : '(공백제외)'}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.words}</div>
            <div className="text-sm text-gray-700">단어 수</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.sentences}</div>
            <div className="text-sm text-gray-700">문장 수</div>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.paragraphs}</div>
            <div className="text-sm text-gray-700">문단 수</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.bytes}</div>
            <div className="text-sm text-gray-700">바이트</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.charactersNoSpaces}</div>
            <div className="text-sm text-gray-700">공백제외</div>
          </div>
        </div>

        {/* 상세 정보 */}
        {text && (
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 상세 분석</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">전체 글자 수 (공백 포함):</span>
                  <span className="font-medium text-gray-900">{stats.characters.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">글자 수 (공백 제외):</span>
                  <span className="font-medium text-gray-900">{stats.charactersNoSpaces.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">단어 수:</span>
                  <span className="font-medium text-gray-900">{stats.words.toLocaleString()}</span>
                </div>
              </div>
              <div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">문장 수:</span>
                  <span className="font-medium text-gray-900">{stats.sentences.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">문단 수:</span>
                  <span className="font-medium text-gray-900">{stats.paragraphs.toLocaleString()}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-200">
                  <span className="text-gray-800">용량 (바이트):</span>
                  <span className="font-medium text-gray-900">{stats.bytes.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* 빠른 복사 버튼들 */}
            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => copyToClipboard(includeSpaces ? stats.characters.toString() : stats.charactersNoSpaces.toString())}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
              >
                글자 수 복사
              </button>
              <button
                onClick={() => copyToClipboard(stats.words.toString())}
                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm transition-colors"
              >
                단어 수 복사
              </button>
              <button
                onClick={() => copyToClipboard(
                  `글자: ${includeSpaces ? stats.characters : stats.charactersNoSpaces} | 단어: ${stats.words} | 문장: ${stats.sentences}`
                )}
                className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-sm transition-colors"
              >
                요약 복사
              </button>
            </div>
          </div>
        )}

        {/* 광고 영역 */}
        {text && <ToolResultAd />}

        {/* 사용법 안내 */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 사용법</h3>
          <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
            <li>텍스트 입력창에 글을 입력하거나 붙여넣으세요</li>
            <li>공백 포함/제외 옵션을 선택할 수 있습니다</li>
            <li>.txt 파일을 업로드하여 분석할 수 있습니다</li>
            <li>통계 결과를 클릭하여 클립보드에 복사할 수 있습니다</li>
            <li>한글, 영문, 숫자, 특수문자 모두 정확하게 카운트됩니다</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}