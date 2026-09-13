"use client";
import Script from "next/script";
import { useEffect, useRef } from "react";

export type InstagramEmbedProps = {
  post: {
    embedUrl?: string;
  };
};

export function InstagramEmbed({ post }: InstagramEmbedProps) {
  const blockquoteRef = useRef<HTMLDivElement>(null);

  if (!post.embedUrl) {
    return (
      <div className="p-8 text-center text-zinc-400 text-sm">
        Instagram embed link is missing or unavailable.
      </div>
    );
  }

  return (
    <div
      ref={blockquoteRef}
      className="relative mx-auto h-full w-full overflow-hidden"
    ></div>
  );
}
