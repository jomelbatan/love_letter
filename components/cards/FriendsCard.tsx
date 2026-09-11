"use client";

import Link from "next/link";
import { User } from "lucide-react";
import Image from "next/image";

export interface FriendItem {
  id: string;
  name: string;
  mutualCount: number;
  avatarUrl?: string;
  profileUrl?: string;
}

interface FriendsCardProps {
  totalFriends?: number;
  mutualFriends?: number;
  friends?: FriendItem[];
  onSeeAll?: () => void;
}

const DEFAULT_FRIENDS: FriendItem[] = [
  {
    id: "1",
    name: "Christine",
    mutualCount: 65,
    avatarUrl:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "2",
    name: "Ronald Allan Sanz Jr.",
    mutualCount: 64,
    avatarUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "3",
    name: "Angel Valdez Villano",
    mutualCount: 107,
    avatarUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "4",
    name: "Cristine Villar",
    mutualCount: 112,
    // avatarUrl intentionally left undefined to demonstrate the fallback placeholder
  },
  {
    id: "5",
    name: "Albert Borres Batan",
    mutualCount: 71,
    avatarUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "6",
    name: "Fritz John Alcazaren Belvis",
    mutualCount: 80,
    avatarUrl:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "7",
    name: "Be Real",
    mutualCount: 127,
    avatarUrl:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "8",
    name: "Justine Mae Romualdo",
    mutualCount: 123,
    avatarUrl:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=300&h=300&fit=crop&auto=format",
  },
  {
    id: "9",
    name: "Nelson Bance",
    mutualCount: 80,
    avatarUrl:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&h=300&fit=crop&auto=format",
  },
];

export default function FriendsCard({
  totalFriends = 524,
  mutualFriends = 53,
  friends = DEFAULT_FRIENDS,
  onSeeAll,
}: FriendsCardProps) {
  return (
    <section className="bg-pure-chalk rounded-xl p-4 border border-soft-dust shadow-sm text-zinc-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-kalam-bold text-deep-charcoal tracking-tight">
          Friends
        </h2>
        <button
          onClick={onSeeAll}
          className="text-sm font-kalam text-text-brown hover:underline transition-colors"
        >
          See all friends
        </button>
      </div>

      {/* Subtitle / Counter */}
      <p className="text-sm font-kalam text-deep-charcoal/80 mb-4">
        {totalFriends.toLocaleString()}{" "}
        {mutualFriends > 0 && `(${mutualFriends} mutual)`}
      </p>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-3.5">
        {friends.slice(0, 9).map((friend) => (
          <div
            key={friend.id}
            className="group flex flex-col cursor-pointer select-none"
          >
            {/* Image Thumbnail */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-[#3a3b3c] mb-1.5 ring-1 ring-white/5">
              {friend.avatarUrl ? (
                <Image
                  src={friend.avatarUrl}
                  alt={friend.name}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-zinc-300 text-zinc-600">
                  <User className="w-12 h-12 stroke-[1.5]" />
                </div>
              )}
            </div>

            {/* Friend Name */}
            <span className="text-xs font-semibold text-deep-charcoal font-kalam-bold leading-tight line-clamp-2 group-hover:underline">
              {friend.name}
            </span>

            {/* Mutual Friends Count */}
            <span className="text-[11px] font-kalam text-deep-charcoal/80 leading-tight mt-0.5">
              {friend.mutualCount} mutual friends
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
