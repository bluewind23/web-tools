import type { Metadata } from "next";

export const metadata: Metadata = {
  title: '글자 수 세기 - 한글/영문 실시간 문자 카운터',
  description: '한글과 영문 텍스트의 글자 수, 단어 수, 문장 수를 실시간으로 카운트합니다. 공백 포함/제외 옵션을 제공합니다.',
  keywords: ['글자수세기', '문자수', '단어수', '카운터', '텍스트분석', '한글카운터'],
};

export default function WordCounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}