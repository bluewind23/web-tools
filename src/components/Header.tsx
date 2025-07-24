'use client';

import Link from 'next/link';
import { useState } from 'react';
import { tools, categories } from '@/data/tools';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🔧</span>
            <span className="font-bold text-xl text-gray-900">WebTools</span>
          </Link>

          {/* 데스크톱 네비게이션 */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
              홈
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-blue-600 font-medium flex items-center">
                도구 목록
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="p-4">
                  <div className="grid grid-cols-2 gap-2">
                    {tools.slice(0, 8).map((tool) => (
                      <Link
                        key={tool.id}
                        href={tool.href}
                        className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                      >
                        <span className="text-lg">{tool.icon}</span>
                        <span className="text-sm text-gray-700">{tool.name}</span>
                      </Link>
                    ))}
                  </div>
                  <Link
                    href="/#tools"
                    className="block mt-3 pt-3 border-t text-center text-blue-600 text-sm font-medium hover:text-blue-800"
                  >
                    모든 도구 보기 →
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>

        {/* 모바일 메뉴 */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 text-gray-700 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                홈
              </Link>
              <div className="px-3 py-2">
                <div className="text-sm font-medium text-gray-500 mb-2">인기 도구</div>
                <div className="grid grid-cols-1 gap-1">
                  {tools.filter(tool => tool.popular).map((tool) => (
                    <Link
                      key={tool.id}
                      href={tool.href}
                      className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{tool.icon}</span>
                      <span className="text-sm">{tool.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}