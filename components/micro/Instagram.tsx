"use client";

import { useEffect, useRef } from "react";

export type InstagramEmbedProps = {
  post: {
    embedUrl?: string;
  };
};

export function InstagramEmbed({ post }: InstagramEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const process = () => {
      if (window.instgrm && containerRef.current) {
        window.instgrm.Embeds.process(containerRef.current);
      }
    };

    if (window.instgrm) {
      process();
    } else {
      const id = setInterval(() => {
        if (window.instgrm) {
          clearInterval(id);
          process();
        }
      }, 100);
      return () => clearInterval(id);
    }
  }, [post.embedUrl]);

  if (!post.embedUrl) {
    return (
      <div className="p-8 text-center text-zinc-400 text-sm">
        Instagram embed link is missing or unavailable.
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[500px] flex justify-center"
    >
      <blockquote
        className="instagram-media"
        data-instgrm-captioned
        data-instgrm-permalink="https://www.instagram.com/reels/DdCEyeDA8uD/?utm_source=ig_embed&amp;utm_campaign=loading"
        data-instgrm-version="14"
      ></blockquote>
    </div>
  );
}
