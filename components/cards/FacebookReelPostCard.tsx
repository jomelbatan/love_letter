import { Doc } from "@/convex/_generated/dataModel";
import { getTimeAgo } from "@/libs/date";
import { BadgeCheck, Globe, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { FacebookReel } from "../micro/FacebookReel";

interface FacebookReelPostCardProps {
  post: Doc<"posts">;
  author: Doc<"authors">;
}

export default function FacebookReelPostCard({
  post,
  author,
}: FacebookReelPostCardProps) {
  if (!post) return null;

  return (
    <article
      key={post._id}
      className="bg-pure-chalk rounded-xl p-4 border border-soft-dust space-y-3 shadow-sm"
    >
      {/* Sharer / Author Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="avatar size-14 bg-chalk-cream rounded-full border border-chalk-terracotta relative overflow-hidden">
            <Image
              src={author.avatarUrl}
              alt={`${author.name}'s avatar`}
              fill
              className="object-cover rounded-full"
            />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <span className="font-kalam-bold text-2xl leading-tight">
                {author.name}
              </span>
              <BadgeCheck className="size-5 text-blue-500 fill-blue-500/20" />
            </div>
            <div className="flex items-center gap-1 text-xs text-zinc-400">
              <span>{getTimeAgo(post._creationTime)}</span>
              <span>·</span>
              <Globe className="w-3 h-3 inline" />
            </div>
          </div>
        </div>

        <button
          type="button"
          aria-label="More options"
          className="text-zinc-400 hover:text-zinc-600 p-1 rounded-md transition-colors"
        >
          <MoreHorizontal className="w-5 h-5" />
        </button>
      </div>

      {/* Post Caption (if the sharer added thoughts) */}
      {post.text && (
        <p className="text-xl font-bold font-yuyu text-deep-charcoal leading-snug">
          {post.text}
        </p>
      )}

      {/* Nested Facebook Reel Container */}
      {post.embedUrl && <FacebookReel post={post} />}
    </article>
  );
}
