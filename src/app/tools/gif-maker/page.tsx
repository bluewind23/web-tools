'use client';

import { useState, useRef, useEffect } from 'react';
import Script from 'next/script';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';
import { trackEvent } from '@/components/GoogleAnalytics';
import GIF from 'gif.js';

// metadata는 layout.tsx에서 관리됩니다

interface Frame {
  id: string;
  image: string;
  element: HTMLImageElement;
}

export default function GifMakerPage() {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isWorking, setIsWorking] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [generatedGif, setGeneratedGif] = useState<string>('');

  const [fps, setFps] = useState(10);
  const [quality, setQuality] = useState(10);
  const [loop, setLoop] = useState(0);
  const [isPixelated, setIsPixelated] = useState(false);
  const [targetSize, setTargetSize] = useState('');
  const [optionsLocked, setOptionsLocked] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [makeBgTransparent, setMakeBgTransparent] = useState(false);
  // [추가] 크기 고정 옵션 상태
  const [fixDimensions, setFixDimensions] = useState(true);

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [gifProgress, setGifProgress] = useState(0);
  const [showFrameEditor, setShowFrameEditor] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 페이지 방문 추적
  useEffect(() => {
    trackEvent('page_view', 'tool_usage', 'gif_maker');
  }, []);

  // extractVideoFrames, addFramesFromFiles 등 다른 함수들은 변경 없이 그대로 유지됩니다.
  const extractVideoFrames = async (file: File): Promise<Frame[]> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const frames: Frame[] = [];
        const duration = video.duration;
        const frameInterval = Math.max(0.1, duration / 30);
        let currentTime = 0;
        let frameCount = 0;
        const totalFrames = Math.ceil(duration / frameInterval);

        const extractFrame = () => {
          if (currentTime >= duration) {
            setUploadProgress(100);
            setIsUploading(false);
            resolve(frames);
            return;
          }

          video.currentTime = currentTime;
          video.onseeked = () => {
            if (ctx) {
              ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

              const img = new Image();
              img.src = dataUrl;
              img.onload = () => {
                const frame: Frame = {
                  id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
                  image: dataUrl,
                  element: img,
                };
                frames.push(frame);
                frameCount++;
                setUploadProgress(Math.round((frameCount / totalFrames) * 100));
                currentTime += frameInterval;
                extractFrame();
              };
            }
          };
        };
        extractFrame();
      };
      video.onerror = () => reject(new Error('비디오 로드 실패'));
      video.src = URL.createObjectURL(file);
    });
  };

  const addFramesFromFiles = async (files: FileList) => {
    const MAX_SIZE = 20 * 1024 * 1024;
    const totalSize = Array.from(files).reduce((acc, file) => acc + file.size, 0);
    if (totalSize > MAX_SIZE) {
      alert(`파일 총 용량이 20MB를 초과할 수 없습니다. (현재: ${(totalSize / (1024 * 1024)).toFixed(1)}MB)`);
      return;
    }

    const fileArray = Array.from(files);
    const totalFiles = fileArray.length;
    let processedFiles = 0;

    setIsUploading(true);
    setUploadProgress(0);

    for (const file of fileArray) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const img = new Image();
          img.src = e.target?.result as string;
          img.onload = () => {
            const newFrame: Frame = {
              id: Date.now().toString() + Math.random().toString(36).substring(2, 11),
              image: e.target?.result as string,
              element: img,
            };
            setFrames(prev => [...prev, newFrame]);
            processedFiles++;
            setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
            if (processedFiles === totalFiles) {
              setIsUploading(false);
              setShowFrameEditor(false);
            }
          };
          img.onerror = () => {
            console.error('이미지 로딩 실패:', file.name);
            processedFiles++;
            setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
            if (processedFiles === totalFiles) {
              setIsUploading(false);
              setShowFrameEditor(false);
              alert('일부 이미지를 로딩하지 못했습니다.');
            }
          };
        };
        reader.onerror = () => {
          console.error('파일 읽기 실패:', file.name);
          processedFiles++;
          setUploadProgress(Math.round((processedFiles / totalFiles) * 100));
          if (processedFiles === totalFiles) {
            setIsUploading(false);
            alert('일부 파일을 읽지 못했습니다.');
          }
        };
        reader.readAsDataURL(file);
      } else if (file.type.startsWith('video/')) {
        try {
          setStatusMessage('비디오에서 프레임 추출 중...');
          const videoFrames = await extractVideoFrames(file);
          setFrames(prev => [...prev, ...videoFrames]);
          setStatusMessage('');
          processedFiles++;
          setShowFrameEditor(false);
        } catch {
          alert('비디오 처리 중 오류가 발생했습니다.');
          setStatusMessage('');
          setIsUploading(false);
        }
      }
    }
  };

  const createGif = async () => {
    if (frames.length < 1) {
      alert('GIF를 만들려면 최소 1개 이상의 프레임이 필요합니다.');
      return;
    }

    if (!frames[0].element || !frames[0].element.width || !frames[0].element.height) {
      alert('프레임 이미지가 올바르게 로드되지 않았습니다. 다시 시도해주세요.');
      return;
    }

    setIsWorking(true);
    setGeneratedGif('');
    setGifProgress(0);

    const targetKb = parseInt(targetSize, 10);

    try {
      if (targetKb > 0) {
        setStatusMessage('목표 용량에 맞춰 최적화 중...');
        // [수정] 최적화 함수에 fixDimensions 상태 전달
        const blob = await renderAndAdjustGif(frames, targetKb, fixDimensions, (progress) => {
          setGifProgress(progress);
        });
        setGeneratedGif(URL.createObjectURL(blob));
        setStatusMessage('GIF 최적화 완료!');
      } else {
        // 일반 GIF 생성 로직 (변경 없음)
        setStatusMessage('GIF 생성 중...');
        const gifOptions = {
          workerScript: '/gif.worker.js',
          workers: 2,
          quality,
          width: frames[0].element.width,
          height: frames[0].element.height,
          repeat: loop,
          transparent: makeBgTransparent ? '#FFFFFF' : null,
        };
        const gif = new GIF(gifOptions);
        const frameDelay = 1000 / fps;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        for (const frame of frames) {
          let elementToProcess: HTMLImageElement | HTMLCanvasElement = frame.element;
          if (isPixelated && tempCtx) {
            const w = frame.element.width, h = frame.element.height;
            tempCanvas.width = w; tempCanvas.height = h;
            tempCtx.imageSmoothingEnabled = false;
            tempCtx.drawImage(frame.element, 0, 0, w * 0.25, h * 0.25);
            tempCtx.drawImage(tempCanvas, 0, 0, w * 0.25, h * 0.25, 0, 0, w, h);
            elementToProcess = tempCanvas;
          }
          gif.addFrame(elementToProcess, { delay: frameDelay });
        }
        gif.on('progress', (p: number) => setGifProgress(Math.round(p * 100)));
        gif.on('finished', (blob: Blob) => {
          setGeneratedGif(URL.createObjectURL(blob));
          setStatusMessage('GIF 생성 완료!');
          setGifProgress(100);
          setIsWorking(false);
          
          // Google Analytics 이벤트 추적
          trackEvent('gif_created', 'tool_usage', 'gif_maker', frames.length);
        });
        gif.on('abort', () => {
          setStatusMessage('GIF 생성이 중단되었습니다.');
          setIsWorking(false);
        });
        gif.render();
      }
    } catch (error) {
      console.error('GIF 생성 실패:', error);
      alert(error instanceof Error ? error.message : 'GIF 생성 중 오류가 발생했습니다.');
      setStatusMessage('GIF 생성 실패');
      setIsWorking(false);
    }
  };

  // [수정] '크기 고정' 옵션을 처리하도록 개선된 최적화 함수
  const renderAndAdjustGif = (frames: Frame[], targetKb: number, fixDimensions: boolean, onProgress: (progress: number) => void): Promise<Blob> => {
    return new Promise(async (resolve, reject) => {
      try {
      const targetBytes = targetKb * 1024;
      const originalWidth = frames[0].element.width;
      const originalHeight = frames[0].element.height;

      let attempts: { scale?: number, quality: number, fps?: number }[];

      if (fixDimensions) {
        // 크기 고정: FPS와 품질 조절
        setStatusMessage('최적화 중 (크기 고정)...');
        attempts = [
          { quality: 5, fps: 15 }, { quality: 10, fps: 15 }, { quality: 15, fps: 15 },
          { quality: 10, fps: 10 }, { quality: 15, fps: 10 }, { quality: 20, fps: 10 },
          { quality: 15, fps: 7 }, { quality: 25, fps: 7 }, { quality: 30, fps: 5 },
        ];
      } else {
        // 크기 유동: 스케일과 품질 조절
        setStatusMessage('최적화 중 (크기 조절)...');
        attempts = [
          { scale: 1.0, quality: 10 }, { scale: 1.0, quality: 20 }, { scale: 0.8, quality: 10 },
          { scale: 0.8, quality: 20 }, { scale: 0.6, quality: 10 }, { scale: 0.6, quality: 20 },
        ];
      }

      const totalAttempts = attempts.length;

      for (let i = 0; i < totalAttempts; i++) {
        const attempt = attempts[i];
        const currentScale = fixDimensions ? 1.0 : (attempt.scale || 1.0);
        const currentFps = fixDimensions ? (attempt.fps || 10) : fps;
        const width = Math.round(originalWidth * currentScale);
        const height = Math.round(originalHeight * currentScale);

        const progressMsg = fixDimensions
          ? `(FPS: ${currentFps}, 품질: ${attempt.quality})`
          : `(크기: ${Math.round(currentScale * 100)}%, 품질: ${attempt.quality})`;
        setStatusMessage(`최적화 중... ${progressMsg}`);
        onProgress(Math.round((i / totalAttempts) * 100));

        const gifOptions = {
          workerScript: '/gif.worker.js',
          workers: 2,
          quality: attempt.quality,
          width,
          height,
          repeat: loop,
          transparent: makeBgTransparent ? '#FFFFFF' : null,
        };
        const gif = new GIF(gifOptions);
        const frameDelay = 1000 / currentFps;
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });

        if (tempCtx) {
          tempCanvas.width = width; tempCanvas.height = height;
          for (const frame of frames) {
            tempCtx.clearRect(0, 0, width, height);
            if (isPixelated) {
              tempCtx.imageSmoothingEnabled = false;
              const pw = width * 0.25, ph = height * 0.25;
              tempCtx.drawImage(frame.element, 0, 0, pw, ph);
              tempCtx.drawImage(tempCanvas, 0, 0, pw, ph, 0, 0, width, height);
            } else {
              tempCtx.imageSmoothingEnabled = true;
              tempCtx.drawImage(frame.element, 0, 0, width, height);
            }
            gif.addFrame(tempCanvas, { copy: true, delay: frameDelay });
          }
        }

        const blob = await new Promise<Blob>((resolveBlob, rejectBlob) => {
          const timeout = setTimeout(() => {
            rejectBlob(new Error('GIF 생성 시간 초과 (30초)'));
          }, 30000);

          gif.on('progress', (p: number) => {
            const baseProgress = (i / totalAttempts) * 100;
            const attemptProgress = p * (100 / totalAttempts);
            onProgress(Math.round(baseProgress + attemptProgress));
          });
          
          gif.on('finished', (b: Blob) => {
            clearTimeout(timeout);
            resolveBlob(b);
          });
          
          gif.on('abort', () => {
            clearTimeout(timeout);
            rejectBlob(new Error('GIF 생성이 중단되었습니다.'));
          });
          
          try {
            gif.render();
          } catch (err) {
            clearTimeout(timeout);
            rejectBlob(err instanceof Error ? err : new Error('GIF 렌더링 실패'));
          }
        });

        if (blob.size <= targetBytes) {
          console.log(`최적화 성공: 최종 용량 ${(blob.size / 1024).toFixed(1)}KB`);
          onProgress(100);
          resolve(blob);
          return;
        }
      }
      reject(new Error(`목표 용량(${targetKb}KB)을 맞출 수 없었습니다.`));
      } catch (error) {
        console.error('최적화 중 오류:', error);
        reject(error instanceof Error ? error : new Error('GIF 최적화 중 오류가 발생했습니다.'));
      }
    });
  };


  // 이하 다른 함수 및 return JSX 부분입니다.
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => { if (event.target.files) { addFramesFromFiles(event.target.files); } };
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(true); };
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); };
  const handleDrop = (e: React.DragEvent) => { e.preventDefault(); setIsDragOver(false); if (e.dataTransfer.files.length > 0) { addFramesFromFiles(e.dataTransfer.files); } };
  const removeFrame = (id: string) => { setFrames(prev => prev.filter(frame => frame.id !== id)); };
  const moveFrame = (id: string, direction: 'up' | 'down') => { setFrames(prev => { const index = prev.findIndex(f => f.id === id); if (index === -1) return prev; const newIndex = direction === 'up' ? index - 1 : index + 1; if (newIndex < 0 || newIndex >= prev.length) return prev; const newFrames = [...prev];[newFrames[index], newFrames[newIndex]] = [newFrames[newIndex], newFrames[index]]; return newFrames; }); };
  const clearAll = () => { setFrames([]); setGeneratedGif(''); };
  const downloadGif = () => { if (generatedGif) { const link = document.createElement('a'); link.href = generatedGif; link.download = `animated-gif-${Date.now()}.gif`; link.click(); } };

  return (
    <>
      <Script
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5809883478660758"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      <ToolLayout toolId="gif-maker">
      <div className="text-center mb-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">🎬 GIF 제작 툴</h1>
        <p className="text-lg text-gray-600 mb-6">이미지/비디오를 업로드하여 애니메이션 GIF 생성</p>
      </div>
      <div className="space-y-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">📁 파일 업로드</h2>
          <div className="space-y-4">
            <input ref={fileInputRef} type="file" multiple accept="image/*,video/*" onChange={handleFileUpload} className="hidden" />
            <div onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} onClick={() => fileInputRef.current?.click()} className={`w-full min-h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'} ${isUploading ? 'pointer-events-none opacity-50' : ''}`}>
              {isUploading ? (
                <div className="space-y-3"><span className="text-2xl">⏳</span><div><div className="text-lg font-medium text-gray-800">업로드 중...</div><div className="text-sm text-gray-600">{statusMessage || `${uploadProgress}% 완료`}</div></div><div className="w-64 bg-gray-200 rounded-full h-2"><div className="bg-blue-500 h-2 rounded-full" style={{ width: `${uploadProgress}%` }}></div></div></div>
              ) : (
                <div className="space-y-2"><span className="text-4xl">{isDragOver ? '📂' : '📷'}</span><div><div className="text-lg font-medium text-gray-800">{isDragOver ? '여기에 파일을 놓으세요' : '클릭하거나 드래그하여 파일 선택'}</div><div className="text-sm text-gray-600">이미지/MP4 지원, 총 20MB 이하</div></div></div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">⚙️ GIF 옵션 설정</h2>

          {/* [수정] 간편 설정 UI 레이아웃 변경 */}
          <div className="space-y-4 p-4 border bg-gray-50 border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800">간편 설정</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 좌측: 품질 프리셋 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">품질 프리셋</label>
                <div className="flex space-x-2">
                  <button onClick={() => setQuality(20)} disabled={optionsLocked} className="flex-1 px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700">저용량</button>
                  <button onClick={() => setQuality(10)} disabled={optionsLocked} className="flex-1 px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700">중간</button>
                  <button onClick={() => setQuality(1)} disabled={optionsLocked} className="flex-1 px-3 py-2 text-sm bg-white border rounded-lg hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-700">고화질</button>
                </div>
              </div>
              {/* 우측: 루프 및 투명 배경 */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">루프</label>
                  <select value={loop} onChange={e => setLoop(parseInt(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800">
                    <option value="0">무한 반복</option>
                    <option value="-1">반복 안함</option>
                    <option value="1">1회 반복</option>
                    <option value="3">3회 반복</option>
                  </select>
                </div>
                <div className="flex items-center pt-2">
                  <input type="checkbox" id="transparent-bg" checked={makeBgTransparent} onChange={e => setMakeBgTransparent(e.target.checked)} className="w-4 h-4 mr-2" />
                  <label htmlFor="transparent-bg" className="text-sm font-medium text-gray-700">흰색 배경 투명하게 만들기</label>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            {/* [수정] '정밀 옵션' -> '상세 옵션'으로 이름 변경 */}
            <button onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center text-sm text-blue-600 font-medium">
              <span>상세 옵션 {showAdvanced ? '숨기기' : '열기'}</span>
              <svg className={`w-4 h-4 ml-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>

            {showAdvanced && (
              <div className="mt-4 p-4 border border-gray-200 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">

                {/* [이동] 최종 용량 설정 옵션을 상세 옵션으로 이동 */}
                <div className="col-span-1 md:col-span-2 border-b border-gray-200 pb-4 mb-2">
                  <label htmlFor="targetSize" className="block text-sm font-semibold text-gray-700 mb-2">최종 용량 (KB)</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <input 
                        id="targetSize" 
                        type="number" 
                        min="0"
                        value={targetSize} 
                        onChange={(e) => { 
                          const value = e.target.value;
                          // 마이너스 값 방지
                          if (value === '' || parseFloat(value) >= 0) {
                            setTargetSize(value); 
                            setOptionsLocked(!!value);
                          }
                        }} 
                        placeholder="예: 5120" 
                        className="w-48 px-3 py-2 border border-gray-300 rounded-lg placeholder:text-gray-600 text-gray-900 font-medium" 
                      />
                      <button 
                        onClick={() => { setTargetSize(''); setOptionsLocked(false); }} 
                        className="px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-lg text-sm transition-colors"
                      >
                        초기화
                      </button>
                    </div>
                    <div className="flex items-center group">
                      <input type="checkbox" id="fix-dimensions" checked={fixDimensions} onChange={e => setFixDimensions(e.target.checked)} disabled={!optionsLocked} className="w-4 h-4 mr-2 disabled:opacity-50" />
                      <label htmlFor="fix-dimensions" className={`text-sm font-medium ${!optionsLocked ? 'text-gray-400' : 'text-gray-700'} flex items-center`}>
                        크기(해상도) 고정
                        <span className="ml-1 relative">
                          <span className="cursor-help text-gray-500">❓</span>
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                            <div className="mb-2">
                              <strong>✓ 체크 시:</strong> 해상도는 유지하되, FPS와 색상 품질을 조절하여 용량을 맞춥니다. 화질 저하가 발생할 수 있습니다.
                            </div>
                            <div>
                              <strong>✗ 체크 해제 시:</strong> FPS와 품질을 우선시하며, 해상도를 줄여 용량을 맞춥니다.
                            </div>
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                              <div className="w-2 h-2 bg-gray-900 rotate-45"></div>
                            </div>
                          </div>
                        </span>
                      </label>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">용량 설정 시 아래 FPS/압축률 등은 자동 조절됩니다.</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">프레임 (FPS): {fps}</label>
                  <input type="range" min="1" max="30" value={fps} onChange={e => setFps(parseInt(e.target.value))} disabled={optionsLocked} className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">압축률 (높을수록 저용량): {quality}</label>
                  <input type="range" min="1" max="30" value={quality} onChange={e => setQuality(parseInt(e.target.value))} disabled={optionsLocked} className="w-full" />
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="pixel-art" checked={isPixelated} onChange={e => setIsPixelated(e.target.checked)} disabled={optionsLocked} className="w-4 h-4 mr-2" />
                  <label htmlFor="pixel-art" className="text-sm font-medium text-gray-700">픽셀 아트 스타일</label>
                </div>
              </div>
            )}
          </div>
        </div>

        {frames.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-4"><h2 className="text-xl font-semibold text-gray-900">🎞️ 프레임 편집</h2><span className="text-sm text-gray-500">({frames.length}개)</span></div>
              <div className="flex space-x-2"><button onClick={() => setShowFrameEditor(!showFrameEditor)} className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded-lg">{showFrameEditor ? '접기' : '펼치기'}</button><button onClick={clearAll} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg">모두 삭제</button></div>
            </div>
            {showFrameEditor && (
              <div className="bg-gray-50 p-3 rounded-lg"><div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 max-h-64 overflow-y-auto">
                {frames.map((frame, index) => (
                  <div key={frame.id} className="relative group">
                    <div className="border rounded p-1 bg-white"><img src={frame.image} alt={`프레임 ${index + 1}`} className="w-full h-12 object-cover rounded" 
                    // eslint-disable-next-line @next/next/no-img-element
                    /><div className="text-xs text-center text-gray-500 mt-1">#{index + 1}</div></div>
                    <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100"><div className="flex space-x-1">
                      <button onClick={() => moveFrame(frame.id, 'up')} disabled={index === 0} className="w-5 h-5 bg-blue-500 text-white rounded text-xs" title="위로" aria-label={`프레임 ${index + 1}을 위로 이동`}>↑</button>
                      <button onClick={() => moveFrame(frame.id, 'down')} disabled={index === frames.length - 1} className="w-5 h-5 bg-blue-500 text-white rounded text-xs" title="아래로" aria-label={`프레임 ${index + 1}을 아래로 이동`}>↓</button>
                      <button onClick={() => removeFrame(frame.id)} className="w-5 h-5 bg-red-500 text-white rounded text-xs" title="삭제" aria-label={`프레임 ${index + 1} 삭제`}>×</button>
                    </div></div>
                  </div>
                ))}
              </div></div>
            )}
            <div className="mt-6 text-center">
              <button onClick={createGif} disabled={isWorking} className="px-8 py-3 rounded-lg font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed" aria-label="GIF 파일 생성하기">
                {isWorking ? (<div className="flex items-center justify-center space-x-2"><span>{statusMessage || '생성 중...'}</span></div>) : '🎬 GIF 만들기'}
              </button>
              {isWorking && (
                <div className="mt-3 max-w-md mx-auto">
                  <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${gifProgress}%` }}></div></div>
                  <div className="text-sm text-gray-600 mt-1">진행률: {gifProgress}%</div>
                </div>
              )}
            </div>
          </div>
        )}
        {generatedGif && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-gray-900">🎉 완성된 GIF</h2><button onClick={downloadGif} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">💾 다운로드</button></div>
            <div className="text-center"><img src={generatedGif} alt="Generated GIF" className="max-w-full h-auto rounded-lg shadow-lg mx-auto" 
            // eslint-disable-next-line @next/next/no-img-element
            /></div>
          </div>
        )}
        {generatedGif && <ToolResultAd />}
      </div>
      </ToolLayout>
    </>
  );
}