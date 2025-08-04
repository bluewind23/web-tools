'use client';


import { useState, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

interface UnitInfo {
  value: number | string;
  label: string;
  short: string;
}

interface UnitCategory {
  name: string;
  icon: string;
  baseUnit: string;
  units: Record<string, UnitInfo>;
  common: string[];
}

const unitData: Record<string, UnitCategory> = {
  length: {
    name: '길이',
    icon: '📏',
    baseUnit: 'm',
    units: {
      mm: { value: 0.001, label: '밀리미터', short: 'mm' },
      cm: { value: 0.01, label: '센티미터', short: 'cm' },
      m: { value: 1, label: '미터', short: 'm' },
      km: { value: 1000, label: '킬로미터', short: 'km' },
      in: { value: 0.0254, label: '인치', short: 'in' },
      ft: { value: 0.3048, label: '피트', short: 'ft' },
      yd: { value: 0.9144, label: '야드', short: 'yd' },
      mi: { value: 1609.34, label: '마일', short: 'mi' },
    },
    common: ['mm', 'cm', 'm', 'km', 'in', 'ft']
  },
  mass: {
    name: '무게',
    icon: '⚖️',
    baseUnit: 'kg',
    units: {
      mg: { value: 0.000001, label: '밀리그램', short: 'mg' },
      g: { value: 0.001, label: '그램', short: 'g' },
      kg: { value: 1, label: '킬로그램', short: 'kg' },
      t: { value: 1000, label: '톤', short: 't' },
      kt: { value: 1000000, label: '킬로톤', short: 'kt' },
      oz: { value: 0.0283495, label: '온스', short: 'oz' },
      lb: { value: 0.453592, label: '파운드', short: 'lb' },
      gr: { value: 0.0000648, label: '그레인', short: 'gr' },
      don: { value: 0.00375, label: '돈', short: '돈' },
      nyang: { value: 0.0375, label: '냥', short: '냥' },
      geun: { value: 0.6, label: '근', short: '근' },
      gwan: { value: 3.75, label: '관', short: '관' },
    },
    common: ['mg', 'g', 'kg', 't', 'oz', 'lb']
  },
  temperature: {
    name: '온도',
    icon: '🌡️',
    baseUnit: 'c',
    units: {
      c: { value: 'Celsius', label: '섭씨', short: '°C' },
      f: { value: 'Fahrenheit', label: '화씨', short: '°F' },
      k: { value: 'Kelvin', label: '켈빈', short: 'K' }
    },
    common: ['c', 'f', 'k']
  },
  area: {
    name: '넓이',
    icon: '📐',
    baseUnit: 'sqm',
    units: {
      sqm: { value: 1, label: '제곱미터', short: 'm²' },
      sqkm: { value: 1000000, label: '제곱킬로미터', short: 'km²' },
      sqmi: { value: 2590000, label: '제곱마일', short: 'mi²' },
      sqyd: { value: 0.836127, label: '제곱야드', short: 'yd²' },
      sqft: { value: 0.092903, label: '제곱피트', short: 'ft²' },
      acre: { value: 4046.86, label: '에이커', short: 'acre' },
      ha: { value: 10000, label: '헥타르', short: 'ha' },
      pyeong: { value: 3.305785, label: '평', short: '평' },
    },
    common: ['sqm', 'sqkm', 'sqft', 'acre', 'ha', 'pyeong']
  },
  volume: {
    name: '부피',
    icon: '🧪',
    baseUnit: 'l',
    units: {
      ml: { value: 0.001, label: '밀리리터', short: 'ml' },
      l: { value: 1, label: '리터', short: 'L' },
      gal: { value: 3.78541, label: '갤런', short: 'gal' },
      qt: { value: 0.946353, label: '쿼트', short: 'qt' },
      pt: { value: 0.473176, label: '파인트', short: 'pt' },
      cup: { value: 0.236588, label: '컵', short: 'cup' },
      fl_oz: { value: 0.0295735, label: '액량온스', short: 'fl oz' },
    },
    common: ['ml', 'l', 'gal', 'cup']
  }
};

type Category = keyof typeof unitData;

export default function UnitConverterPage() {
  const [category, setCategory] = useState<Category>('length');
  const [fromUnit, setFromUnit] = useState('m');
  const [toUnit, setToUnit] = useState('cm');
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('100');

  const currentUnits = useMemo(() => unitData[category].units, [category]);
  const commonUnits = useMemo(() => unitData[category].common, [category]);

  const handleCategoryChange = (newCategory: Category) => {
    setCategory(newCategory);
    const commonUnits = unitData[newCategory].common;
    setFromUnit(commonUnits[0]);
    setToUnit(commonUnits[1] || commonUnits[0]);
    setFromValue('1');
    performConversion('1', commonUnits[0], commonUnits[1] || commonUnits[0], newCategory);
  };

  const performConversion = (val: string, from: string, to: string, cat: Category) => {
    if (val === '' || isNaN(parseFloat(val))) {
      setToValue('');
      return;
    }
    const numVal = parseFloat(val);
    let result;

    if (cat === 'temperature') {
      let celsius;
      if (from === 'f') celsius = (numVal - 32) * 5 / 9;
      else if (from === 'k') celsius = numVal - 273.15;
      else celsius = numVal;

      if (to === 'f') result = celsius * 9 / 5 + 32;
      else if (to === 'k') result = celsius + 273.15;
      else result = celsius;
    } else {
      const fromRate = unitData[cat].units[from].value as number;
      const toRate = unitData[cat].units[to].value as number;
      const baseValue = numVal * fromRate;
      result = baseValue / toRate;
    }

    setToValue(Number(result.toPrecision(10)).toString());
  };

  // 빠른 변환을 위한 프리셋 값들
  const quickValues = ['0.1', '1', '10', '100', '1000'];

  // 단위 교체
  const swapUnits = () => {
    const tempUnit = fromUnit;
    const tempValue = fromValue;
    setFromUnit(toUnit);
    setToUnit(tempUnit);
    setFromValue(toValue);
    setToValue(tempValue);
  };


  // 전체 단위 변환 결과를 표시하는 함수
  const getAllConversions = () => {
    if (!fromValue || isNaN(parseFloat(fromValue))) return [];
    
    const numVal = parseFloat(fromValue);
    const conversions: Array<{unit: string, label: string, value: string}> = [];
    
    Object.entries(currentUnits).forEach(([unit, data]) => {
      if (unit === fromUnit) return; // 자기 자신은 제외
      
      let result;
      if (category === 'temperature') {
        let celsius;
        if (fromUnit === 'f') celsius = (numVal - 32) * 5 / 9;
        else if (fromUnit === 'k') celsius = numVal - 273.15;
        else celsius = numVal;

        if (unit === 'f') result = celsius * 9 / 5 + 32;
        else if (unit === 'k') result = celsius + 273.15;
        else result = celsius;
      } else {
        const fromRate = unitData[category].units[fromUnit].value as number;
        const toRate = unitData[category].units[unit].value as number;
        const baseValue = numVal * fromRate;
        result = baseValue / toRate;
      }
      
      const formattedResult = Number(result.toPrecision(8)).toLocaleString();
      conversions.push({
        unit: data.short,
        label: data.label,
        value: formattedResult
      });
    });
    
    return conversions;
  };
  
  const handleValueChange = (val: string, type: 'from' | 'to') => {
    if (type === 'from') {
        setFromValue(val);
        performConversion(val, fromUnit, toUnit, category);
    } else {
        setToValue(val);
        performConversion(val, toUnit, fromUnit, category);
    }
  };

  return (
    <ToolLayout toolId="unit-converter">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            📐 단위 변환기
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            길이, 무게, 온도, 넓이, 부피 등 다양한 단위를 쉽고 빠르게 변환
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ 직관적 버튼 UI</span>
            <span>•</span>
            <span>✓ 빠른 값 변환</span>
            <span>•</span>
            <span>✓ 단위 교체</span>
            <span>•</span>
            <span>✓ 실시간 계산</span>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">🎯 변환 유형 선택</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
            {Object.entries(unitData).map(([key, data]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key as Category)}
                className={`p-2 rounded-lg border-2 transition-all text-center ${
                  category === key
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                <div className="text-lg mb-1">{data.icon}</div>
                <div className="text-xs font-semibold text-gray-800">{data.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 메인 변환 영역 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* From 단위 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">변환할 값</h3>
              </div>
              
              <div className="space-y-4">
                <input
                  type="number"
                  value={fromValue}
                  onChange={(e) => handleValueChange(e.target.value, 'from')}
                  className="w-full p-4 border border-gray-300 rounded-lg text-xl font-bold text-center text-gray-900"
                  placeholder="값을 입력하세요"
                />
                
                {/* 빠른 값 입력 버튼 */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm font-medium text-gray-800">빠른 입력:</span>
                  {quickValues.map((value) => (
                    <button
                      key={value}
                      onClick={() => handleValueChange(value, 'from')}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded text-sm transition-colors font-medium"
                    >
                      {value}
                    </button>
                  ))}
                </div>
                
                {/* From 단위 선택 - 공통 단위 버튼 */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2">단위 선택</div>
                  <div className="grid grid-cols-3 gap-2">
                    {commonUnits.map((unit) => (
                      <button
                        key={unit}
                        onClick={() => {
                          setFromUnit(unit);
                          performConversion(fromValue, unit, toUnit, category);
                        }}
                        className={`p-2 rounded-lg border-2 transition-all text-center ${
                          fromUnit === unit
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-800'
                        }`}
                      >
                        <div className="font-bold text-sm">{unitData[category].units[unit].short}</div>
                        <div className="text-xs font-medium">{unitData[category].units[unit].label}</div>
                      </button>
                    ))}
                  </div>
                  
                  {/* 전체 단위 드롭다운 */}
                  <select
                    value={fromUnit}
                    onChange={(e) => {
                      setFromUnit(e.target.value);
                      performConversion(fromValue, e.target.value, toUnit, category);
                    }}
                    className="w-full p-2 mt-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-800"
                  >
                    {Object.entries(currentUnits).map(([unit, data]) => (
                      <option key={unit} value={unit}>
                        {data.label} ({data.short})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 교체 버튼 */}
            <div className="lg:hidden flex justify-center">
              <button
                onClick={swapUnits}
                className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                title="단위 교체"
              >
                🔄
              </button>
            </div>

            {/* To 단위 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">변환 결과</h3>
                <button
                  onClick={swapUnits}
                  className="hidden lg:block p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm"
                  title="단위 교체"
                >
                  🔄 교체
                </button>
              </div>
              
              <div className="space-y-4">
                <input
                  type="number"
                  value={toValue}
                  onChange={(e) => handleValueChange(e.target.value, 'to')}
                  className="w-full p-4 border border-gray-300 rounded-lg text-xl font-bold text-center bg-blue-50 text-gray-900"
                  placeholder="결과값"
                />
                
                {/* To 단위 선택 - 공통 단위 버튼 */}
                <div>
                  <div className="text-sm font-semibold text-gray-800 mb-2">단위 선택</div>
                  <div className="grid grid-cols-3 gap-2">
                    {commonUnits.map((unit) => (
                      <button
                        key={unit}
                        onClick={() => {
                          setToUnit(unit);
                          performConversion(fromValue, fromUnit, unit, category);
                        }}
                        className={`p-2 rounded-lg border-2 transition-all text-center ${
                          toUnit === unit
                            ? 'border-green-500 bg-green-50 text-green-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-800'
                        }`}
                      >
                        <div className="font-bold text-sm">{unitData[category].units[unit].short}</div>
                        <div className="text-xs font-medium">{unitData[category].units[unit].label}</div>
                      </button>
                    ))}
                  </div>
                  
                  {/* 전체 단위 드롭다운 */}
                  <select
                    value={toUnit}
                    onChange={(e) => {
                      setToUnit(e.target.value);
                      performConversion(fromValue, fromUnit, e.target.value, category);
                    }}
                    className="w-full p-2 mt-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-800"
                  >
                    {Object.entries(currentUnits).map(([unit, data]) => (
                      <option key={unit} value={unit}>
                        {data.label} ({data.short})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* 복사 버튼 */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigator.clipboard.writeText(`${fromValue} ${unitData[category].units[fromUnit].short} = ${toValue} ${unitData[category].units[toUnit].short}`)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              📋 결과 복사
            </button>
          </div>
        </div>

        {/* 직관적 변환 결과 표시 */}
        {fromValue && !isNaN(parseFloat(fromValue)) && (
          <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">📊</span>
              {fromValue} {unitData[category].units[fromUnit].label}({unitData[category].units[fromUnit].short}) 단위 변환 결과
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {getAllConversions().map((conversion, index) => (
                <div key={index} className="bg-white rounded-lg p-3 border border-gray-200 shadow-sm">
                  <div className="text-lg font-bold text-blue-600">{conversion.value}</div>
                  <div className="text-sm font-medium text-gray-800">{conversion.label}({conversion.unit})</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 광고 영역 */}
        <div className="mb-6">
          <ToolResultAd />
        </div>

        {/* 도움말 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 사용법</h3>
            <ul className="text-sm text-blue-700 space-y-2">
              <li>• 상단에서 변환할 단위 유형을 선택하세요</li>
              <li>• 왼쪽에 변환할 값과 단위를 입력하세요</li>
              <li>• 오른쪽에서 원하는 결과 단위를 선택하세요</li>
              <li>• 🔄 버튼으로 From/To 단위를 쉽게 교체할 수 있습니다</li>
              <li>• 빠른 입력 버튼으로 자주 사용하는 값을 쉽게 입력하세요</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-3">⚡ 빠른 팁</h3>
            <ul className="text-sm text-yellow-700 space-y-2">
              <li>• 공통 단위는 버튼으로, 모든 단위는 드롭다운에서 선택</li>
              <li>• 실시간으로 변환 결과가 계산됩니다</li>
              <li>• 빠른 변환 결과로 대략적인 값을 미리 확인하세요</li>
              <li>• 온도 변환은 정확한 공식을 사용합니다</li>
              <li>• 결과 복사 버튼으로 변환 결과를 쉽게 공유하세요</li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}