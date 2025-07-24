'use client';

const ADSENSE_PUBLISHER_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5809883478660758';

export default function GoogleAdSense() {
  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_PUBLISHER_ID}`}
      crossOrigin="anonymous"
    />
  );
}

// 타입 선언
declare global {
  interface Window {
    adsbygoogle: Array<Record<string, unknown>>;
  }
}