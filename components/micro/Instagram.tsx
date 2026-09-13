"use client";

import { PostProps } from "@/types/props";
import { useEffect } from "react";

export function InstagramEmbed({ post }: PostProps) {
  useEffect(() => {
    if (!post.embedUrl) return;

    // Let React finish rendering the blockquote before Instagram scans it.
    const timer = setTimeout(() => {
      window.instgrm?.Embeds.process();
    }, 0);

    return () => clearTimeout(timer);
  }, [post.embedUrl]);

  if (!post.embedUrl) {
    return (
      <div className="p-8 text-center text-zinc-400 text-sm">
        Instagram embed link is missing or unavailable.
      </div>
    );
  }

  return (
    <blockquote
      className="instagram-media bg-white rounded-sm m-px w-full"
      data-instgrm-permalink={`${post.embedUrl}?utm_source=ig_embed&utm_campaign=loading`}
      data-instgrm-version="14"
    />
  );
}
