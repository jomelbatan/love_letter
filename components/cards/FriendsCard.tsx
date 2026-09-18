"use client";

import Link from "next/link";
import { User } from "lucide-react";
import Image from "next/image";
import { formatWordS } from "@/libs/format";
import { FriendsCardSkeleton } from "../loaders/Skeleton";
import { useProfile } from "@/providers/ProfileProvider";

export interface FriendItem {
  id: string;
  name: string;
  mutualCount: number;
  avatarUrl?: string;
  profileUrl?: string;
}

export default function FriendsCard() {
  const { friends, friendsLoading, friendsCount } = useProfile();
  return (
    <section className="bg-pure-chalk rounded-xl p-4 border border-soft-dust shadow-sm text-zinc-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <h2 className="text-xl font-kalam-bold text-deep-charcoal tracking-tight">
          Friends
        </h2>
        <button
          onClick={() => {}}
          className="text-sm font-kalam text-text-brown hover:underline transition-colors"
        >
          See all friends
        </button>
      </div>

      {/* Subtitle / Counter */}
      <p className="text-sm font-kalam text-deep-charcoal/80 mb-4">
        {`${friendsCount} ${formatWordS("friend", friendsCount)}`}
      </p>

      {/* 3x3 Grid */}
      <div className="grid grid-cols-3 gap-x-3 gap-y-3.5">
        {friendsLoading ? (
          <FriendsCardSkeleton />
        ) : (
          friends.map((friend) => (
            <Link href={`/${friend.name}`} key={friend._id}>
              <div className="group flex flex-col cursor-pointer select-none">
                {/* Image Thumbnail */}
                <div className="avatar relative shrink-0 size-28  rounded-full lg:rounded-xl bg-chalk-cream overflow-hidden">
                  {friend.avatarUrl ? (
                    <Image
                      src={friend.avatarUrl}
                      alt={friend.name}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-zinc-300 text-zinc-600">
                      <User className="w-12 h-12 stroke-[1.5]" />
                    </div>
                  )}
                </div>

                {/* Friend Name */}
                <span className="text-center lg:text-start text-lg font-semibold text-deep-charcoal font-kalam-bold leading-tight line-clamp-2 group-hover:underline">
                  {friend.name}
                </span>

                {/* Mutual Friends Count */}
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
