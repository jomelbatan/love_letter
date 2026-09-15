"use client";

import { PostProps } from "@/types/props";
import { useEffect, useRef } from "react";

export function Instagram({ post }: PostProps) {
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
      const id = setTimeout(() => {
        if (window.instgrm) {
          clearInterval(id);
          process();
        }
      }, 3000);
      return () => clearInterval(id);
    }
  }, [post.embedUrl]);

  return (
    <div
      ref={containerRef}
      className="relative mx-auto h-full w-full overflow-hidden"
    >
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
    </div>
  );
}
