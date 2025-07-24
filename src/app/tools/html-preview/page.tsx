'use client';

import { useState, useRef, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

// metadata는 layout.tsx에서 관리됩니다

export default function HTMLPreviewPage() {
  const [htmlCode, setHtmlCode] = useState(`<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HTML 미리보기</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 8px;
        }
        h1 {
            color: #333;
            text-align: center;
        }
        .highlight {
            background-color: #ffeb3b;
            padding: 2px 4px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>안녕하세요! 👋</h1>
        <p>이것은 <span class="highlight">HTML 미리보기</span> 도구입니다.</p>
        <p>왼쪽에서 HTML 코드를 편집하면 실시간으로 결과를 확인할 수 있습니다.</p>
        
        <h2>기능 목록</h2>
        <ul>
            <li>실시간 미리보기</li>
            <li>반응형 레이아웃</li>
            <li>JavaScript 지원</li>
            <li>CSS 스타일링</li>
        </ul>
        
        <button onclick="alert('버튼이 클릭되었습니다!')">클릭해보세요</button>
    </div>
    
    <script>
        console.log('HTML 미리보기 도구가 로드되었습니다!');
    </script>
</body>
</html>`);
  
  const [debouncedHtmlCode, setDebouncedHtmlCode] = useState(htmlCode);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewScale, setPreviewScale] = useState(100);
  const [viewMode, setViewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // 깜빡임 현상 개선을 위한 Debounce 로직
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedHtmlCode(htmlCode);
    }, 500); // 0.5초 지연 후 미리보기 업데이트

    return () => {
      clearTimeout(handler);
    };
  }, [htmlCode]);

  useEffect(() => {
    if (iframeRef.current) {
      iframeRef.current.srcdoc = debouncedHtmlCode;
    }
  }, [debouncedHtmlCode]);

  const downloadHTML = () => {
    const blob = new Blob([htmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `html-preview-${Date.now()}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(htmlCode);
  };

  const openInNewWindow = () => {
    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.documentElement.innerHTML = htmlCode;
    }
  };

  const insertTemplate = (template: string) => {
    let templateCode = '';
    
    switch (template) {
      case 'basic':
        templateCode = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>기본 페이지</title>
</head>
<body>
    <h1>제목</h1>
    <p>내용을 입력하세요.</p>
</body>
</html>`;
        break;
      case 'form':
        templateCode = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>폼 예제</title>
    <style>
        .form-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; }
        .form-group { margin-bottom: 15px; }
        label { display: block; margin-bottom: 5px; font-weight: bold; }
        input, textarea { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
        button { background: #007bff; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="form-container">
        <h2>연락처 폼</h2>
        <form>
            <div class="form-group">
                <label for="name">이름:</label>
                <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
                <label for="email">이메일:</label>
                <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
                <label for="message">메시지:</label>
                <textarea id="message" name="message" rows="4" required></textarea>
            </div>
            <button type="submit">전송</button>
        </form>
    </div>
</body>
</html>`;
        break;
      case 'card':
        templateCode = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>카드 레이아웃</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .card-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 20px; }
        .card h3 { margin-top: 0; color: #333; }
        .card p { color: #666; line-height: 1.6; }
        .btn { background: #007bff; color: white; padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; }
    </style>
</head>
<body>
    <div class="container">
        <h1>카드 레이아웃 예제</h1>
        <div class="card-grid">
            <div class="card">
                <h3>카드 1</h3>
                <p>첫 번째 카드의 내용입니다. 여기에 설명을 추가할 수 있습니다.</p>
                <button class="btn">더 보기</button>
            </div>
            <div class="card">
                <h3>카드 2</h3>
                <p>두 번째 카드의 내용입니다. 반응형 그리드로 배치됩니다.</p>
                <button class="btn">더 보기</button>
            </div>
            <div class="card">
                <h3>카드 3</h3>
                <p>세 번째 카드의 내용입니다. 자동으로 줄바꿈됩니다.</p>
                <button class="btn">더 보기</button>
            </div>
        </div>
    </div>
</body>
</html>`;
        break;
    }
    
    setHtmlCode(templateCode);
  };

  const getPreviewDimensions = () => {
    switch (viewMode) {
      case 'mobile':
        return { width: '375px', height: '667px' };
      case 'tablet':
        return { width: '768px', height: '1024px' };
      default:
        return { width: '100%', height: '100%' };
    }
  };

  const dimensions = getPreviewDimensions();

  return (
    <ToolLayout toolId="html-preview">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🌐 HTML 미리보기
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            HTML 코드를 실시간으로 미리보기 - 모바일/PC 반응형 테스트 지원
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ 실시간 미리보기</span>
            <span>•</span>
            <span>✓ 반응형 테스트</span>
            <span>•</span>
            <span>✓ 템플릿 제공</span>
            <span>•</span>
            <span>✓ 새창에서 보기</span>
          </div>
        </div>

        {/* 도구 모음 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* 템플릿 선택 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-800">템플릿:</span>
              <button
                onClick={() => insertTemplate('basic')}
                className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
              >
                기본
              </button>
              <button
                onClick={() => insertTemplate('form')}
                className="px-3 py-1 bg-green-100 hover:bg-green-200 text-green-700 rounded text-sm transition-colors"
              >
                폼
              </button>
              <button
                onClick={() => insertTemplate('card')}
                className="px-3 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-sm transition-colors"
              >
                카드
              </button>
            </div>

            {/* 뷰 모드 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-800">화면:</span>
              {(['desktop', 'tablet', 'mobile'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 rounded text-sm transition-colors ${
                    viewMode === mode
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {mode === 'desktop' ? '🖥️ 데스크톱' : mode === 'tablet' ? '📱 태블릿' : '📱 모바일'}
                </button>
              ))}
            </div>

            {/* 줌 */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-semibold text-gray-800">줌:</span>
              <input
                type="range"
                min="50"
                max="150"
                value={previewScale}
                onChange={(e) => setPreviewScale(parseInt(e.target.value))}
                className="w-20"
              />
              <span className="text-sm text-gray-600">{previewScale}%</span>
            </div>

            {/* 액션 버튼 */}
            <div className="flex items-center space-x-2 ml-auto">
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
              >
                📋 복사
              </button>
              <button
                onClick={downloadHTML}
                className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm transition-colors"
              >
                💾 다운로드
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-3 py-1 text-purple-600 hover:bg-purple-50 rounded text-sm transition-colors"
              >
                {isFullscreen ? '🔳 축소' : '⛶ 전체화면'}
              </button>
              <button
                onClick={openInNewWindow}
                className="px-3 py-1 text-indigo-600 hover:bg-indigo-50 rounded text-sm transition-colors"
              >
                🔗 새창에서 보기
              </button>
            </div>
          </div>
        </div>

        {/* 메인 영역 */}
        <div className={`grid gap-6 ${isFullscreen ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
          {/* 코드 편집기 */}
          {!isFullscreen && (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">📝 HTML 코드</h3>
              </div>
              <div className="relative">
                <textarea
                  value={htmlCode}
                  onChange={(e) => setHtmlCode(e.target.value)}
                  className="w-full h-[500px] p-4 font-mono text-sm border-none resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
                  placeholder="HTML 코드를 입력하세요..."
                  spellCheck={false}
                />
                <div className="absolute bottom-2 right-2 text-xs text-gray-500 bg-white px-2 py-1 rounded">
                  {htmlCode.split('\n').length} 줄 • {htmlCode.length} 글자
                </div>
              </div>
            </div>
          )}

          {/* 미리보기 */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">👁️ 미리보기</h3>
              <div className="text-sm text-gray-600">
                {viewMode === 'desktop' ? '데스크톱' : viewMode === 'tablet' ? '태블릿' : '모바일'} 뷰
              </div>
            </div>
            <div className="p-4 bg-gray-100" style={{ minHeight: '500px' }}>
              <div 
                className="mx-auto bg-white shadow-lg rounded overflow-hidden"
                style={{ 
                  width: dimensions.width,
                  height: viewMode === 'desktop' ? '500px' : dimensions.height,
                  transform: `scale(${previewScale / 100})`,
                  transformOrigin: 'top center'
                }}
              >
                <iframe
                  ref={iframeRef}
                  srcDoc={debouncedHtmlCode}
                  className="w-full h-full border-none"
                  sandbox="allow-scripts allow-forms allow-modals"
                  title="HTML Preview"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 광고 영역 */}
        {htmlCode && (
          <div className="mt-8">
            <ToolResultAd />
          </div>
        )}

        {/* 사용법 안내 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 사용법</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• 왼쪽에서 HTML 코드를 작성하면 오른쪽에서 실시간 미리보기</li>
              <li>• 템플릿 버튼으로 미리 만들어진 예제 사용</li>
              <li>• 화면 크기를 변경하여 반응형 디자인 테스트</li>
              <li>• 완성된 코드는 다운로드하거나 새창에서 확인 가능</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚠️ 주의사항</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• JavaScript는 샌드박스 환경에서 실행됩니다</li>
              <li>• 외부 리소스 로딩이 제한될 수 있습니다</li>
              <li>• 복잡한 스크립트는 정상 작동하지 않을 수 있습니다</li>
              <li>• 실제 서버 환경과 다를 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}