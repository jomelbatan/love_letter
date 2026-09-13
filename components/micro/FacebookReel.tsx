"use client";

import { useEffect, useRef } from "react";

export type VideoPostProps = {
  post: {
    embedUrl?: string;
  };
};

export function FacebookReel({ post }: VideoPostProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isPost =
    post.embedUrl?.includes("photo") || post.embedUrl?.includes("post");

  useEffect(() => {
    const process = () => {
      if (window.FB && containerRef.current) {
        window.FB.XFBML.parse(containerRef.current);
      }
    };

    if (window.FB) {
      process();
    } else {
      const id = setInterval(() => {
        if (window.FB) {
          clearInterval(id);
          process();
        }
      }, 100);
      return () => clearInterval(id);
    }
  }, [post.embedUrl]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-full w-full overflow-hidden"
    >
      {isPost ? (
        <div
          className="fb-post rounded-xl"
          data-href={post.embedUrl}
          data-width="auto"
          data-show-text={false}
        />
      ) : (
        <div
          className="fb-video rounded-xl"
          data-href={post.embedUrl}
          data-width="auto"
        />
      )}
    </div>
  );
}
