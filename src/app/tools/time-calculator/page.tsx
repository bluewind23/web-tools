'use client';




import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

type CalculationMode = 'diff' | 'add' | 'dday';

export default function TimeCalculatorPage() {
  const [mode, setMode] = useState<CalculationMode>('diff');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [addDays, setAddDays] = useState(0);
  const [addHours, setAddHours] = useState(0);
  const [addMinutes, setAddMinutes] = useState(0);
  const [result, setResult] = useState<{
    type?: string;
    days?: number;
    hours?: number;
    minutes?: number;
    date?: string;
    totalDays?: number;
    totalHours?: number;
    totalMinutes?: number;
    totalSeconds?: number;
    periods?: { years: number; months: number; weeks: number };
    breakdown?: { days: number; hours: number; minutes: number; seconds: number };
    direction?: string;
    resultDate?: Date;
    originalDate?: Date;
    addedDays?: number;
    addedHours?: number;
    addedMinutes?: number;
    totalMinutesAdded?: number;
    isToday?: boolean;
    isPast?: boolean;
    daysLeft?: number;
    targetDate?: Date;
  } | null>(null);

  // 현재 날짜를 기본값으로 설정
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setStartDate(today);
    setEndDate(today);
    setTargetDate(today);
  }, []);

  // 날짜 차이 계산
  const calculateDateDiff = () => {
    if (!startDate || !endDate) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());

    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));
    const diffSeconds = Math.floor((diffTime % (1000 * 60)) / 1000);

    const weeks = Math.floor(diffDays / 7);
    const months = Math.floor(diffDays / 30.44); // 평균 한 달
    const years = Math.floor(diffDays / 365.25); // 평균 1년 (윤년 고려)

    setResult({
      type: 'diff',
      totalDays: diffDays,
      totalHours: Math.floor(diffTime / (1000 * 60 * 60)),
      totalMinutes: Math.floor(diffTime / (1000 * 60)),
      totalSeconds: Math.floor(diffTime / 1000),
      breakdown: {
        days: diffDays,
        hours: diffHours,
        minutes: diffMinutes,
        seconds: diffSeconds
      },
      periods: {
        years,
        months,
        weeks
      },
      direction: end > start ? 'future' : 'past'
    });
  };

  // 날짜 더하기/빼기 계산
  const calculateDateAdd = () => {
    if (!startDate) return;

    const start = new Date(startDate);
    const totalMinutes = (addDays * 24 * 60) + (addHours * 60) + addMinutes;

    const resultDate = new Date(start.getTime() + totalMinutes * 60 * 1000);

    setResult({
      type: 'add',
      originalDate: start,
      resultDate,
      addedDays: addDays,
      addedHours: addHours,
      addedMinutes: addMinutes,
      totalMinutesAdded: totalMinutes
    });
  };

  // D-Day 계산
  const calculateDDay = () => {
    if (!targetDate) return;

    const today = new Date();
    const target = new Date(targetDate);

    // 시간을 00:00:00으로 설정하여 날짜만 비교
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    // D-Day는 보통 올림 계산을 사용 (오늘이 목표일이면 D-Day)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    setResult({
      type: 'dday',
      targetDate: target,
      daysLeft: diffDays,
      isPast: diffDays < 0,
      isToday: diffDays === 0
    });
  };

  // 계산 실행
  const handleCalculate = () => {
    switch (mode) {
      case 'diff':
        calculateDateDiff();
        break;
      case 'add':
        calculateDateAdd();
        break;
      case 'dday':
        calculateDDay();
        break;
    }
  };

  // 날짜 차이 빠른 설정
  const quickSetDays = (days: number) => {
    const start = new Date(startDate);
    const futureDate = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    setEndDate(futureDate.toISOString().split('T')[0]);
  };

  // D-Day 빠른 설정
  const quickSetTarget = (days: number) => {
    const today = new Date();
    const futureDate = new Date(today.getTime() + days * 24 * 60 * 60 * 1000);
    setTargetDate(futureDate.toISOString().split('T')[0]);
  };

  const copyToClipboard = async () => {
    if (!result) return;

    let textToCopy = '';

    switch (result.type) {
      case 'diff':
        textToCopy = `날짜 차이 계산 결과:
- 총 ${result.totalDays?.toLocaleString() || 0}일
- 세부: ${result.periods?.years || 0}년 ${result.periods?.months || 0}개월 ${result.periods?.weeks || 0}주 ${result.breakdown?.days || 0}일
- 총 시간: ${result.totalHours?.toLocaleString() || 0}시간
- 총 분: ${result.totalMinutes?.toLocaleString() || 0}분
- 총 초: ${result.totalSeconds?.toLocaleString() || 0}초`;
        break;
      case 'add':
        textToCopy = `시간 더하기 계산 결과:
- 기준 날짜: ${result.originalDate?.toLocaleDateString('ko-KR')}
- 추가 시간: ${result.addedDays || 0}일 ${result.addedHours || 0}시간 ${result.addedMinutes || 0}분
- 결과 날짜: ${result.resultDate?.toLocaleDateString('ko-KR')} (${result.resultDate?.toLocaleDateString('ko-KR', { weekday: 'short' })})`;
        break;
      case 'dday':
        if (result.isToday) {
          textToCopy = `D-Day 계산 결과: 오늘입니다! (D-Day)
- 목표 날짜: ${result.targetDate?.toLocaleDateString('ko-KR')}`;
        } else if (result.isPast) {
          textToCopy = `D-Day 계산 결과: D+${Math.abs(result.daysLeft || 0)}일
- 목표 날짜: ${result.targetDate?.toLocaleDateString('ko-KR')}
- ${Math.abs(result.daysLeft || 0)}일 지났습니다.`;
        } else {
          textToCopy = `D-Day 계산 결과: D-${result.daysLeft || 0}
- 목표 날짜: ${result.targetDate?.toLocaleDateString('ko-KR')}
- ${result.daysLeft || 0}일 남았습니다.`;
        }
        break;
      default:
        textToCopy = JSON.stringify(result, null, 2);
    }
    
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = textToCopy;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다. 텍스트를 직접 선택하여 복사해주세요.');
    }
  };

  // 개별 항목 복사 함수
  const copyItemToClipboard = async (value: string) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = value;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        textArea.remove();
      }
    } catch (err) {
      console.error('클립보드 복사 실패:', err);
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  return (
    <ToolLayout toolId="time-calculator">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            ⏰ 시간 계산기
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            날짜 차이 계산, 시간 합산, D-Day 계산기
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ 날짜 차이 계산</span>
            <span>•</span>
            <span>✓ 시간 더하기/빼기</span>
            <span>•</span>
            <span>✓ D-Day 계산</span>
            <span>•</span>
            <span>✓ 다양한 단위</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* 모드 선택 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔧 계산 모드</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setMode('diff')}
                className={`p-4 rounded-lg border-2 transition-all ${mode === 'diff'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-2xl mb-2">📅</div>
                <div className="font-semibold">날짜 차이</div>
                <div className="text-sm text-gray-600">두 날짜 사이의 차이 계산</div>
              </button>

              <button
                onClick={() => setMode('add')}
                className={`p-4 rounded-lg border-2 transition-all ${mode === 'add'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-2xl mb-2">➕</div>
                <div className="font-semibold">시간 더하기</div>
                <div className="text-sm text-gray-600">날짜에 시간 추가/제거</div>
              </button>

              <button
                onClick={() => setMode('dday')}
                className={`p-4 rounded-lg border-2 transition-all ${mode === 'dday'
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
                  }`}
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-semibold">D-Day</div>
                <div className="text-sm text-gray-600">목표 날짜까지 남은 시간</div>
              </button>
            </div>
          </div>

          {/* 입력 영역 */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">📝 날짜 입력</h2>

            {/* 날짜 차이 계산 */}
            {mode === 'diff' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 날짜
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료 날짜
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* [수정] 빠른 설정 버튼 추가 */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">빠른 설정 (종료 날짜)</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { days: 7, label: '+7일' },
                      { days: 14, label: '+14일 (2주)' },
                      { days: 21, label: '+21일 (3주)' },
                      { days: 30, label: '+30일' },
                      { days: 365, label: '+1년' },
                    ].map((item) => (
                      <button
                        key={item.days}
                        onClick={() => quickSetDays(item.days)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 시간 더하기 */}
            {mode === 'add' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    기준 날짜
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      일 수
                    </label>
                    <input
                      type="number"
                      value={addDays}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setAddDays(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시간
                    </label>
                    <input
                      type="number"
                      value={addHours}
                      // [수정] 클릭 시 0 자동 선택
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setAddHours(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      분
                    </label>
                    <input
                      type="number"
                      value={addMinutes}
                      // [수정] 클릭 시 0 자동 선택
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => setAddMinutes(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* D-Day 계산 */}
            {mode === 'dday' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    목표 날짜
                  </label>
                  <input
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                {/* [수정] 빠른 설정 버튼 추가 */}
                <div>
                  <div className="text-sm font-medium text-gray-700 mb-2">빠른 설정</div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { days: 7, label: '7일 후' },
                      { days: 14, label: '2주 후' },
                      { days: 21, label: '3주 후' },
                      { days: 30, label: '30일 후' },
                      { days: 100, label: '100일 후' },
                    ].map((item) => (
                      <button
                        key={item.days}
                        onClick={() => quickSetTarget(item.days)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm transition-colors"
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 계산 버튼 */}
            <div className="mt-6">
              <button
                onClick={handleCalculate}
                className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
              >
                🧮 계산하기
              </button>
            </div>
          </div>

          {/* 결과 영역 */}
          {result && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">📊 계산 결과</h2>
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded text-sm transition-colors"
                >
                  📋 복사
                </button>
              </div>

              {/* 날짜 차이 결과 */}
              {result.type === 'diff' && (
                <div className="space-y-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-center flex items-center justify-center gap-2">
                      <div>
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {result.totalDays?.toLocaleString() || 0}일
                        </div>
                        <div className="text-sm text-gray-600">총 날짜 차이</div>
                      </div>
                      <button
                        onClick={() => copyItemToClipboard(`${result.totalDays?.toLocaleString() || 0}일`)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                        title="복사"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg group">
                      <div className="flex items-center justify-center gap-1">
                        <div>
                          <div className="font-bold text-gray-900">{result.periods?.years || 0}년</div>
                          <div className="text-sm text-gray-600">년</div>
                        </div>
                        <button
                          onClick={() => copyItemToClipboard(`${result.periods?.years || 0}년`)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-800 text-xs transition-opacity"
                          title="복사"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg group">
                      <div className="flex items-center justify-center gap-1">
                        <div>
                          <div className="font-bold text-gray-900">{result.periods?.months || 0}개월</div>
                          <div className="text-sm text-gray-600">개월</div>
                        </div>
                        <button
                          onClick={() => copyItemToClipboard(`${result.periods?.months || 0}개월`)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-800 text-xs transition-opacity"
                          title="복사"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg group">
                      <div className="flex items-center justify-center gap-1">
                        <div>
                          <div className="font-bold text-gray-900">{result.periods?.weeks || 0}주</div>
                          <div className="text-sm text-gray-600">주</div>
                        </div>
                        <button
                          onClick={() => copyItemToClipboard(`${result.periods?.weeks || 0}주`)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-800 text-xs transition-opacity"
                          title="복사"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg group">
                      <div className="flex items-center justify-center gap-1">
                        <div>
                          <div className="font-bold text-gray-900">{result.totalDays || 0}일</div>
                          <div className="text-sm text-gray-600">일</div>
                        </div>
                        <button
                          onClick={() => copyItemToClipboard(`${result.totalDays || 0}일`)}
                          className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-gray-800 text-xs transition-opacity"
                          title="복사"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg group">
                      <div className="flex items-center justify-center gap-1">
                        <div>
                          <div className="font-bold text-green-700">{result.totalHours?.toLocaleString() || 0}</div>
                          <div className="text-sm text-gray-600">총 시간</div>
                        </div>
                        <button
                          onClick={() => copyItemToClipboard(`${result.totalHours?.toLocaleString() || 0}시간`)}
                          className="opacity-0 group-hover:opacity-100 text-green-600 hover:text-green-800 text-xs transition-opacity"
                          title="복사"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg group">
                      <div className="flex items-center justify-center gap-1">
                        <div>
                          <div className="font-bold text-green-700">{result.totalMinutes?.toLocaleString() || 0}</div>
                          <div className="text-sm text-gray-600">총 분</div>
                        </div>
                        <button
                          onClick={() => copyItemToClipboard(`${result.totalMinutes?.toLocaleString() || 0}분`)}
                          className="opacity-0 group-hover:opacity-100 text-green-600 hover:text-green-800 text-xs transition-opacity"
                          title="복사"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg group">
                      <div className="flex items-center justify-center gap-1">
                        <div>
                          <div className="font-bold text-green-700">{result.totalSeconds?.toLocaleString() || 0}</div>
                          <div className="text-sm text-gray-600">총 초</div>
                        </div>
                        <button
                          onClick={() => copyItemToClipboard(`${result.totalSeconds?.toLocaleString() || 0}초`)}
                          className="opacity-0 group-hover:opacity-100 text-green-600 hover:text-green-800 text-xs transition-opacity"
                          title="복사"
                        >
                          📋
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 시간 더하기 결과 */}
              {result.type === 'add' && (
                <div className="space-y-4">
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-center flex items-center justify-center gap-2">
                      <div>
                        <div className="text-lg font-bold text-green-700 mb-2">
                          {result.resultDate?.toLocaleDateString('ko-KR')} ({result.resultDate?.toLocaleDateString('ko-KR', { weekday: 'short' })})
                        </div>
                        <div className="text-sm text-gray-600">결과 날짜</div>
                      </div>
                      <button
                        onClick={() => copyItemToClipboard(`${result.resultDate?.toLocaleDateString('ko-KR')} (${result.resultDate?.toLocaleDateString('ko-KR', { weekday: 'short' })})`)}
                        className="text-green-600 hover:text-green-800 text-sm"
                        title="복사"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">원래 날짜</div>
                      <div className="font-medium">{result.originalDate?.toLocaleDateString('ko-KR')}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="text-sm text-gray-600 mb-2">추가된 시간</div>
                      <div className="font-medium">
                        {result.addedDays || 0}일 {result.addedHours || 0}시간 {result.addedMinutes || 0}분
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* D-Day 결과 */}
              {result.type === 'dday' && (
                <div className="space-y-4">
                  <div className={`rounded-lg p-6 text-center ${result.isToday
                    ? 'bg-yellow-50 border border-yellow-200'
                    : result.isPast
                      ? 'bg-red-50 border border-red-200'
                      : 'bg-blue-50 border border-blue-200'
                    }`}>
                    <div className="flex items-center justify-center gap-2">
                      {result.isToday ? (
                        <div>
                          <div className="text-3xl mb-2">🎉</div>
                          <div className="text-xl font-bold text-yellow-700">오늘입니다! (D-Day)</div>
                        </div>
                      ) : result.isPast ? (
                        <div>
                          <div className="text-3xl mb-2">⏰</div>
                          <div className="text-xl font-bold text-red-700">
                            D+{Math.abs(result.daysLeft || 0)}일
                          </div>
                          <div className="text-md text-red-600">{Math.abs(result.daysLeft || 0)}일 지났습니다</div>
                        </div>
                      ) : (
                        <div>
                          <div className="text-3xl mb-2">🎯</div>
                          <div className="text-3xl font-bold text-blue-700 mb-2">
                            D-{result.daysLeft || 0}
                          </div>
                          <div className="text-lg text-blue-600">
                            {result.daysLeft || 0}일 남았습니다
                          </div>
                        </div>
                      )}
                      <button
                        onClick={() => {
                          const copyText = result.isToday ? 'D-Day (오늘)' :
                                         result.isPast ? `D+${Math.abs(result.daysLeft || 0)}일` :
                                         `D-${result.daysLeft || 0}`;
                          copyItemToClipboard(copyText);
                        }}
                        className={`text-sm ${result.isToday 
                          ? 'text-yellow-600 hover:text-yellow-800'
                          : result.isPast
                            ? 'text-red-600 hover:text-red-800'
                            : 'text-blue-600 hover:text-blue-800'
                        }`}
                        title="복사"
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-1">목표 날짜</div>
                      <div className="font-bold text-gray-900">
                        {result.targetDate?.toLocaleDateString('ko-KR')} ({result.targetDate?.toLocaleDateString('ko-KR', { weekday: 'long' })})
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 광고 영역 */}
          {result && <ToolResultAd />}

          {/* 사용 예시 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">💡 활용 예시</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-yellow-700">
              <div>
                <div className="font-medium mb-2">📅 날짜 차이</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>프로젝트 기간 계산</li>
                  <li>나이 계산</li>
                  <li>근무일수 계산</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">➕ 시간 더하기</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>계약 만료일 계산</li>
                  <li>배송 도착일 예상</li>
                  <li>일정 계획</li>
                </ul>
              </div>
              <div>
                <div className="font-medium mb-2">🎯 D-Day</div>
                <ul className="space-y-1 list-disc list-inside">
                  <li>시험까지 남은 날</li>
                  <li>기념일 카운트다운</li>
                  <li>마감일 관리</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}