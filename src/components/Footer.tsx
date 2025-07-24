import Link from 'next/link';
import { tools, categories } from '@/data/tools';

export default function Footer() {
  const popularTools = tools.filter(tool => tool.popular);
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 사이트 정보 */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <span className="text-2xl">🔧</span>
              <span className="font-bold text-xl text-gray-900">WebTools</span>
            </Link>
            <p className="text-gray-600 text-sm mb-4">
              일상에서 유용한 웹 도구들을 무료로 제공합니다. 
              간편하고 빠른 온라인 유틸리티를 만나보세요.
            </p>
            <div className="flex space-x-2">
              <span className="text-xs text-gray-500">© {currentYear} WebTools</span>
            </div>
          </div>

          {/* 인기 도구 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">인기 도구</h3>
            <ul className="space-y-2">
              {popularTools.slice(0, 6).map((tool) => (
                <li key={tool.id}>
                  <Link
                    href={tool.href}
                    className="text-gray-600 hover:text-blue-600 text-sm flex items-center space-x-2"
                  >
                    <span>{tool.icon}</span>
                    <span>{tool.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 카테고리 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">카테고리</h3>
            <ul className="space-y-2">
              {categories.slice(1, 7).map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/#category-${category.id}`}
                    className="text-gray-600 hover:text-blue-600 text-sm flex items-center space-x-2"
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 정보 */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">정보</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-600 hover:text-blue-600 text-sm">
                  소개
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 text-sm">
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 text-sm">
                  이용약관
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 text-sm">
                  문의하기
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* 하단 구분선 */}
        <div className="border-t border-gray-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500">
              이 사이트의 모든 도구는 무료로 제공됩니다. 
              개인정보는 수집하지 않으며, 브라우저에서 직접 처리됩니다.
            </p>
            <div className="mt-4 md:mt-0">
              <span className="text-xs text-gray-400">
                Made with ❤️ for everyone
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}