import type { FeedType } from "@/libs/timeline-data";
import { NoteCard } from "./note-card";
import { SpotifyCard } from "./spotify-card";
import { YoutubeCard } from "./youtube-card";
import { InstagramCard } from "./instagram-card";
import { FacebookCard } from "./facebook-card";

export function FeedContent({ type }: { type: FeedType }) {
  switch (type) {
    case "note":
      return <NoteCard />;
    case "spotify":
      return <SpotifyCard />;
    case "youtube":
      return <YoutubeCard />;
    case "instagram":
      return <InstagramCard />;
    case "facebook":
      return <FacebookCard />;
  }
}
