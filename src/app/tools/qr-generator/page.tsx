'use client';




import { useState, useEffect, useRef, useCallback } from 'react';
import QRCode from 'qrcode';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';
import { trackEvent } from '@/components/GoogleAnalytics';

// metadata는 layout.tsx에서 관리됩니다

export default function QRGeneratorPage() {
  const [text, setText] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [options, setOptions] = useState({
    errorCorrectionLevel: 'M' as 'L' | 'M' | 'Q' | 'H',
    width: 256,
    margin: 4,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // 페이지 방문 추적
  useEffect(() => {
    trackEvent('page_view', 'tool_usage', 'qr_generator');
  }, []);

  const generateQRCode = useCallback(async () => {
    if (!text.trim()) {
      setQrCodeUrl('');
      return;
    }

    setIsGenerating(true);
    try {
      const url = await QRCode.toDataURL(text, {
        errorCorrectionLevel: options.errorCorrectionLevel,
        width: options.width,
        margin: options.margin,
        color: options.color
      });
      setQrCodeUrl(url);

      // Canvas에도 그리기 (다운로드용)
      if (canvasRef.current) {
        await QRCode.toCanvas(canvasRef.current, text, {
          errorCorrectionLevel: options.errorCorrectionLevel,
          width: options.width,
          margin: options.margin,
          color: options.color
        });
      }

      // Google Analytics 이벤트 추적
      trackEvent('qr_generated', 'tool_usage', 'qr_generator', text.length);
    } catch (error) {
      console.error('QR 코드 생성 오류:', error);
    } finally {
      setIsGenerating(false);
    }
  }, [text, options]);

  useEffect(() => {
    generateQRCode();
  }, [generateQRCode]);

  const downloadQRCode = (format: 'png' | 'svg' = 'png') => {
    if (!canvasRef.current || !text.trim()) return;

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = `qr-code-${Date.now()}.png`;
      link.href = canvasRef.current.toDataURL();
      link.click();
    } else {
      // SVG 다운로드
      QRCode.toString(text, {
        type: 'svg',
        errorCorrectionLevel: options.errorCorrectionLevel,
        width: options.width,
        margin: options.margin,
        color: options.color
      }).then(svg => {
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `qr-code-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      });
    }
  };

  const copyToClipboard = () => {
    if (qrCodeUrl) {
      // 이미지를 클립보드에 복사하는 것은 브라우저 지원이 제한적이므로 URL 복사
      navigator.clipboard.writeText(text);
    }
  };

  const presetTexts = [
    { label: '내 블로그', value: 'https://myblog.com' },
    { label: '연락처', value: 'tel:010-1234-5678' },
    { label: 'WiFi 연결', value: 'WIFI:T:WPA;S:MyNetwork;P:password123;H:false;;' },
    { label: '이메일', value: 'mailto:example@email.com' },
    { label: 'SMS', value: 'sms:010-1234-5678' }
  ];

  return (
    <ToolLayout toolId="qr-generator">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🔳 QR 코드 생성기
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            텍스트/URL을 QR 코드로 변환 - 커스텀 색상, SVG/PNG 다운로드 지원
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ URL, 텍스트 지원</span>
            <span>•</span>
            <span>✓ 색상 커스터마이징</span>
            <span>•</span>
            <span>✓ PNG/SVG 다운로드</span>
            <span>•</span>
            <span>✓ 오류 정정 레벨</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 입력 및 설정 영역 */}
          <div className="space-y-6">
            {/* 텍스트 입력 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                텍스트 또는 URL 입력
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="변환할 텍스트나 URL을 입력하세요..."
                className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-700"
              />
              <div className="text-sm text-gray-700 mt-1 font-medium">
                {text.length}/2953 글자 (권장: 300자 이하)
              </div>
            </div>

            {/* 프리셋 버튼들 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                빠른 입력
              </label>
              <div className="flex flex-wrap gap-2">
                {presetTexts.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => setText(preset.value)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* QR 코드 설정 */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">⚙️ 설정</h3>

              {/* 오류 정정 레벨 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  오류 정정 레벨
                </label>
                <select
                  value={options.errorCorrectionLevel}
                  onChange={(e) => setOptions(prev => ({
                    ...prev,
                    errorCorrectionLevel: e.target.value as 'L' | 'M' | 'Q' | 'H'
                  }))}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="L">낮음 (L) - 7% 복구</option>
                  <option value="M">중간 (M) - 15% 복구</option>
                  <option value="Q">높음 (Q) - 25% 복구</option>
                  <option value="H">최고 (H) - 30% 복구</option>
                </select>
              </div>

              {/* 크기 설정 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  크기: {options.width}px
                </label>
                <input
                  type="range"
                  min="128"
                  max="512"
                  step="32"
                  value={options.width}
                  onChange={(e) => setOptions(prev => ({ ...prev, width: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-700 font-medium">
                  <span>128px</span>
                  <span>512px</span>
                </div>
              </div>

              {/* 여백 설정 */}
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  여백: {options.margin}
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={options.margin}
                  onChange={(e) => setOptions(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-700 font-medium">
                  <span>없음</span>
                  <span>최대</span>
                </div>
              </div>

              {/* 색상 설정 */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    전경색 (어두운 부분)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={options.color.dark}
                      onChange={(e) => setOptions(prev => ({
                        ...prev,
                        color: { ...prev.color, dark: e.target.value }
                      }))}
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={options.color.dark}
                      onChange={(e) => setOptions(prev => ({
                        ...prev,
                        color: { ...prev.color, dark: e.target.value }
                      }))}
                      className="flex-1 p-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    배경색 (밝은 부분)
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={options.color.light}
                      onChange={(e) => setOptions(prev => ({
                        ...prev,
                        color: { ...prev.color, light: e.target.value }
                      }))}
                      className="w-8 h-8 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={options.color.light}
                      onChange={(e) => setOptions(prev => ({
                        ...prev,
                        color: { ...prev.color, light: e.target.value }
                      }))}
                      className="flex-1 p-1 border border-gray-300 rounded text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 결과 영역 */}
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📱 미리보기</h3>

              {isGenerating ? (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <div className="text-gray-800 font-medium">생성 중...</div>
                </div>
              ) : qrCodeUrl ? (
                <div className="bg-gray-100 rounded-lg p-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrCodeUrl}
                    alt="Generated QR Code"
                    className="mx-auto rounded-lg shadow-sm"
                    style={{ width: Math.min(options.width, 300) }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <div className="text-gray-800 font-medium">텍스트를 입력하면 QR 코드가 생성됩니다</div>
                </div>
              )}

              {/* 다운로드 버튼들 */}
              {qrCodeUrl && (
                <div className="mt-6 space-y-3">
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => downloadQRCode('png')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      📥 PNG 다운로드
                    </button>
                    <button
                      onClick={() => downloadQRCode('svg')}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      📄 SVG 다운로드
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                      📋 텍스트 복사
                    </button>
                  </div>

                  {/* 크기별 다운로드 */}
                  <div>
                    <div className="text-base text-gray-800 mb-2 font-semibold">다른 크기로 다운로드:</div>
                    <div className="flex flex-wrap justify-center gap-2">
                      {[128, 256, 512].map(size => (
                        <button
                          key={size}
                          onClick={() => {
                            const originalWidth = options.width;
                            setOptions(prev => ({ ...prev, width: size }));
                            setTimeout(() => {
                              downloadQRCode('png');
                              setOptions(prev => ({ ...prev, width: originalWidth }));
                            }, 100);
                          }}
                          className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm transition-colors"
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 광고 영역 */}
            {qrCodeUrl && <ToolResultAd />}
          </div>
        </div>

        {/* 숨겨진 Canvas (다운로드용) */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* 사용법 안내 */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 사용법</h3>
          <ul className="text-sm text-yellow-700 space-y-2">
            <li>• <strong>URL:</strong> https://example.com (웹사이트 링크)</li>
            <li>• <strong>전화:</strong> tel:010-1234-5678 (전화걸기)</li>
            <li>• <strong>SMS:</strong> sms:010-1234-5678 (문자보내기)</li>
            <li>• <strong>이메일:</strong> mailto:example@email.com (이메일)</li>
            <li>• <strong>WiFi:</strong> WIFI:T:WPA;S:네트워크명;P:비밀번호;H:false;;</li>
            <li>• <strong>위치:</strong> geo:37.7749,-122.4194 (지도 좌표)</li>
            <li>• 오류 정정 레벨이 높을수록 손상에 강하지만 QR 코드가 복잡해집니다</li>
          </ul>
        </div>

      </div>
    </ToolLayout>
  );
}