/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Indicator from "../loaders/Indicator";
import { getYouTubeMetadata, getYouTubeVideoId } from "@/helpers/link.helper";
import { PostProps } from "@/types/props";

type YouTubeMetadata = {
  title: string;
  author_name: string;
  thumbnail_url: string;
};

let youtubeApiPromise: Promise<void> | null = null;
function loadYouTubeAPI(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("YouTube API can only be loaded in the browser."),
    );
  }
  if (window.YT?.Player) {
    return Promise.resolve();
  }
  if (youtubeApiPromise) {
    return youtubeApiPromise;
  }
  youtubeApiPromise = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      youtubeApiPromise = null;
      reject(new Error("Timed out waiting for the YouTube iframe API."));
    }, 10000);

    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      clearTimeout(timeout);
      previousCallback?.(); // don't clobber another listener if one's already registered
      resolve();
    };
  });
  return youtubeApiPromise;
}
export default function YouTubeMusic({ post }: PostProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
  const [ready, setReady] = useState(false);
  const [playerLoading, setPlayerLoading] = useState(false);
  const [playing, setPlaying] = useState(false);

  const videoId = getYouTubeVideoId(post.embedUrl!);

  const handlePlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT?.PlayerState.PLAYING:
        setPlayerLoading(false);
        setPlaying(true);
        break;

      case window.YT?.PlayerState.PAUSED:
        setPlaying(false);
        break;

      case window.YT?.PlayerState.ENDED:
        setTimeout(playerRef.current.stopVideo(), 1000);
        setPlaying(false);

        break;
    }
  };

  const ensurePlayer = async () => {
    if (playerRef.current || !playerContainerRef.current) return;
    setPlayerLoading(true);
    try {
      await loadYouTubeAPI();
      if (!playerContainerRef.current || playerRef.current) return;
      await new Promise<void>((resolve) => {
        playerRef.current = new window.YT.Player(playerContainerRef.current!, {
          width: "100%",
          height: "100%",
          videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
          },
          events: {
            onReady: () => {
              setReady(true);
              resolve();
            },
            onStateChange: handlePlayerStateChange,
          },
        });
      });
    } catch (error) {
      console.error("Failed to initialize YouTube player:", error);
    }
  };

  const togglePlay = async () => {
    if (playerLoading) return;

    if (!playerRef.current) {
      await ensurePlayer();
      return; // autoplay: 1 starts it once onReady fires
    }

    if (!ready) return;

    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  useEffect(() => {
    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    async function fetchMetadata() {
      try {
        const data = await getYouTubeMetadata(post.embedUrl!);

        setMetadata(data);
      } catch (error) {
        console.error("Failed to fetch YouTube metadata:", error);
      }
    }

    fetchMetadata();
  }, [post]);

  if (!metadata) {
    return (
      <div className="group relative w-full rounded-2xl bg-peach-milk">
        <div className="flex flex-row items-center gap-5 p-4">
          <div className="relative size-24 shrink-0">
            <div className="animate-pulse absolute inset-0 flex items-center justify-center rounded-full bg-primary-orange backdrop-blur-sm" />
          </div>
          {/* Song information */}
          <div className="flex flex-col gap-3">
            <div className="h-4 animate-pulse w-40 rounded-full bg-primary-orange" />
            <div className="h-2 w-20 animate-pulse rounded-full bg-primary-orange" />
          </div>
        </div>
      </div>
    );
  }
  const titleSize =
    metadata.title.length > 60
      ? "text-sm lg:text-xl"
      : metadata.title.length > 40
        ? "text-base lg:text-xl"
        : "text-lg lg:text-xl";
  return (
    <div
      onClick={togglePlay}
      className="group relative w-full cursor-pointer select-none
      rounded-2xl bg-peach-milk text-chalk-terracotta"
    >
      {/* Hidden YouTube player */}
      <div
        ref={playerContainerRef}
        className="pointer-events-none absolute left-[-9999px] top-0 h-px w-px"
        aria-hidden="true"
      />

      <div className="flex items-center gap-5 p-4">
        {/* Album art */}
        <div className="relative size-24 shrink-0">
          <div
            className={`absolute inset-0 rounded-full bg-[#272727] shadow-xl transition-transform
              duration-300 ${playing ? "animate-[spin_8s_linear_infinite]" : ""} ${
                playerLoading ? "animate-pulse" : ""
              }`}
          >
            <div className="absolute inset-3 overflow-hidden rounded-full">
              <Image
                src={metadata.thumbnail_url}
                alt={metadata.title}
                fill
                priority
                sizes="1080px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Loading */}
        </div>

        {/* Song information */}
        <div className="flex min-w-0 flex-1 flex-col justify-center py-2">
          <h2
            className={`line-clamp-4 max-w-full font-kalam-bold ${titleSize}`}
          >
            {metadata.title}
          </h2>

          {metadata?.author_name && (
            <p className="truncate text-sm opacity-80">
              {metadata.author_name}
            </p>
          )}
        </div>
      </div>

      <Indicator isPlaying={playing} isLoading={playerLoading} />
    </div>
  );
}
