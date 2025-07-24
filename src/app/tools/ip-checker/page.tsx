'use client';

import { useState, useEffect, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { ToolResultAd } from '@/components/AdBanner';

interface IPInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  timezone?: string;
  isp?: string;
  org?: string;
}

export default function IPCheckerPage() {
  const [ipInfo, setIpInfo] = useState<IPInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [customIP, setCustomIP] = useState('');
  const [customIPInfo, setCustomIPInfo] = useState<IPInfo | null>(null);

  // 내 IP 주소 가져오기
  const fetchMyIP = useCallback(async () => {
    setLoading(true);
    try {
      // 여러 API를 시도해서 가장 빠른 것 사용
      const apis = [
        'https://api.ipify.org?format=json',
        'https://ipapi.co/json/',
        'https://httpbin.org/ip'
      ];

      for (const api of apis) {
        try {
          const response = await fetch(api);
          if (response.ok) {
            const data = await response.json();
            const ip = data.ip || data.origin;
            
            if (ip) {
              setIpInfo({ ip });
              await fetchIPDetails(ip);
              break;
            }
          }
        } catch (error) {
          console.error(`API ${api} failed:`, error);
          continue;
        }
      }
    } catch {
      setIpInfo({ ip: '조회 실패' });
    } finally {
      setLoading(false);
    }
  }, []);

  // IP 세부정보 가져오기
  const fetchIPDetails = async (ip: string) => {
    try {
      // 무료 IP 정보 API 사용
      const response = await fetch(`https://ipapi.co/${ip}/json/`);
      if (response.ok) {
        const data = await response.json();
        const info: IPInfo = {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          timezone: data.timezone,
          isp: data.org,
          org: data.org
        };
        setIpInfo(info);
      }
    } catch (error) {
      console.error('IP 정보 조회 실패:', error);
    }
  };

  // 커스텀 IP 조회
  const checkCustomIP = async () => {
    if (!customIP.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://ipapi.co/${customIP}/json/`);
      if (response.ok) {
        const data = await response.json();
        const info: IPInfo = {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          timezone: data.timezone,
          isp: data.org,
          org: data.org
        };
        setCustomIPInfo(info);
      } else {
        setCustomIPInfo({ ip: '조회 실패' });
      }
    } catch {
      setCustomIPInfo({ ip: '조회 실패' });
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드시 내 IP 자동 조회
  useEffect(() => {
    fetchMyIP();
  }, [fetchMyIP]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const isPrivateIP = (ip: string) => {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4) return false;
    
    // 사설 IP 범위 확인
    return (
      (parts[0] === 10) ||
      (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
      (parts[0] === 192 && parts[1] === 168) ||
      (parts[0] === 127) // 로컬호스트
    );
  };

  const IPInfoCard = ({ info, title }: { info: IPInfo | null; title: string }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      {info ? (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600">IP 주소</div>
                <div className="text-xl font-bold text-blue-600">{info.ip}</div>
                {isPrivateIP(info.ip) && (
                  <div className="text-xs text-orange-600 mt-1">🏠 사설 IP</div>
                )}
              </div>
              <button
                onClick={() => copyToClipboard(info.ip)}
                className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                title="IP 복사"
              >
                📋
              </button>
            </div>
          </div>

          {info.country && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-600 font-medium">국가</div>
                <div className="font-semibold text-gray-900">{info.country}</div>
              </div>
              {info.city && (
                <div>
                  <div className="text-sm text-gray-600 font-medium">도시</div>
                  <div className="font-semibold text-gray-900">{info.city}</div>
                </div>
              )}
              {info.region && (
                <div>
                  <div className="text-sm text-gray-600 font-medium">지역</div>
                  <div className="font-semibold text-gray-900">{info.region}</div>
                </div>
              )}
              {info.timezone && (
                <div>
                  <div className="text-sm text-gray-600 font-medium">시간대</div>
                  <div className="font-semibold text-gray-900">{info.timezone}</div>
                </div>
              )}
              {info.isp && (
                <div className="md:col-span-2">
                  <div className="text-sm text-gray-600 font-medium">ISP/조직</div>
                  <div className="font-semibold text-gray-900">{info.isp}</div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          정보를 가져오는 중...
        </div>
      )}
    </div>
  );

  return (
    <ToolLayout toolId="ip-checker">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            🌍 IP 주소 조회기
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            현재 IP 주소 확인 및 네트워크 정보 조회
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-500">
            <span>✓ 내 IP 자동 조회</span>
            <span>•</span>
            <span>✓ 위치 정보</span>
            <span>•</span>
            <span>✓ ISP 정보</span>
            <span>•</span>
            <span>✓ 사설 IP 구분</span>
          </div>
        </div>

        <div className="space-y-8">
          {/* 내 IP 조회 */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">🔍 내 IP 주소</h2>
              <button
                onClick={fetchMyIP}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                {loading ? '조회 중...' : '🔄 새로고침'}
              </button>
            </div>
            
            <IPInfoCard info={ipInfo} title="현재 IP 정보" />
          </div>

          {/* 커스텀 IP 조회 */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🔎 다른 IP 조회</h2>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={customIP}
                  onChange={(e) => setCustomIP(e.target.value)}
                  placeholder="IP 주소 입력 (예: 8.8.8.8)"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && checkCustomIP()}
                />
                <button
                  onClick={checkCustomIP}
                  disabled={loading || !customIP.trim()}
                  className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
                >
                  조회
                </button>
              </div>
              
              {/* 예제 IP */}
              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">예제 IP:</div>
                <div className="flex flex-wrap gap-2">
                  {['8.8.8.8', '1.1.1.1', '208.67.222.222'].map((ip) => (
                    <button
                      key={ip}
                      onClick={() => setCustomIP(ip)}
                      className="px-3 py-1 bg-white border border-gray-300 rounded text-sm hover:bg-gray-50"
                    >
                      {ip}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {customIPInfo && (
              <IPInfoCard info={customIPInfo} title={`${customIP} 정보`} />
            )}
          </div>

          {/* 광고 영역 */}
          {ipInfo && <ToolResultAd />}

          {/* 정보 섹션 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* IP 주소 설명 */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">💡 IP 주소란?</h3>
              <ul className="text-sm text-blue-700 space-y-2">
                <li>• <strong>공인 IP</strong>: 인터넷에서 고유하게 식별되는 주소</li>
                <li>• <strong>사설 IP</strong>: 내부 네트워크에서만 사용되는 주소</li>
                <li>• 웹사이트 접속시 공인 IP가 기록됩니다</li>
                <li>• IPv4는 4개 숫자로 구성 (예: 192.168.1.1)</li>
              </ul>
            </div>

            {/* 보안 팁 */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">🔒 보안 팁</h3>
              <ul className="text-sm text-yellow-700 space-y-2">
                <li>• IP 주소로 정확한 개인 위치는 알 수 없습니다</li>
                <li>• VPN 사용시 IP 주소가 변경됩니다</li>
                <li>• 공공 Wi-Fi 사용시 주의하세요</li>
                <li>• 의심스러운 사이트에 IP 정보를 제공하지 마세요</li>
              </ul>
            </div>
          </div>

          {/* 사설 IP 범위 안내 */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 사설 IP 주소 범위</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white p-4 rounded border">
                <div className="font-medium text-gray-900">Class A</div>
                <div className="text-gray-600">10.0.0.0 ~ 10.255.255.255</div>
                <div className="text-xs text-gray-500 mt-1">대규모 네트워크</div>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="font-medium text-gray-900">Class B</div>
                <div className="text-gray-600">172.16.0.0 ~ 172.31.255.255</div>
                <div className="text-xs text-gray-500 mt-1">중간 규모 네트워크</div>
              </div>
              <div className="bg-white p-4 rounded border">
                <div className="font-medium text-gray-900">Class C</div>
                <div className="text-gray-600">192.168.0.0 ~ 192.168.255.255</div>
                <div className="text-xs text-gray-500 mt-1">소규모 네트워크</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}