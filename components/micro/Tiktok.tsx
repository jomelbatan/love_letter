import React from "react";
import { VideoPostProps } from "./FacebookReel";
import { getTikTokVideoId } from "@/helpers/link.helper";

export default function Tiktok({ post }: VideoPostProps) {
  const cleanUrl = getTikTokVideoId(post.embedUrl!);
  const embedUrl = `https://www.tiktok.com/player/v1/${cleanUrl}?rel=0&controls=1&progress_bar=0&fullscreen_button`;

  return (
    <div className="relative w-full max-w-100 aspect-9/16 rounded-xl overflow-hidden bg-black shadow-lg">
      <iframe
        src={embedUrl}
        className="absolute top-0 left-0 w-full h-full"
        allow="autoplay; encrypted-media; fullscreen"
        allowFullScreen
        title="TikTok video player"
      />
    </div>
  );
}
