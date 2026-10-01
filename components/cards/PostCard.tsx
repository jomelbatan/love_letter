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
import { Instagram } from "../micro/Instagram";
import YouTubeMusic from "../micro/YoutubeMusic";
import { MentionText } from "../micro/MentionText";
import { SimpleShareButton } from "../button/SimpleShareButton";
import { getPostUrl } from "@/libs/format";
import Watermark from "../micro/Watermark";
import Link from "next/link";

export default function PostCard({
  post,
  author,
  watermark = false,
  disableAuthorLink = true,
}: {
  post: Doc<"posts">;
  author: Doc<"authors">;
  watermark?: boolean;
  disableAuthorLink?: boolean;
}) {
  if (!post) return;
  const postUrl = getPostUrl(author.name, post._id);
  return (
    <article className="relative bg-pure-chalk rounded-xl p-4 border border-soft-dust space-y-3 flex h-fit flex-col items-center">
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
              {disableAuthorLink ? (
                <span className="font-kalam-bold text-2xl">{author.name}</span>
              ) : (
                <Link href={`/${author.name.toLowerCase()}`}>
                  <span className="font-kalam-bold text-2xl">
                    {author.name}
                  </span>
                </Link>
              )}
              <BadgeCheck className="size-5" />
            </div>
            <div className="flex items-center text-xs text-zinc-400">
              <span>{getTimeAgo(post._creationTime)}</span>
              <span>·</span>
              <Globe className="w-3 h-3 inline" />
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-4">
          <SimpleShareButton textToCopy={postUrl} />
          <CopyButton textToCopy={post._id} />
        </div>
      </div>
      {post.text && (
        <p className="px-2 w-full text-3xl font-bold font-yuyu text-deep-charcoal  leading-none">
          <MentionText text={post.text} />
        </p>
      )}
      {post.embedUrl && post.embedType === "FACEBOOK" && (
        <FacebookReel post={post} />
      )}
      {post.embedUrl && post.embedType === "INSTAGRAM" && (
        <Instagram post={post} />
      )}
      {post.embedUrl && post.embedType === "TIKTOK" && <Tiktok post={post} />}
      {post.embedUrl && post.embedType === "YOUTUBE" && <Youtube post={post} />}
      {post.embedUrl && post.embedType === "YOUTUBE_MUSIC" && (
        <YouTubeMusic post={post} />
      )}
      {post.embedUrl && post.embedType === "SPOTIFY" && <Spotify post={post} />}
      {watermark && <Watermark />}
    </article>
  );
}
