import { Facebook, Instagram, Youtube } from "feather-icons-react";
import { Heart, Music2, type LucideIcon } from "lucide-react";

export type FeedType =
  "note" | "spotify" | "youtube" | "instagram" | "facebook";

export const feedTabs: {
  id: FeedType;
  label: string;
  icon: LucideIcon | typeof Youtube;
}[] = [
  { id: "note", label: "Note", icon: Heart },
  { id: "spotify", label: "Spotify", icon: Music2 },
  { id: "youtube", label: "YouTube", icon: Youtube },
  { id: "instagram", label: "Instagram", icon: Instagram },
  { id: "facebook", label: "Facebook", icon: Facebook },
];

export const animalProfiles: Record<
  FeedType,
  { emoji: string; name: string; time: string }
> = {
  note: { emoji: "🐰", name: "little bunny", time: "just now" },
  spotify: { emoji: "🐻", name: "honey bear", time: "8 min ago" },
  youtube: { emoji: "🐱", name: "calico cat", time: "24 min ago" },
  instagram: { emoji: "🦊", name: "sleepy fox", time: "1 hr ago" },
  facebook: { emoji: "🐼", name: "pocket panda", time: "yesterday" },
};
