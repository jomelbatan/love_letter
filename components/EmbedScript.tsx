"use client";

import Script from "next/script";

export function EmbedScripts() {
  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => window.instgrm?.Embeds.process()}
      />
      <Script
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v26.0"
        strategy="lazyOnload"
        crossOrigin="anonymous"
        onLoad={() => window.FB?.XFBML.parse()}
      />
      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />
    </>
  );
}
