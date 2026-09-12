"use client";

import { useEffect, useRef, useState } from "react";

export type VideoPostProps = {
  post: {
    embedUrl?: string;
  };
};

function loadFacebookSdk(onReady: () => void) {
  if (window.FB) {
    onReady();
    return;
  }

  const script = document.createElement("script");

  script.src =
    "https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v26.0";
  script.async = true;
  script.defer = true;
  script.crossOrigin = "anonymous";
  script.onload = onReady;

  document.body.appendChild(script);
}

export function FacebookReel({ post }: VideoPostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPost =
    post.embedUrl?.includes("photo") || post.embedUrl?.includes("post");

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    function init() {
      if (!post.embedUrl) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      loadFacebookSdk(() => {
        if (!window.FB || !containerRef.current) {
          setIsLoading(false);
          return;
        }

        window.FB.XFBML.parse(containerRef.current);
        setIsLoading(false);
      });
    }

    init();
  }, [post.embedUrl]);

  if (!post.embedUrl) {
    return (
      <div className="p-8 text-center text-zinc-400 text-sm">
        Facebook Reel link is missing or unavailable.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-full w-full overflow-hidden"
    >
      {/* Skeleton */}
      <div
        className={`absolute inset-0 z-10 transition-opacity duration-300 ${
          isLoading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="flex h-125 w-full flex-col overflow-hidden rounded-2xl bg-zinc-200">
          {/* Video area */}
          <div className="flex flex-1 animate-pulse items-center justify-center">
            <div className="size-12 rounded-full bg-zinc-300" />
          </div>

          {/* Bottom controls */}
          <div className="space-y-3 p-4">
            <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-300" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-300" />
          </div>
        </div>
      </div>

      {/* Facebook embed */}
      <div
        className={`transition-opacity duration-300 rounded-xl ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {isPost ? (
          <div
            className={`fb-post rounded-xl`}
            data-href={post.embedUrl}
            data-width="auto"
            data-show-text={false}
          />
        ) : (
          <div
            className={`fb-video rounded-xl`}
            data-href={post.embedUrl}
            data-width="auto"
          />
        )}
      </div>
    </div>
  );
}
