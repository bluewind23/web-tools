import Link from 'next/link';
import { tools } from '@/data/tools';

export default function AboutPage() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/" className="flex items-center space-x-3 text-blue-600 hover:text-blue-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-medium">홈으로 돌아가기</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center space-x-3 mb-4">
              <span className="text-4xl">🔧</span>
              <h1 className="text-3xl font-bold text-gray-900">WebTools</h1>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              일상에서 유용한 웹 도구들을 무료로 제공하는 온라인 유틸리티 플랫폼입니다.
            </p>
          </div>

          {/* Mission */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🎯 우리의 목표</h2>
            <div className="bg-blue-50 rounded-lg p-6">
              <p className="text-gray-800 leading-relaxed mb-4">
                WebTools는 누구나 쉽고 빠르게 사용할 수 있는 웹 기반 도구들을 제공하여, 
                일상의 작업을 더욱 효율적으로 만들어드리는 것을 목표로 합니다.
              </p>
              <p className="text-gray-800 leading-relaxed">
                복잡한 소프트웨어 설치나 회원가입 없이, 브라우저에서 바로 사용할 수 있는 
                편리한 도구들을 통해 여러분의 시간을 절약해드립니다.
              </p>
            </div>
          </div>

          {/* Features */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ 특징</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <div className="text-2xl mb-3">🆓</div>
                <h3 className="font-semibold text-gray-900 mb-2">완전 무료</h3>
                <p className="text-gray-600 text-sm">
                  모든 도구를 무료로 제공하며, 숨겨진 비용이 없습니다.
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-6">
                <div className="text-2xl mb-3">🔒</div>
                <h3 className="font-semibold text-gray-900 mb-2">개인정보 보호</h3>
                <p className="text-gray-600 text-sm">
                  모든 처리는 브라우저에서 이루어지며, 개인정보를 수집하지 않습니다.
                </p>
              </div>
              <div className="bg-orange-50 rounded-lg p-6">
                <div className="text-2xl mb-3">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-2">빠른 처리</h3>
                <p className="text-gray-600 text-sm">
                  클라이언트 사이드 처리로 빠르고 안전한 작업이 가능합니다.
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-6">
                <div className="text-2xl mb-3">📱</div>
                <h3 className="font-semibold text-gray-900 mb-2">모든 기기 지원</h3>
                <p className="text-gray-600 text-sm">
                  데스크톱, 태블릿, 모바일 모든 기기에서 사용 가능합니다.
                </p>
              </div>
              <div className="bg-pink-50 rounded-lg p-6">
                <div className="text-2xl mb-3">🚀</div>
                <h3 className="font-semibold text-gray-900 mb-2">설치 불필요</h3>
                <p className="text-gray-600 text-sm">
                  소프트웨어 설치나 회원가입 없이 바로 사용할 수 있습니다.
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-6">
                <div className="text-2xl mb-3">🔄</div>
                <h3 className="font-semibold text-gray-900 mb-2">지속적 업데이트</h3>
                <p className="text-gray-600 text-sm">
                  사용자 피드백을 바탕으로 지속적으로 개선하고 있습니다.
                </p>
              </div>
            </div>
          </div>

          {/* Available Tools */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">🛠️ 제공 도구</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tools.map((tool) => (
                  <div key={tool.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg">
                    <span className="text-2xl">{tool.icon}</span>
                    <div>
                      <h3 className="font-medium text-gray-900">{tool.name}</h3>
                      <p className="text-sm text-gray-600">{tool.shortDesc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Technology */}
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">⚙️ 기술 스택</h2>
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl mb-2">⚛️</div>
                  <p className="text-sm font-medium text-gray-900">Next.js 15</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🎨</div>
                  <p className="text-sm font-medium text-gray-900">Tailwind CSS</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">📘</div>
                  <p className="text-sm font-medium text-gray-900">TypeScript</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl mb-2">🔧</div>
                  <p className="text-sm font-medium text-gray-900">React Hooks</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact CTA */}
          <div className="text-center bg-blue-50 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💌 의견을 들려주세요</h2>
            <p className="text-gray-600 mb-6">
              새로운 도구 제안이나 개선 사항이 있으시면 언제든 연락해주세요.
              여러분의 피드백이 더 나은 서비스를 만듭니다.
            </p>
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              도구 사용하러 가기
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-sm text-gray-500">
              © {currentYear} WebTools. Made with ❤️ for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}