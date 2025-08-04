# Open Graph Images

이 폴더에는 소셜 미디어 공유를 위한 오픈그래프 이미지들이 포함되어야 합니다.

## 필요한 이미지들

모든 이미지는 1200x630 픽셀 크기로 제작되어야 합니다.

### 메인 사이트
- `webtools-main.png` - 메인 사이트 오픈그래프 이미지

### 각 도구별 이미지
- `gif-maker.png` - GIF 메이커
- `color-converter.png` - 컬러 컨버터
- `base64-converter.png` - Base64 변환기
- `qr-generator.png` - QR 코드 생성기
- `word-counter.png` - 글자 수 세기
- `text-to-image.png` - 텍스트를 이미지로
- `html-preview.png` - HTML 편집기
- `emoji-symbols.png` - 이모지 심볼
- `ip-checker.png` - IP 주소 조회기
- `time-calculator.png` - 시간 계산기
- `unit-converter.png` - 단위 변환기

## 이미지 디자인 가이드라인

1. **크기**: 1200x630 픽셀 (Facebook 권장 크기)
2. **형식**: PNG 또는 JPG
3. **내용**: 
   - 도구 이름을 명확하게 표시
   - 도구의 주요 기능을 시각적으로 표현
   - WebTools 브랜딩 포함
   - 깔끔하고 읽기 쉬운 디자인

## 임시 대체 방안

현재 이미지가 없는 경우를 대비해 Next.js에서 동적으로 오픈그래프 이미지를 생성하는 방법도 고려할 수 있습니다.

```typescript
// app/api/og/route.tsx 예시
import { ImageResponse } from 'next/og'
 
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'WebTools'
  
  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 60,
        fontWeight: 700,
        color: 'white',
      }}>
        {title}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
```