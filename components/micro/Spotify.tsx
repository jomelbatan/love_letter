import React from "react";
import { VideoPostProps } from "./FacebookReel";
import { getSpotifyInfo } from "@/helpers/link.helper";

export default function Spotify({ post }: VideoPostProps) {
  const info = getSpotifyInfo(post.embedUrl!);
  return (
    <iframe
      data-testid="embed-iframe"
      className="rounded-xl"
      src={`https://open.spotify.com/embed/${info?.type}/${info?.id}?utm_source=generator&si=e14abaede46b449a`}
      width="100%"
      height="352"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading="lazy"
    ></iframe>
  );
}
