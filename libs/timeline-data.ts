import { avatars } from "@/data";
import { Facebook, Instagram, Youtube } from "feather-icons-react";
import { Heart, Music2, type LucideIcon } from "lucide-react";
import { StaticImageData } from "next/image";

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
  { profile: StaticImageData; name: string; time: string }
> = {
  note: { profile: avatars["rabbit"], name: "little bunny", time: "just now" },
  spotify: { profile: avatars["bear"], name: "honey bear", time: "8 min ago" },
  youtube: { profile: avatars["cat"], name: "calico cat", time: "24 min ago" },
  instagram: {
    profile: avatars["seal"],
    name: "sleepy seal",
    time: "1 hr ago",
  },
  facebook: {
    profile: avatars["otter"],
    name: "pocket otter",
    time: "yesterday",
  },
};
