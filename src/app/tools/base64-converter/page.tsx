'use client';



import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

// metadata는 layout.tsx에서 관리됩니다

// [추가] 유니코드 문자열을 안전하게 인코딩/디코딩하는 헬퍼 함수
// Uint8Array를 바이너리 문자열로 변환 (청크 처리로 스택 오버플로우 방지)
function uint8ArrayToBinaryString(uint8Array: Uint8Array): string {
  let binaryString = '';
  const chunkSize = 8192; // 8KB 청크
  for (let i = 0; i < uint8Array.length; i += chunkSize) {
    binaryString += String.fromCharCode.apply(null, Array.from(uint8Array.subarray(i, i + chunkSize)));
  }
  return binaryString;
}

// 바이너리 문자열을 Uint8Array로 변환
function binaryStringToUint8Array(binaryString: string): Uint8Array {
  const uint8Array = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    uint8Array[i] = binaryString.charCodeAt(i);
  }
  return uint8Array;
}

// 매직 넘버로 이미지 형식 감지
function detectImageFormat(uint8Array: Uint8Array): string | null {
  if (uint8Array.length < 4) return null;

  // PNG: 89 50 4E 47
  if (uint8Array[0] === 0x89 && uint8Array[1] === 0x50 &&
    uint8Array[2] === 0x4E && uint8Array[3] === 0x47) {
    return 'image/png';
  }

  // JPEG: FF D8 FF
  if (uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
    return 'image/jpeg';
  }

  // GIF: 47 49 46 38
  if (uint8Array[0] === 0x47 && uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 && uint8Array[3] === 0x38) {
    return 'image/gif';
  }

  // WebP: 52 49 46 46 ... 57 45 42 50
  if (uint8Array[0] === 0x52 && uint8Array[1] === 0x49 &&
    uint8Array[2] === 0x46 && uint8Array[3] === 0x46 &&
    uint8Array.length > 12 &&
    uint8Array[8] === 0x57 && uint8Array[9] === 0x45 &&
    uint8Array[10] === 0x42 && uint8Array[11] === 0x50) {
    return 'image/webp';
  }

  // BMP: 42 4D
  if (uint8Array[0] === 0x42 && uint8Array[1] === 0x4D) {
    return 'image/bmp';
  }

  return null;
}

export default function Base64ConverterPage() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [detectedImage, setDetectedImage] = useState<{ format: string, dataUrl: string } | null>(null);

  const handleEncode = () => {
    try {
      if (imageFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64 = reader.result as string;
          setOutput(base64);
        };
        reader.readAsDataURL(imageFile);
      } else {
        // [수정] 개선된 인코딩 로직 사용
        const uint8Array = new TextEncoder().encode(input);
        const binaryString = uint8ArrayToBinaryString(uint8Array);
        const encoded = btoa(binaryString);
        setOutput(encoded);
      }
    } catch {
      setOutput('인코딩 오류: 올바른 텍스트를 입력해주세요.');
    }
  };

  const handleDecode = () => {
    try {
      setDetectedImage(null); // 이전 감지 결과 초기화

      if (input.startsWith('data:image/')) {
        setImagePreview(input);
        setOutput('이미지가 미리보기에 표시됩니다.');
      } else {
        // [수정] 개선된 디코딩 로직 사용
        const binaryString = atob(input);
        const uint8Array = binaryStringToUint8Array(binaryString);

        // 이미지 형식 감지
        const imageFormat = detectImageFormat(uint8Array);
        if (imageFormat) {
          // 이미지로 감지된 경우
          const blob = new Blob([uint8Array], { type: imageFormat });
          const dataUrl = URL.createObjectURL(blob);
          setDetectedImage({ format: imageFormat, dataUrl });
          setOutput('디코딩된 데이터가 이미지로 감지되었습니다.');
        } else {
          // 텍스트로 디코딩
          const decoded = new TextDecoder().decode(uint8Array);
          setOutput(decoded);
        }
      }
    } catch {
      setOutput('디코딩 오류: 올바른 Base64 문자열을 입력해주세요.');
    }
  };

  const handleProcess = () => {
    if (mode === 'encode') {
      handleEncode();
    } else {
      handleDecode();
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const clearAll = () => {
    setInput('');
    setOutput('');
    setImageFile(null);
    setImagePreview('');
    setDetectedImage(null);
  };

  const showDetectedImagePreview = () => {
    if (detectedImage) {
      setImagePreview(detectedImage.dataUrl);
      setOutput('이미지가 미리보기에 표시됩니다.');
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setInput(`파일 선택됨: ${file.name} (${(file.size / 1024).toFixed(1)}KB)`);
      } else {
        alert('이미지 파일만 업로드 가능합니다.');
      }
    }
  };

  const downloadAsFile = () => {
    if (mode === 'decode' && imagePreview) {
      const link = document.createElement('a');
      link.href = imagePreview;
      link.download = `decoded-image-${Date.now()}.png`;
      link.click();
    } else {
      const blob = new Blob([output], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${mode === 'encode' ? 'encoded' : 'decoded'}-${Date.now()}.txt`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <ToolLayout toolId="base64-converter">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🔄 Base64 인코더/디코더
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            텍스트 및 이미지 Base64 인코딩/디코딩 도구
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ 텍스트 인코딩/디코딩</span>
            <span>•</span>
            <span>✓ 이미지 지원</span>
            <span>•</span>
            <span>✓ 파일 다운로드</span>
            <span>•</span>
            <span>✓ 한글 지원</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* 모드 선택 */}
          <div className="flex justify-center">
            <div className="bg-gray-100 p-1 rounded-lg flex">
              <button
                onClick={() => {
                  setMode('encode');
                  clearAll();
                }}
                className={`px-6 py-2 rounded-md transition-colors ${mode === 'encode'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-800 hover:text-blue-600 font-semibold'
                  }`}
              >
                🔒 인코딩
              </button>
              <button
                onClick={() => {
                  setMode('decode');
                  clearAll();
                }}
                className={`px-6 py-2 rounded-md transition-colors ${mode === 'decode'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-800 hover:text-blue-600 font-semibold'
                  }`}
              >
                🔓 디코딩
              </button>
            </div>
          </div>

          {/* [수정] grid -> flex 로 변경합니다. */}
          <div className="flex flex-col lg:flex-row gap-6">
            {/* [수정] 자식 div에 너비와 flex 관련 클래스를 추가합니다. */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {mode === 'encode' ? '원본 텍스트/이미지' : 'Base64 문자열'}
                </label>
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  🗑️ 초기화
                </button>
              </div>

              {mode === 'encode' && (
                <div className="mb-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg text-sm transition-colors inline-block"
                  >
                    📁 이미지 파일 선택
                  </label>
                  {imageFile && (
                    <div className="mt-2 text-sm text-gray-800 font-medium">
                      선택된 파일: {imageFile.name} ({(imageFile.size / 1024).toFixed(1)}KB)
                    </div>
                  )}
                </div>
              )}
              {/* [수정] h-64 대신 flex-grow를 사용하여 남은 공간을 채우도록 합니다. */}
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  mode === 'encode'
                    ? '인코딩할 텍스트를 입력하거나 위에서 이미지를 선택하세요...'
                    : '디코딩할 Base64 문자열을 입력하세요...'
                }
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none font-mono text-sm flex-grow"
                disabled={mode === 'encode' && !!imageFile}
              />

              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-gray-700 font-medium">
                  {input.length} 글자
                </div>
                <button
                  onClick={handleProcess}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  {mode === 'encode' ? '🔒 인코딩' : '🔓 디코딩'}
                </button>
              </div>
            </div>

            {/* 결과 영역 */}
            <div className="w-full lg:w-1/2 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  {mode === 'encode' ? 'Base64 결과' : '디코딩 결과'}
                </label>
                {output && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => copyToClipboard(output)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      📋 복사
                    </button>
                    <button
                      onClick={downloadAsFile}
                      className="text-sm text-green-600 hover:text-green-800"
                    >
                      💾 다운로드
                    </button>
                  </div>
                )}
              </div>

              {mode === 'decode' && imagePreview ? (
                <div className="border border-gray-300 rounded-lg p-4 h-64 overflow-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="Decoded"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              ) : (
                <textarea
                  value={output}
                  readOnly
                  placeholder="결과가 여기에 표시됩니다..."
                  className="w-full p-4 border border-gray-300 rounded-lg bg-gray-50 resize-none font-mono text-sm flex-grow"
                />
              )}

              <div className="text-sm text-gray-700 font-medium mt-2">
                {output.length} 글자
              </div>

              {/* 이미지 감지 알림 */}
              {detectedImage && !imagePreview && (
                <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800 mb-2">
                    🖼️ 디코딩된 데이터가 {detectedImage.format.toUpperCase()} 이미지로 감지되었습니다.
                  </p>
                  <button
                    onClick={showDetectedImagePreview}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm transition-colors"
                  >
                    미리보기로 보기
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* 광고 영역 */}
          {output && <ToolResultAd />}

          {/* 빠른 예제 */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">🎯 빠른 예제</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">인코딩 예제</h4>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => {
                      setMode('encode');
                      setInput('안녕하세요!');
                    }}
                    className="block w-full text-left p-2 bg-white rounded border hover:bg-blue-50"
                  >
                    <span className="text-gray-800 font-semibold">입력:</span> 안녕하세요!
                  </button>
                  <button
                    onClick={() => {
                      setMode('encode');
                      setInput('Hello World!');
                    }}
                    className="block w-full text-left p-2 bg-white rounded border hover:bg-blue-50"
                  >
                    <span className="text-gray-800 font-semibold">입력:</span> Hello World!
                  </button>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">디코딩 예제</h4>
                <div className="space-y-2 text-sm">
                  <button
                    onClick={() => {
                      setMode('decode');
                      setInput('7JWI64WV7ZWY7IS47JqU7Iq164uI64uk');
                    }}
                    className="block w-full text-left p-2 bg-white rounded border hover:bg-blue-50"
                  >
                    <span className="text-gray-800 font-semibold">입력:</span> 7JWI64WV7ZWY7IS47JqU7Iq164uI64uk
                  </button>
                  <button
                    onClick={() => {
                      setMode('decode');
                      setInput('SGVsbG8gV29ybGQh');
                    }}
                    className="block w-full text-left p-2 bg-white rounded border hover:bg-blue-50"
                  >
                    <span className="text-gray-800 font-semibold">입력:</span> SGVsbG8gV29ybGQh
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* 사용법 안내 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 Base64란?</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• <strong>Base64</strong>는 바이너리 데이터를 ASCII 문자로 변환하는 인코딩 방식입니다</li>
              <li>• 이메일, 웹에서 이미지나 파일을 텍스트로 전송할 때 사용됩니다</li>
              <li>• 한글 텍스트도 안전하게 인코딩/디코딩할 수 있습니다</li>
              <li>• 이미지 파일을 업로드하면 Data URL 형태로 변환됩니다</li>
              <li>• <strong>보안 용도가 아닙니다</strong> - 누구나 쉽게 디코딩할 수 있습니다</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}