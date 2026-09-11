import React from "react";
import { VideoPostProps } from "./FacebookReel";
import { parseYouTubeUrl } from "@/helpers/link.helper";

export default function Youtube({ post }: VideoPostProps) {
  const video = parseYouTubeUrl(post.embedUrl!);
  if (!video) return;
  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: video.aspectRatio }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${video.id}?rel=0`}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer *; clipboard-write *; encrypted-media *; gyroscope *; picture-in-picture *; web-share *;"
        allowFullScreen
      />
    </div>
  );
}
