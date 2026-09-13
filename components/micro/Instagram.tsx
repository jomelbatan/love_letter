"use client";

import { PostProps } from "@/types/props";

export function Instagram({ post }: PostProps) {
  if (!post.embedUrl) {
    return (
      <div className="p-8 text-center text-zinc-400 text-sm">
        Instagram embed link is missing or unavailable.
      </div>
    );
  }

  return (
    <>
      <blockquote
        className="instagram-media"
        data-instgrm-permalink={post.embedUrl}
        data-instgrm-version="14"
        style={{
          background: "#fff",
          border: 0,
          borderRadius: 3,
          boxShadow: "0 0 1px 0 rgba(0,0,0,0.5), 0 1px 10px 0 rgba(0,0,0,0.15)",
          margin: 1,
          maxWidth: 540,
          minWidth: 326,
          padding: 0,
          width: "99.375%",
        }}
      />
    </>
  );
}
