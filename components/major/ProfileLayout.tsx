"use client";

import { SlidersHorizontal } from "lucide-react";
import PhotoCard from "../cards/PhotoCard";
import PersonalDetailsCard from "../cards/PersonalDetailsCard";
import Locked from "../cards/Locked";
import PostCard from "../cards/PostCard";
import { useEffect, useRef, useState } from "react";
import FriendsCard from "../cards/FriendsCard";
import { AuthorProps } from "@/types/props";
import { usePost } from "@/providers/PostProvider";
import PostCardSkeleton from "../loaders/Skeleton";
import AccountOwnership from "../cards/AccountOwnership";

// How far the aside sits from the top of the viewport when it's pinned to
// the top (short content), vs from the bottom when it's pinned to the
// bottom (tall content).
const STICKY_TOP_OFFSET = 98;
const STICKY_BOTTOM_OFFSET = 16;

export default function ProfileLayout({ author }: AuthorProps) {
  const { posts, loadMore, status, isLoading } = usePost();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const asideContentRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(STICKY_TOP_OFFSET);

  const isLoadingMore = status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  useEffect(() => {
    const element = asideContentRef.current;
    if (!element) return;

    const evaluate = () => {
      const contentHeight = element.scrollHeight;
      const viewportHeight = window.innerHeight;

      // Clamp top so the aside never sticks below STICKY_TOP_OFFSET (short
      // content stays pinned 100px from the top), and never sticks above the
      // point where its bottom edge meets STICKY_BOTTOM_OFFSET from the
      // bottom (tall content pins 16px from the bottom instead, scrolling
      // its top edge off-screen as needed).
      const clampedTop = Math.min(
        STICKY_TOP_OFFSET,
        viewportHeight - contentHeight - STICKY_BOTTOM_OFFSET,
      );

      setStickyTop(clampedTop);
    };

    evaluate();

    const resizeObserver = new ResizeObserver(evaluate);
    resizeObserver.observe(element);
    window.addEventListener("resize", evaluate);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", evaluate);
    };
  }, [author]);

  useEffect(() => {
    const element = loadMoreRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting && status === "CanLoadMore") {
          loadMore(10);
        }
      },
      {
        rootMargin: "0px 0px 500px 0px",
      },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [loadMore, status]);

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-4">
          <aside>
            <div
              ref={asideContentRef}
              className="lg:sticky flex flex-col gap-4"
              style={{ top: stickyTop }}
            >
              {(author.personalDetails ||
                author.work ||
                author.education ||
                author.contactInfo) && <PersonalDetailsCard author={author} />}
              {<FriendsCard />}
              {<PhotoCard />}
            </div>
          </aside>

          <main className="space-y-4">
            {author.privacy &&
              author.privacy === "PRIVATE" &&
              posts.length === 0 && <Locked name={author.name} />}
            {author.status && author.status === "VACANT" && (
              <AccountOwnership />
            )}
            <div className="bg-pure-chalk rounded-xl p-3.5 border border-soft-dust flex items-center justify-between">
              <h2 className="text-xl font-kalam-bold text-deep-charcoal">
                Posts
              </h2>

              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-kalam border-primary-orange text-sm font-semibold transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            {!isLoading && posts.length === 0 && (
              <h1 className="text-3xl font-kalam-bold text-deep-charcoal text-center">
                No Post Available
              </h1>
            )}

            {isLoading &&
              posts.length === 0 &&
              Array.from({ length: 3 }).map((_, index) => (
                <PostCardSkeleton key={index} />
              ))}
            {posts.map((post) => (
              <PostCard key={post._id} post={post} author={author} />
            ))}

            {/* Infinite scroll trigger */}
            <div
              ref={loadMoreRef}
              className="py-6 flex justify-center border-t border-soft-dust"
            >
              {isLoadingMore ? (
                <PostCardSkeleton />
              ) : hasMore ? (
                <PostCardSkeleton />
              ) : posts.length > 0 ? (
                <span className="  text-3xl font-kalam-bold text-deep-charcoal text-center">{`You've reached the end`}</span>
              ) : null}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
