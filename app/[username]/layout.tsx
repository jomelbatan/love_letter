import Script from "next/script";
import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script
        src="https://www.instagram.com/embed.js"
        strategy="afterInteractive"
      />

      <Script
        src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v26.0"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />

      <Script
        src="https://www.youtube.com/iframe_api"
        strategy="afterInteractive"
      />

      {children}
    </>
  );
}
