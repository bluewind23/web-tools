'use client';

import Script from 'next/script';

const ADSENSE_CLIENT_ID = 'ca-pub-5809883478660758';

export default function AdSenseScript() {
  return (
    <Script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}