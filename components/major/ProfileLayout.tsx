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

// Matches the 1rem (16px) gap used for top-4 / bottom-4
const STICKY_OFFSET = 16;

export default function ProfileLayout({ author }: AuthorProps) {
  const { posts, loadMore, status, isLoading } = usePost();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const asideContentRef = useRef<HTMLDivElement>(null);
  const [stickyTop, setStickyTop] = useState(STICKY_OFFSET);

  const isLoadingMore = status === "LoadingMore";
  const hasMore = status === "CanLoadMore";

  useEffect(() => {
    const element = asideContentRef.current;
    if (!element) return;

    const evaluate = () => {
      const contentHeight = element.scrollHeight;
      const viewportHeight = window.innerHeight;
      const available = viewportHeight - STICKY_OFFSET * 2;

      if (contentHeight <= available) {
        setStickyTop(STICKY_OFFSET);
      } else {
        setStickyTop(viewportHeight - contentHeight - STICKY_OFFSET);
      }
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
            {author.name !== "Melo" && <Locked name={author.name} />}

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
                <>
                  <PostCardSkeleton />
                  <div className="flex items-center gap-2 text-3xl font-kalam-bold text-deep-charcoal text-center">
                    <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                    Loading more posts...
                  </div>
                </>
              ) : hasMore ? (
                <span className="text-3xl font-kalam-bold text-deep-charcoal text-center">
                  Loading more when you get closer...
                </span>
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
