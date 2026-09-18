"use client";

import { useState } from "react";
import { usePlaylist } from "@/providers/PlaylistProvider";
import YouTubeMusic from "../micro/YoutubeMusic";
import SpotifyCustom from "../micro/SpotifyCustom";

function PlaylistCardSkeleton() {
  return (
    <div className="group relative w-full rounded-2xl bg-peach-milk">
      <div className="flex flex-row items-center gap-5 p-4">
        <div className="relative size-24 shrink-0">
          <div className="animate-pulse absolute inset-0 flex items-center justify-center rounded-full bg-primary-orange backdrop-blur-sm" />
        </div>
        <div className="flex flex-col gap-3">
          <div className="h-4 animate-pulse w-40 rounded-full bg-primary-orange" />
          <div className="h-2 w-20 animate-pulse rounded-full bg-primary-orange" />
        </div>
      </div>
    </div>
  );
}

export default function Playlist({ authorName }: { authorName: string }) {
  const { playlist, loadMore, status, isLoading } = usePlaylist();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const playNext = () => {
    setActiveIndex((prev) => {
      if (prev === null) return null;
      const next = prev + 1;
      return next < playlist.length ? next : null;
    });
  };

  const isFirstLoad = status === "LoadingFirstPage";
  const isLoadingMore = status === "LoadingMore";
  const canLoadMore = status === "CanLoadMore";

  return (
    <section className="bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <h2 className="text-xl font-kalam-bold text-deep-charcoal mb-4">{`${authorName}'s Playlist`}</h2>

      {isFirstLoad && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <PlaylistCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isFirstLoad && playlist.length > 0 && (
        <>
          <div className="flex flex-col gap-4">
            {playlist.map((p, index) =>
              p.embedType === "YOUTUBE_MUSIC" ? (
                <YouTubeMusic
                  key={p._id}
                  post={p}
                  playlistMode
                  isActive={index === activeIndex}
                  onEnded={playNext}
                  onSelect={() => setActiveIndex(index)}
                />
              ) : (
                <SpotifyCustom key={p._id} post={p} />
              ),
            )}

            {isLoadingMore &&
              Array.from({ length: 2 }).map((_, i) => (
                <PlaylistCardSkeleton key={`more-${i}`} />
              ))}
          </div>

          {canLoadMore && (
            <button
              type="button"
              onClick={() => loadMore(10)}
              disabled={isLoading}
              className="mt-4 w-full rounded-xl border border-soft-dust py-2 text-sm font-kalam-bold text-deep-charcoal transition-opacity disabled:opacity-50"
            >
              {isLoadingMore ? "Loading..." : "Load more"}
            </button>
          )}
        </>
      )}

      {!isFirstLoad && playlist.length === 0 && (
        <p className="text-sm text-deep-charcoal/60">No tracks yet.</p>
      )}
    </section>
  );
}
