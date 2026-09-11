"use client";

import { useState, useEffect, useRef } from "react";
import { SlidersHorizontal } from "lucide-react";
import PhotoCard from "./cards/PhotoCard";
import PersonalDetailsCard from "./cards/PersonalDetailsCard";

import { AuthorandPostProps } from "./pages/TimelinePage";
import Locked from "./cards/Locked";
import PostCard from "./cards/PostCard";
export default function ProfileLayout({ author, posts }: AuthorandPostProps) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadMorePosts = () => {};

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          loadMorePosts();
        }
      },
      { threshold: 0.2 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [isLoadingMore]);

  return (
    <div className="w-full">
      <div className="max-w-6xl mx-auto">
        {/* Parent container: items-start is required so the sticky column has scroll room */}
        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] items-start gap-4">
          {/* ================= LEFT SIDEBAR (STICKY) ================= */}
          {/* 
            - 'sticky top-4': sticks 16px from the top once scrolled to.
            - If the sidebar is taller than viewport, use:
              'sticky top-[min(1rem,calc(100vh-100%-1rem))]' so it scrolls to its bottom first.
          */}
          <aside className="lg:sticky lg:top-4 space-y-4">
            {(author.personalDetails ||
              author.work ||
              author.education ||
              author.contactInfo) && <PersonalDetailsCard author={author} />}

            {/* Photos Card */}
            <PhotoCard />
          </aside>

          {/* ================= RIGHT FEED (INFINITELY SCROLLS) ================= */}
          <main className="space-y-4">
            {/* Featured Section */}
            {author.name !== "Melo" && <Locked name={author.name} />}
            {/* Posts Header */}
            <div className="bg-pure-chalk rounded-xl p-3.5 border border-soft-dust flex items-center justify-between">
              <h2 className="text-xl font-kalam-bold text-deep-charcoal">
                Posts
              </h2>
              <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 font-kalam border-primary-orange text-sm font-semibold transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>
            {author.name !== "Melo" && (
              <h1 className="text-3xl font-kalam-bold text-deep-charcoal text-center">
                No Post Available
              </h1>
            )}
            {/* Dynamic Post Feed */}
            {posts.page.map((post) => (
              <PostCard key={post._id} post={post} author={author} />
            ))}

            {/* Infinite Scroll Trigger element */}
            <div
              ref={loadMoreRef}
              className="py-6 flex justify-center text-sm text-zinc-400"
            >
              {isLoadingMore ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                  Loading more posts...
                </div>
              ) : (
                <span>Scroll down to load more...</span>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
