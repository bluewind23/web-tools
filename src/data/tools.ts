export interface Tool {
  id: string;
  name: string;
  description: string;
  shortDesc: string;
  href: string;
  icon: string;
  category: string;
  popular: boolean;
  keywords: string[];
}

export const tools: Tool[] = [
  {
    id: 'word-counter',
    name: '글자 수 세기',
    description: '한글/영문 실시간 글자 수 카운트 - 공백 포함/제외 옵션 지원',
    shortDesc: '실시간 글자 수 카운트',
    href: '/tools/word-counter',
    icon: '📝',
    category: '텍스트',
    popular: true,
    keywords: ['글자수', '문자수', '단어수', '카운트', '텍스트', 'count', 'word', 'character', 'text']
  },
  {
    id: 'gif-maker',
    // [수정] 도구 이름 변경
    name: 'GIF 제작 툴',
    description: '이미지나 동영상을 GIF 애니메이션으로 변환하는 도구',
    shortDesc: '이미지/동영상 to GIF',
    href: '/tools/gif-maker',
    icon: '🎬',
    category: '이미지',
    popular: true,
    keywords: ['gif', '움짤', '애니메이션', '이미지', '동영상', 'mp4 to gif', 'animation', 'video', 'image', 'gif만들기', '지프']
  },
  {
    id: 'html-preview',
    name: 'HTML 편집기',
    description: 'HTML 코드를 실시간으로 미리보기 - 모바일/PC 반응형 테스트 지원',
    shortDesc: 'HTML 실시간 편집 & 미리보기',
    href: '/tools/html-preview',
    icon: '🌐',
    category: '개발',
    popular: true,
    keywords: ['html', '미리보기', '코드', '개발', '반응형', '편집기', 'preview', 'code', 'web', 'editor', '웹개발']
  },
  {
    id: 'ip-checker',
    name: 'IP 주소 조회기',
    description: '현재 IP 주소 확인 및 네트워크 정보 조회',
    shortDesc: 'IP 주소 확인',
    href: '/tools/ip-checker',
    icon: '🌍',
    category: '네트워크',
    popular: true,
    keywords: ['ip', '아이피', '네트워크', '위치', 'network', 'address', 'location', 'ip주소', '내아이피']
  },
  {
    id: 'qr-generator',
    name: 'QR 코드 생성기',
    description: '텍스트/URL을 QR 코드로 변환 - 커스텀 색상, SVG/PNG 다운로드 지원',
    shortDesc: 'QR 코드 생성',
    href: '/tools/qr-generator',
    icon: '🔳',
    category: '변환',
    popular: true,
    keywords: ['qr', '큐알코드', 'qr코드', '바코드', '변환', 'qrcode', 'barcode', 'generator', 'qr생성', '큐알']
  },
  {
    id: 'base64-converter',
    name: 'Base64 인코더/디코더',
    description: '텍스트 및 이미지 Base64 인코딩/디코딩 도구',
    shortDesc: 'Base64 변환',
    href: '/tools/base64-converter',
    icon: '🔄',
    category: '변환',
    popular: false,
    keywords: ['base64', '인코딩', '디코딩', '변환', '암호화', 'encoding', 'decoding', 'converter', 'encode', 'decode']
  },
  {
    id: 'emoji-symbols',
    name: '특수 문자표 / 이모지',
    description: '이모지, 특수문자, 기호 모음 - 클릭으로 간편 복사',
    shortDesc: '이모지 & 특수문자',
    href: '/tools/emoji-symbols',
    icon: '😀',
    category: '텍스트',
    popular: true,
    keywords: ['이모지', '특수문자', '기호', '심볼', '복사', 'emoji', 'symbol', 'character', 'copy', '이모티콘', '문자표']
  },
  {
    id: 'color-converter',
    name: '컬러 컨버터',
    description: 'RGB, HEX, CMYK 색상 변환 도구 - 실시간 미리보기 지원',
    shortDesc: '색상 코드 변환',
    href: '/tools/color-converter',
    icon: '🎨',
    category: '디자인',
    popular: true,
    keywords: ['색상', '컬러', 'rgb', 'hex', 'cmyk', '변환', 'color', 'picker', 'converter', '팔레트', '색깔']
  },
  {
    id: 'text-to-image',
    name: '텍스트를 이미지로',
    description: '텍스트를 이미지로 변환 - 커스텀 폰트, 배경, 정렬 옵션 제공',
    shortDesc: '텍스트 이미지 생성',
    href: '/tools/text-to-image',
    icon: '🖼️',
    category: '이미지',
    popular: false,
    keywords: ['텍스트', '이미지', '캘리그래피', '폰트', '생성', 'text', 'image', 'generator', 'font', '글자이미지']
  },
  {
    id: 'time-calculator',
    name: '시간 계산기',
    description: '날짜 차이 계산, 시간 합산, D-Day 계산기',
    shortDesc: '날짜/시간 계산',
    href: '/tools/time-calculator',
    icon: '⏰',
    category: '계산',
    popular: true,
    keywords: ['시간', '날짜', '계산', 'dday', '디데이', 'time', 'date', 'calculator', 'day', '시간계산', '날짜계산']
  },
  {
    id: 'unit-converter',
    name: '단위 변환기',
    description: '길이, 무게, 온도, 넓이 등 다양한 단위들을 변환합니다.',
    shortDesc: '길이/무게/온도 등 단위 변환',
    href: '/tools/unit-converter',
    icon: '📐',
    category: '계산',
    popular: true,
    keywords: ['단위', '변환', '계산', '길이', '무게', '온도', '넓이', '미터', '인치', 'unit', 'converter', 'meter', 'inch', 'kg', 'pound']
  }
];

export const categories = [
  { id: 'all', name: '전체', icon: '🔧' },
  { id: '텍스트', name: '텍스트', icon: '📝' },
  { id: '이미지', name: '이미지', icon: '🖼️' },
  { id: '변환', name: '변환', icon: '🔄' },
  { id: '개발', name: '개발', icon: '💻' },
  { id: '디자인', name: '디자인', icon: '🎨' },
  { id: '계산', name: '계산', icon: '🧮' },
  { id: '네트워크', name: '네트워크', icon: '🌐' }
];

export const getPopularTools = () => tools.filter(tool => tool.popular);
export const getToolsByCategory = (category: string) =>
  category === 'all' ? tools : tools.filter(tool => tool.category === category);
export const getRandomTools = (count: number, exclude?: string) =>
  tools.filter(tool => tool.id !== exclude).sort(() => Math.random() - 0.5).slice(0, count);