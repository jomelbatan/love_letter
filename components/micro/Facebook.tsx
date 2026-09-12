import React from "react";
import { VideoPostProps } from "./FacebookReel";

export default function Facebook({ post }: VideoPostProps) {
  const link = encodeURIComponent(post.embedUrl!);
  console.log(link);
  return (
    <iframe
      src={`https://www.facebook.com/plugins/video.php?&href=${link}&show_text=false&t=0`}
      width="100%"
      className="border-4 border-blue-500 aspect-auto "
      scrolling="no"
      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
    />
  );
}
