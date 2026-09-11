"use client";

import { useEffect, useRef } from "react";

type FacebookReelProps = {
  post: {
    embedUrl?: string;
  };
};

function loadFacebookSdk(onReady: () => void) {
  if (window.FB) {
    onReady();
    return;
  }

  const scriptId = "facebook-jssdk";
  if (document.getElementById(scriptId)) {
    // Script tag exists, SDK still initializing — wait for it
    const check = setInterval(() => {
      if (window.FB) {
        clearInterval(check);
        onReady();
      }
    }, 100);
    return;
  }

  const script = document.createElement("script");
  script.id = scriptId;
  script.src =
    "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v19.0";
  script.async = true;
  script.defer = true;
  script.crossOrigin = "anonymous";
  script.onload = onReady;
  document.body.appendChild(script);
}

export function FacebookReel({ post }: FacebookReelProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!post.embedUrl) return;

    loadFacebookSdk(() => {
      if (window.FB && containerRef.current) {
        window.FB.XFBML.parse(containerRef.current);
      }
    });
  }, [post.embedUrl]);

  return (
    <div className="bg-zinc-950 text-white rounded-xl border border-zinc-800 p-2">
      {post.embedUrl ? (
        <div
          className="fb-video"
          data-href={post.embedUrl}
          data-width="550"
          data-show-text="false"
          data-autoplay="true"
        />
      ) : (
        <div className="p-8 text-center text-zinc-400 text-sm">
          Facebook Reel link is missing or unavailable.
        </div>
      )}
    </div>
  );
}
