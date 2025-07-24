'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

// metadata는 layout.tsx에서 관리됩니다

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

// Pantone 색상 데이터 (주요 색상들)
const pantoneColors = [
  { name: 'PANTONE 100 C', hex: '#F6E27F' },
  { name: 'PANTONE 101 C', hex: '#F7E859' },
  { name: 'PANTONE 102 C', hex: '#FDE300' },
  { name: 'PANTONE 103 C', hex: '#C5A900' },
  { name: 'PANTONE 104 C', hex: '#AC9A00' },
  { name: 'PANTONE 105 C', hex: '#867A00' },
  { name: 'PANTONE 106 C', hex: '#F9E526' },
  { name: 'PANTONE 107 C', hex: '#FBDD40' },
  { name: 'PANTONE 108 C', hex: '#F9D71C' },
  { name: 'PANTONE 109 C', hex: '#F9D616' },
  { name: 'PANTONE 110 C', hex: '#DAAA00' },
  { name: 'PANTONE 111 C', hex: '#AA8A00' },
  { name: 'PANTONE 112 C', hex: '#9C8412' },
  { name: 'PANTONE 113 C', hex: '#FAD000' },
  { name: 'PANTONE 114 C', hex: '#F8CC00' },
  { name: 'PANTONE 115 C', hex: '#F8CC00' },
  { name: 'PANTONE 116 C', hex: '#FFCD00' },
  { name: 'PANTONE 117 C', hex: '#C99700' },
  { name: 'PANTONE 118 C', hex: '#AC8400' },
  { name: 'PANTONE 119 C', hex: '#897322' },
  { name: 'PANTONE 120 C', hex: '#F8D568' },
  { name: 'PANTONE 121 C', hex: '#FAD15C' },
  { name: 'PANTONE 122 C', hex: '#FED141' },
  { name: 'PANTONE 123 C', hex: '#FFC72C' },
  { name: 'PANTONE 124 C', hex: '#EEAA00' },
  { name: 'PANTONE 125 C', hex: '#B58500' },
  { name: 'PANTONE 126 C', hex: '#A17A00' },
  { name: 'PANTONE 127 C', hex: '#F3DD6D' },
  { name: 'PANTONE 128 C', hex: '#F7D54A' },
  { name: 'PANTONE 129 C', hex: '#F3D03E' },
  { name: 'PANTONE 130 C', hex: '#F2A900' },
  { name: 'PANTONE 131 C', hex: '#CC8A00' },
  { name: 'PANTONE 132 C', hex: '#A07400' },
  { name: 'PANTONE 133 C', hex: '#6C571B' },
  { name: 'PANTONE Red 032 C', hex: '#EF3340' },
  { name: 'PANTONE Warm Red C', hex: '#F9423A' },
  { name: 'PANTONE 185 C', hex: '#E4002B' },
  { name: 'PANTONE 186 C', hex: '#C8102E' },
  { name: 'PANTONE 187 C', hex: '#A6192E' },
  { name: 'PANTONE 188 C', hex: '#76232F' },
  { name: 'PANTONE 199 C', hex: '#D50032' },
  { name: 'PANTONE 200 C', hex: '#BA0C2F' },
  { name: 'PANTONE 201 C', hex: '#9D2235' },
  { name: 'PANTONE 202 C', hex: '#862633' },
  { name: 'PANTONE Process Blue C', hex: '#0085CA' },
  { name: 'PANTONE 279 C', hex: '#418FDE' },
  { name: 'PANTONE 285 C', hex: '#0072CE' },
  { name: 'PANTONE 286 C', hex: '#0033A0' },
  { name: 'PANTONE 287 C', hex: '#003087' },
  { name: 'PANTONE 288 C', hex: '#002D72' },
  { name: 'PANTONE 289 C', hex: '#002A5C' },
  { name: 'PANTONE 290 C', hex: '#B5DDE6' },
  { name: 'PANTONE 291 C', hex: '#9BCBEB' },
  { name: 'PANTONE 292 C', hex: '#69B3E7' },
  { name: 'PANTONE 293 C', hex: '#003CA6' },
  { name: 'PANTONE 294 C', hex: '#002F6C' },
  { name: 'PANTONE 295 C', hex: '#002855' },
  { name: 'PANTONE 296 C', hex: '#041E42' },
  { name: 'PANTONE Green C', hex: '#00B388' },
  { name: 'PANTONE 347 C', hex: '#009A44' },
  { name: 'PANTONE 348 C', hex: '#00843D' },
  { name: 'PANTONE 349 C', hex: '#046A38' },
  { name: 'PANTONE 350 C', hex: '#2C5234' },
  { name: 'PANTONE 354 C', hex: '#00B140' },
  { name: 'PANTONE 355 C', hex: '#009739' },
  { name: 'PANTONE 356 C', hex: '#007A33' },
  { name: 'PANTONE 357 C', hex: '#215732' },
  { name: 'PANTONE Violet C', hex: '#440099' },
  { name: 'PANTONE 2685 C', hex: '#56158C' },
  { name: 'PANTONE 2695 C', hex: '#4E2882' },
  { name: 'PANTONE Orange 021 C', hex: '#FE5000' },
  { name: 'PANTONE 165 C', hex: '#FF671F' },
  { name: 'PANTONE 166 C', hex: '#E35205' },
  { name: 'PANTONE Black C', hex: '#000000' },
  { name: 'PANTONE Cool Gray 1 C', hex: '#D9D9D6' },
  { name: 'PANTONE Cool Gray 5 C', hex: '#B1B3B3' },
  { name: 'PANTONE Cool Gray 9 C', hex: '#75787B' },
  { name: 'PANTONE Cool Gray 11 C', hex: '#53565A' },
];

export default function ColorConverterPage() {
  const [colorValues, setColorValues] = useState<ColorValues>({
    hex: '#FF6B6B',
    rgb: { r: 255, g: 107, b: 107 },
    hsl: { h: 0, s: 100, l: 71 },
    cmyk: { c: 0, m: 58, y: 58, k: 0 }
  });

  const [inputMode, setInputMode] = useState<'hex' | 'rgb' | 'hsl'>('hex');

  // HEX to RGB 변환
  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  // RGB to HEX 변환
  const rgbToHex = (r: number, g: number, b: number): string => {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
  };

  // RGB to HSL 변환
  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  };

  // HSL to RGB 변환
  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number): number => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  };

  // RGB to CMYK 변환
  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r = r / 255;
    g = g / 255;
    b = b / 255;

    const k = 1 - Math.max(r, Math.max(g, b));
    const c = (1 - r - k) / (1 - k) || 0;
    const m = (1 - g - k) / (1 - k) || 0;
    const y = (1 - b - k) / (1 - k) || 0;

    return {
      c: Math.round(c * 100),
      m: Math.round(m * 100),
      y: Math.round(y * 100),
      k: Math.round(k * 100)
    };
  };

  // 색상 업데이트
  const updateColor = (newRgb: { r: number; g: number; b: number }) => {
    const hex = rgbToHex(newRgb.r, newRgb.g, newRgb.b);
    const hsl = rgbToHsl(newRgb.r, newRgb.g, newRgb.b);
    const cmyk = rgbToCmyk(newRgb.r, newRgb.g, newRgb.b);

    setColorValues({
      hex,
      rgb: newRgb,
      hsl,
      cmyk
    });
  };

  // HEX 입력 처리
  const handleHexChange = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      updateColor(rgb);
    } else {
      setColorValues(prev => ({ ...prev, hex }));
    }
  };

  // RGB 입력 처리
  const handleRgbChange = (component: 'r' | 'g' | 'b', value: number) => {
    const newRgb = { ...colorValues.rgb, [component]: Math.max(0, Math.min(255, value)) };
    updateColor(newRgb);
  };

  // HSL 입력 처리
  const handleHslChange = (component: 'h' | 's' | 'l', value: number) => {
    const newHsl = { ...colorValues.hsl };
    
    if (component === 'h') {
      newHsl.h = Math.max(0, Math.min(360, value));
    } else {
      newHsl[component] = Math.max(0, Math.min(100, value));
    }

    const rgb = hslToRgb(newHsl.h, newHsl.s, newHsl.l);
    updateColor(rgb);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // 가장 가까운 Pantone 색상 찾기
  const findClosestPantone = () => {
    let closestColor = pantoneColors[0];
    let minDistance = Infinity;

    pantoneColors.forEach(pantone => {
      const pantoneRgb = hexToRgb(pantone.hex);
      if (pantoneRgb) {
        const distance = Math.sqrt(
          Math.pow(colorValues.rgb.r - pantoneRgb.r, 2) +
          Math.pow(colorValues.rgb.g - pantoneRgb.g, 2) +
          Math.pow(colorValues.rgb.b - pantoneRgb.b, 2)
        );
        if (distance < minDistance) {
          minDistance = distance;
          closestColor = pantone;
        }
      }
    });

    return closestColor;
  };

  const closestPantone = findClosestPantone();

  // 미리 정의된 색상 팔레트
  const colorPalette = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57',
    '#FF9FF3', '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43',
    '#222F3E', '#2F3542', '#40739E', '#487EB0', '#8C7AE6',
    '#E17055', '#FDCB6E', '#6C5CE7', '#A29BFE', '#FD79A8'
  ];

  const currentColor = `rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`;

  return (
    <ToolLayout toolId="color-converter">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🎨 컬러 컨버터
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            RGB, HEX, HSL, CMYK 색상 변환 도구 - 실시간 미리보기 지원
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ 실시간 변환</span>
            <span>•</span>
            <span>✓ 색상 미리보기</span>
            <span>•</span>
            <span>✓ PANTONE 근사치</span>
            <span>•</span>
            <span>✓ 클릭 복사</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 색상 미리보기 */}
          <div className="space-y-6">
            {/* 메인 색상 미리보기 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">🎯 색상 미리보기</h2>
              <div 
                className="w-full h-48 rounded-lg border-2 border-gray-300 shadow-inner mb-4"
                style={{ backgroundColor: currentColor }}
              ></div>
              
              {/* 색상 정보 요약 */}
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-800 font-semibold">HEX:</span>
                    <span className="font-mono font-bold ml-1 text-gray-900">{colorValues.hex}</span>
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold">RGB:</span>
                    <span className="font-mono font-bold ml-1 text-gray-900">
                      {colorValues.rgb.r}, {colorValues.rgb.g}, {colorValues.rgb.b}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold">HSL:</span>
                    <span className="font-mono font-bold ml-1 text-gray-900">
                      {colorValues.hsl.h}°, {colorValues.hsl.s}%, {colorValues.hsl.l}%
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-800 font-semibold">CMYK:</span>
                    <span className="font-mono font-bold ml-1 text-gray-900">
                      {colorValues.cmyk.c}, {colorValues.cmyk.m}, {colorValues.cmyk.y}, {colorValues.cmyk.k}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* PANTONE 근사치 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 가장 가까운 PANTONE® 색상</h3>
              <div className="flex items-center space-x-4">
                <div 
                  className="w-20 h-20 rounded-lg border-2 border-gray-300"
                  style={{ backgroundColor: closestPantone.hex }}
                ></div>
                <div>
                  <div className="font-bold text-lg text-gray-900">{closestPantone.name}</div>
                  <div className="text-gray-800 font-semibold">{closestPantone.hex}</div>
                  <div className="text-sm text-gray-700 mt-1">* 근사치이며 정확한 색상은 실제 견본을 참조하세요</div>
                </div>
              </div>
            </div>

            {/* 색상 팔레트 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🎨 색상 팔레트</h3>
              <div className="grid grid-cols-5 gap-3">
                {colorPalette.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleHexChange(color)}
                    className="aspect-square rounded-lg border-2 border-gray-300 hover:border-gray-400 hover:scale-105 transition-all duration-200 shadow-sm"
                    style={{ backgroundColor: color }}
                    title={color}
                  ></button>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 색상 입력 */}
          <div className="space-y-6">
            {/* 입력 모드 선택 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ 색상 입력</h2>
              
              <div className="flex mb-6">
                <div className="bg-gray-100 p-1 rounded-lg flex">
                  {(['hex', 'rgb', 'hsl'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setInputMode(mode)}
                      className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                        inputMode === mode
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-blue-600'
                      }`}
                    >
                      {mode.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* HEX 입력 */}
              {inputMode === 'hex' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      HEX 색상 코드
                    </label>
                    <div className="flex">
                      <input
                        type="text"
                        value={colorValues.hex}
                        onChange={(e) => handleHexChange(e.target.value)}
                        placeholder="#FF6B6B"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono placeholder:text-gray-600 placeholder:opacity-100 text-gray-900 font-medium"
                      />
                      <button
                        onClick={() => copyToClipboard(colorValues.hex)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 transition-colors"
                        title="복사"
                        aria-label="HEX 색상 코드를 클립보드에 복사"
                      >
                        📋
                      </button>
                    </div>
                  </div>
                  
                  {/* 색상 피커 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      색상 선택
                    </label>
                    <input
                      type="color"
                      value={colorValues.hex}
                      onChange={(e) => handleHexChange(e.target.value)}
                      className="w-full h-12 border border-gray-300 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* RGB 입력 */}
              {inputMode === 'rgb' && (
                <div className="space-y-4">
                  {(['r', 'g', 'b'] as const).map((component) => (
                    <div key={component}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {component.toUpperCase()} (0-255)
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="255"
                          value={colorValues.rgb[component]}
                          onChange={(e) => handleRgbChange(component, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min="0"
                          max="255"
                          value={colorValues.rgb[component]}
                          onChange={(e) => handleRgbChange(component, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-mono text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <button
                      onClick={() => copyToClipboard(`rgb(${colorValues.rgb.r}, ${colorValues.rgb.g}, ${colorValues.rgb.b})`)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📋 RGB 값 복사
                    </button>
                  </div>
                </div>
              )}

              {/* HSL 입력 */}
              {inputMode === 'hsl' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      H - 색조 (0-360°)
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={colorValues.hsl.h}
                        onChange={(e) => handleHslChange('h', parseInt(e.target.value))}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min="0"
                        max="360"
                        value={colorValues.hsl.h}
                        onChange={(e) => handleHslChange('h', parseInt(e.target.value) || 0)}
                        className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-mono"
                      />
                    </div>
                  </div>

                  {(['s', 'l'] as const).map((component) => (
                    <div key={component}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {component.toUpperCase()} - {component === 's' ? '채도' : '명도'} (0-100%)
                      </label>
                      <div className="flex items-center space-x-4">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={colorValues.hsl[component]}
                          onChange={(e) => handleHslChange(component, parseInt(e.target.value))}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={colorValues.hsl[component]}
                          onChange={(e) => handleHslChange(component, parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-center font-mono text-gray-900 font-medium"
                        />
                      </div>
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <button
                      onClick={() => copyToClipboard(`hsl(${colorValues.hsl.h}, ${colorValues.hsl.s}%, ${colorValues.hsl.l}%)`)}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      📋 HSL 값 복사
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* CMYK 값 (읽기 전용) */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">🖨️ CMYK 값</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(colorValues.cmyk).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-sm text-gray-600 uppercase">{key}</div>
                    <div className="text-2xl font-bold text-gray-900">{value}%</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => copyToClipboard(`cmyk(${colorValues.cmyk.c}%, ${colorValues.cmyk.m}%, ${colorValues.cmyk.y}%, ${colorValues.cmyk.k}%)`)}
                className="w-full mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                📋 CMYK 값 복사
              </button>
            </div>
          </div>
        </div>

        {/* 광고 영역 */}
        <div className="mt-8">
          <ToolResultAd />
        </div>

        {/* 색상 정보 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 색상 모델 설명</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• <strong>HEX</strong>: 웹에서 가장 많이 사용되는 16진수 색상 코드</li>
              <li>• <strong>RGB</strong>: 빨강, 초록, 파랑의 조합 (모니터 색상)</li>
              <li>• <strong>HSL</strong>: 색조, 채도, 명도로 직관적인 색상 표현</li>
              <li>• <strong>CMYK</strong>: 인쇄용 색상 모델 (청록, 자홍, 노랑, 검정)</li>
              <li>• <strong>PANTONE</strong>: 표준화된 색상 시스템 (근사치 제공)</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">🎯 사용 팁</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• 웹 디자인: HEX 또는 RGB 사용</li>
              <li>• 인쇄물: CMYK 값 참고</li>
              <li>• 색상 조화: HSL로 색조를 조절하여 유사색 생성</li>
              <li>• 접근성: 명도(L) 값으로 대비 확인</li>
              <li>• PANTONE: 정확한 색상은 실제 인쇄 견본 확인 필요</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}