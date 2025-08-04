'use client';




import { useState, useRef, useEffect, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

interface TextStyle {
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor: string;
  textAlign: 'left' | 'center' | 'right';
  // [수정] 폰트 굵기를 숫자와 문자열 모두 받을 수 있도록 변경
  fontWeight: 'normal' | 'bold' | number;
  fontStyle: 'normal' | 'italic';
  padding: number;
  lineHeight: number;
}

export default function TextToImagePage() {
  const [text, setText] = useState('안녕하세요!\n텍스트를 이미지로 변환합니다.');
  const [imageWidth, setImageWidth] = useState(800);
  const [imageHeight, setImageHeight] = useState(400);
  const [style, setStyle] = useState<TextStyle>({
    fontSize: 48,
    fontFamily: 'var(--font-noto-sans-kr)',
    color: '#333333',
    backgroundColor: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'normal',
    fontStyle: 'normal',
    padding: 40,
    lineHeight: 1.5
  });
  const [generatedImage, setGeneratedImage] = useState<string>('');
  const [imageFormat, setImageFormat] = useState<'png' | 'jpeg'>('png');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // [수정] 다양한 폰트 목록 추가
  const fontFamilies = [
    { name: 'Noto Sans KR (한글)', value: 'var(--font-noto-sans-kr)' },
    { name: '나눔고딕 (한글)', value: 'var(--font-nanum-gothic)' },
    { name: '도현 (한글)', value: 'var(--font-do-hyeon)' },
    { name: 'Gothic A1 (한글)', value: 'var(--font-gothic-a1)' },
    { name: 'Roboto (영문)', value: 'var(--font-roboto)' },
    { name: 'Montserrat (영문)', value: 'var(--font-montserrat)' },
    { name: 'Lato (영문)', value: 'var(--font-lato)' },
    { name: 'Open Sans (영문)', value: 'var(--font-open-sans)' },
    { name: 'Arial', value: 'Arial' },
    { name: 'Georgia', value: 'Georgia' },
    { name: 'Impact', value: 'Impact' },
  ];

  // [수정] 다양한 폰트 굵기 옵션 추가
  const fontWeights = [
    { name: 'Light (300)', value: 300 },
    { name: '보통 (400)', value: 'normal' },
    { name: 'Medium (500)', value: 500 },
    { name: 'Semi-bold (600)', value: 600 },
    { name: '굵게 (700)', value: 'bold' },
    { name: 'Extra-bold (800)', value: 800 },
    { name: 'Black (900)', value: 900 },
  ];

  const presetStyles = [
    {
      name: '기본',
      style: {
        fontSize: 48,
        fontFamily: 'var(--font-noto-sans-kr)',
        color: '#333333',
        backgroundColor: '#FFFFFF',
        textAlign: 'center' as const,
        fontWeight: 'normal' as const,
        fontStyle: 'normal' as const,
        padding: 40,
        lineHeight: 1.5
      }
    },
    {
      name: '제목',
      style: {
        fontSize: 60,
        fontFamily: 'var(--font-do-hyeon)',
        color: '#2c3e50',
        backgroundColor: '#ecf0f1',
        textAlign: 'center' as const,
        fontWeight: 'normal' as const,
        fontStyle: 'normal' as const,
        padding: 60,
        lineHeight: 1.2
      }
    },
    {
      name: '인용구',
      style: {
        fontSize: 32,
        fontFamily: 'var(--font-gothic-a1)',
        color: '#34495e',
        backgroundColor: '#f8f9fa',
        textAlign: 'center' as const,
        fontWeight: 300,
        fontStyle: 'italic' as const,
        padding: 50,
        lineHeight: 1.6
      }
    },
    {
      name: '강조',
      style: {
        fontSize: 52,
        fontFamily: 'Impact',
        color: '#ffffff',
        backgroundColor: '#e74c3c',
        textAlign: 'center' as const,
        fontWeight: 900,
        fontStyle: 'normal' as const,
        padding: 45,
        lineHeight: 1.3
      }
    }
  ];

  const resolveFontFamily = (fontValue: string): string => {
    switch (fontValue) {
      case 'var(--font-noto-sans-kr)':
        return '"Noto Sans KR", sans-serif';
      case 'var(--font-nanum-gothic)':
        return '"Nanum Gothic", sans-serif';
      case 'var(--font-montserrat)':
        return 'Montserrat, sans-serif';
      case 'var(--font-lato)':
        return 'Lato, sans-serif';
      // [수정] 새로 추가된 폰트 변환 로직
      case 'var(--font-do-hyeon)':
        return '"Do Hyeon", sans-serif';
      case 'var(--font-gothic-a1)':
        return '"Gothic A1", sans-serif';
      case 'var(--font-roboto)':
        return 'Roboto, sans-serif';
      case 'var(--font-open-sans)':
        return '"Open Sans", sans-serif';
      default:
        return fontValue;
    }
  };

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = imageWidth * dpr;
    canvas.height = imageHeight * dpr;
    canvas.style.width = `${imageWidth}px`;
    canvas.style.height = `${imageHeight}px`;
    ctx.scale(dpr, dpr);

    ctx.fillStyle = style.backgroundColor;
    ctx.fillRect(0, 0, imageWidth, imageHeight);

    const resolvedFontFamily = resolveFontFamily(style.fontFamily);
    const fontStyleStr = `${style.fontStyle} ${style.fontWeight} ${style.fontSize}px ${resolvedFontFamily}`;

    ctx.font = fontStyleStr;
    ctx.fillStyle = style.color;
    ctx.textAlign = style.textAlign;
    ctx.textBaseline = 'middle';

    const lines = text.split('\n');
    const lineHeight = style.fontSize * style.lineHeight;
    const totalTextHeight = lines.length * lineHeight;
    const blockStartY = (imageHeight - totalTextHeight) / 2;

    let textX: number;
    if (style.textAlign === 'center') {
      textX = imageWidth / 2;
    } else if (style.textAlign === 'right') {
      textX = imageWidth - style.padding;
    } else {
      textX = style.padding;
    }

    lines.forEach((line, index) => {
      const lineY = blockStartY + (index * lineHeight) + (lineHeight / 2);
      ctx.fillText(line, textX, lineY);
    });

    const dataURL = canvas.toDataURL(`image/${imageFormat}`, 0.95);
    setGeneratedImage(dataURL);
  }, [imageWidth, imageHeight, style, text, imageFormat]);

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `text-image-${Date.now()}.${imageFormat}`;
      link.click();
    }
  };

  const copyToClipboard = async () => {
    if (generatedImage) {
      try {
        const response = await fetch(generatedImage);
        const blob = await response.blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        alert('이미지가 클립보드에 복사되었습니다.');
      } catch (error) {
        console.error('클립보드 복사 실패:', error);
        alert('브라우저에서 지원하지 않아 복사에 실패했습니다. 다운로드 기능을 이용해주세요.');
      }
    }
  };

  const applyPreset = (presetStyle: TextStyle) => {
    setStyle(presetStyle);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      generateImage();
    }, 300);
    return () => clearTimeout(timer);
  }, [generateImage]);

  const updateStyle = (key: keyof TextStyle, value: string | number) => {
    // 폰트 굵기 값은 숫자일 수 있으므로 변환하지 않음
    const processedValue = key === 'fontWeight' ? value : typeof value === 'string' && !isNaN(parseFloat(value)) ? parseFloat(value) : value;
    setStyle(prev => ({ ...prev, [key]: processedValue }));
  };

  return (
    <ToolLayout toolId="text-to-image">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🖼️ 텍스트를 이미지로
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            텍스트를 커스터마이징하여 고품질 이미지로 변환
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ 실시간 미리보기</span>
            <span>•</span>
            <span>✓ 폰트 커스터마이징</span>
            <span>•</span>
            <span>✓ 다양한 형식</span>
            <span>•</span>
            <span>✓ 고품질 출력</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 설정 패널 */}
          <div className="space-y-6">
            {/* 텍스트 입력 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 텍스트 입력</h2>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="변환할 텍스트를 입력하세요..."
                className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-900 placeholder:text-gray-700"
              />
              <div className="text-xs text-gray-500 mt-2">
                {text.split('\n').length}줄 • {text.length}글자
              </div>
            </div>

            {/* 프리셋 스타일 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 프리셋 스타일</h3>
              <div className="grid grid-cols-2 gap-3">
                {presetStyles.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => applyPreset(preset.style)}
                    className="p-3 text-left border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-gray-900">{preset.name}</div>
                    <div className="text-sm text-gray-500">
                      {preset.style.fontSize}px {preset.style.fontFamily.includes('var') ? '커스텀 폰트' : preset.style.fontFamily}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 텍스트 스타일 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">✏️ 텍스트 스타일</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      폰트 크기: {style.fontSize}px
                    </label>
                    <input
                      type="range"
                      min="12"
                      max="150"
                      value={style.fontSize}
                      onChange={(e) => updateStyle('fontSize', parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      줄 간격: {style.lineHeight}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="2.5"
                      step="0.1"
                      value={style.lineHeight}
                      onChange={(e) => updateStyle('lineHeight', parseFloat(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">폰트</label>
                  <select
                    value={style.fontFamily}
                    onChange={(e) => updateStyle('fontFamily', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  >
                    {fontFamilies.map((font) => (
                      <option key={font.name} value={font.value}>
                        {font.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">텍스트 색상</label>
                    <input
                      type="color"
                      value={style.color}
                      onChange={(e) => updateStyle('color', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">배경 색상</label>
                    <input
                      type="color"
                      value={style.backgroundColor}
                      onChange={(e) => updateStyle('backgroundColor', e.target.value)}
                      className="w-full h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">정렬</label>
                    <select
                      value={style.textAlign}
                      onChange={(e) => updateStyle('textAlign', e.target.value as 'left' | 'center' | 'right')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                    >
                      <option value="left">왼쪽</option>
                      <option value="center">가운데</option>
                      <option value="right">오른쪽</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">굵기</label>
                    {/* [수정] 폰트 굵기 선택 UI 변경 */}
                    <select
                      value={style.fontWeight}
                      onChange={(e) => updateStyle('fontWeight', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                    >
                      {fontWeights.map((weight) => (
                        <option key={weight.name} value={weight.value}>
                          {weight.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">스타일</label>
                    <select
                      value={style.fontStyle}
                      onChange={(e) => updateStyle('fontStyle', e.target.value as 'normal' | 'italic')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                    >
                      <option value="normal">보통</option>
                      <option value="italic">기울임</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 이미지 설정 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">📏 이미지 설정</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      너비: {imageWidth}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={imageWidth}
                      onChange={(e) => setImageWidth(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-2">
                      높이: {imageHeight}px
                    </label>
                    <input
                      type="range"
                      min="200"
                      max="2000"
                      step="50"
                      value={imageHeight}
                      onChange={(e) => setImageHeight(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">이미지 형식</label>
                  <select
                    value={imageFormat}
                    onChange={(e) => setImageFormat(e.target.value as 'png' | 'jpeg')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 font-medium"
                  >
                    <option value="png">PNG (투명 배경 지원)</option>
                    <option value="jpeg">JPEG (작은 파일 크기)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    여백: {style.padding}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={style.padding}
                    onChange={(e) => updateStyle('padding', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 미리보기 및 결과 */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">👁️ 미리보기</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded text-sm transition-colors"
                  >
                    📋 복사
                  </button>
                  <button
                    onClick={downloadImage}
                    className="px-3 py-1 text-green-600 hover:bg-green-50 rounded text-sm transition-colors"
                  >
                    💾 다운로드
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-auto flex justify-center items-center min-h-[400px]">
                <canvas ref={canvasRef} style={{ display: 'none' }} />
                {generatedImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={generatedImage}
                    alt="Generated Text Image"
                    className="max-w-full h-auto rounded shadow-sm"
                  />
                ) : (
                  <div className="text-gray-800 font-medium text-lg">미리보기를 생성 중입니다...</div>
                )}
              </div>

              <div className="mt-4 text-base text-gray-700 font-medium">
                크기: {imageWidth} × {imageHeight}px • 형식: {imageFormat.toUpperCase()}
              </div>
            </div>

            {/* 빠른 크기 설정 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">📏 빠른 크기 설정</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: '정사각형', width: 800, height: 800 },
                  { name: '와이드 (16:9)', width: 1280, height: 720 },
                  { name: '세로형 (9:16)', width: 720, height: 1280 },
                  { name: 'SNS 포스트', width: 1080, height: 1080 },
                  { name: '배너', width: 1200, height: 400 },
                  { name: '썸네일', width: 480, height: 360 }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setImageWidth(preset.width);
                      setImageHeight(preset.height);
                    }}
                    className="p-3 text-left bg-white border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <div className="font-medium text-blue-800">{preset.name}</div>
                    <div className="text-sm text-blue-600">
                      {preset.width} × {preset.height}px
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mt-8">
          <ToolResultAd />
        </div>

        {/* 사용법 안내 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-900 mb-3">💡 사용법</h3>
            <ul className="text-sm text-green-700 space-y-2">
              <li>• 왼쪽에서 텍스트를 입력하고 스타일을 설정하세요</li>
              <li>• 프리셋 스타일로 빠르게 디자인을 적용할 수 있습니다</li>
              <li>• 오른쪽에서 실시간 미리보기를 확인하세요</li>
              <li>• 빠른 크기 설정으로 용도에 맞는 크기를 선택하세요</li>
              <li>• 완성된 이미지는 PNG 또는 JPEG로 다운로드 가능합니다</li>
            </ul>
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-orange-800 mb-3">💡 활용 팁</h3>
            <ul className="text-sm text-orange-700 space-y-2">
              <li>• 줄바꿈(Enter)으로 여러 줄 텍스트를 만들 수 있습니다</li>
              <li>• PNG 형식은 투명 배경을 지원합니다</li>
              <li>• JPEG 형식은 파일 크기가 더 작습니다</li>
              <li>• 여백 조정으로 텍스트 주변 공간을 조절하세요</li>
              <li>• 높은 해상도로 설정하면 더 선명한 이미지를 얻을 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}