import { Doc } from "@/convex/_generated/dataModel";
import { getTimeAgo } from "@/libs/date";
import { BadgeCheck, Globe } from "lucide-react";
import Image from "next/image";
import React from "react";
import { FacebookReel } from "../micro/FacebookReel";
import Tiktok from "../micro/Tiktok";
import Youtube from "../micro/Youtube";
import Spotify from "../micro/Spotify";
import { CopyButton } from "../button/CopyButton";
import { InstagramEmbed } from "../micro/Instagram";

export default function PostCard({
  post,
  author,
}: {
  post: Doc<"posts">;
  author: Doc<"authors">;
}) {
  if (!post) return;
  return (
    <article className="relative bg-pure-chalk rounded-xl p-4 border border-soft-dust space-y-3 flex h-fit flex-col items-center justify-center">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar size-14 bg-chalk-cream rounded-full border border-chalk-terracotta">
            <Image
              src={author.avatarUrl}
              alt={`${author.name}'s avatar`}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-kalam-bold text-2xl">{author.name}</span>
              <BadgeCheck className="size-5" />
            </div>
            <div className="flex items-center text-xs text-zinc-400">
              <span>{getTimeAgo(post._creationTime)}</span>
              <span>·</span>
              <Globe className="w-3 h-3 inline" />
            </div>
          </div>
        </div>

        <CopyButton textToCopy={post._id} />
      </div>

      {post.text && (
        <p className="px-2 w-full text-3xl font-bold font-yuyu text-deep-charcoal  leading-none">
          {post.text}
        </p>
      )}

      {post.embedUrl && post.embedType === "FACEBOOK" && (
        <FacebookReel post={post} />
      )}
      {post.embedUrl && post.embedType === "INSTAGRAM" && (
        <InstagramEmbed post={post} />
      )}
      {post.embedUrl && post.embedType === "TIKTOK" && <Tiktok post={post} />}
      {post.embedUrl && post.embedType === "YOUTUBE" && <Youtube post={post} />}
      {post.embedUrl && post.embedType === "SPOTIFY" && <Spotify post={post} />}
    </article>
  );
}
