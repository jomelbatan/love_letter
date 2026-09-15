/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Indicator from "../loaders/Indicator";
import { getYouTubeMetadata, getYouTubeVideoId } from "@/helpers/link.helper";
import { PostProps } from "@/types/props";

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

  youtubeApiPromise = new Promise((resolve) => {
    window.onYouTubeIframeAPIReady = () => {
      resolve();
    };

    const existingScript = document.querySelector(
      'script[src="https://www.youtube.com/iframe_api"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");

    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;

    document.body.appendChild(script);
  });

  return youtubeApiPromise;
}

type YouTubeMetadata = {
  title: string;
  author_name: string;
  thumbnail_url: string;
};

export default function YouTubeMusic({ post }: PostProps) {
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const [metadata, setMetadata] = useState<YouTubeMetadata | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  const videoId = getYouTubeVideoId(post.embedUrl!);

  const handlePlayerStateChange = (event: any) => {
    switch (event.data) {
      case window.YT.PlayerState.PLAYING:
        setPlaying(true);
        break;

      case window.YT.PlayerState.PAUSED:
        setPlaying(false);
        break;

      case window.YT.PlayerState.ENDED:
        setPlaying(false);
        playerRef.current?.seekTo(0, true);
        break;
    }
  };

  const togglePlay = () => {
    if (!playerRef.current || !ready) return;

    if (playing) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

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

  useEffect(() => {
    let mounted = true;

    async function initPlayer() {
      try {
        await loadYouTubeAPI();

        if (!mounted || !playerContainerRef.current || playerRef.current) {
          return;
        }

        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          width: "100%",
          height: "100%",
          videoId,
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            rel: 0,
            playsinline: 1,
            modestbranding: 1,
          },

          events: {
            onReady: () => {
              if (!mounted) return;

              setReady(true);
            },

            onStateChange: handlePlayerStateChange,
          },
        });
      } catch (error) {
        console.error("Failed to initialize YouTube player:", error);
      }
    }

    initPlayer();

    return () => {
      mounted = false;

      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId]);

  if (!metadata) {
    return (
      <div className="flex min-h-48 w-full items-center justify-center rounded-2xl bg-peach-milk">
        <div className="size-8 animate-spin rounded-full border-2 border-primary-orange/30 border-t-primary-orange" />
      </div>
    );
  }

  return (
    <div
      onClick={togglePlay}
      className="group relative w-full cursor-pointer select-none overflow-hidden
      rounded-2xl bg-peach-milk text-chalk-terracotta"
    >
      {/* Hidden YouTube player */}
      <div
        ref={playerContainerRef}
        className="pointer-events-none absolute left-[-9999px] top-0 h-px w-px overflow-hidden"
        aria-hidden="true"
      />

      <div className="flex items-center gap-5 p-4">
        {/* Album art */}
        <div className="relative size-24 shrink-0">
          <div
            className={`absolute inset-0 rounded-full bg-[#272727] shadow-xl transition-transform
              duration-300 ${playing ? "animate-[spin_8s_linear_infinite]" : ""}`}
          >
            <div className="absolute inset-3 overflow-hidden rounded-full">
              <Image
                src={metadata.thumbnail_url}
                alt={metadata.title}
                fill
                sizes="1080px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Loading */}
          {!ready && (
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-primary-orange/80 backdrop-blur-sm">
              <div className="size-8 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            </div>
          )}
        </div>

        {/* Song information */}
        <div className="flex min-w-0 flex-1 flex-col justify-center py-2">
          <h2 className="truncate text-xl font-kalam-bold">
            {metadata?.title}
          </h2>

          {metadata?.author_name && (
            <p className="truncate text-sm opacity-80">
              {metadata.author_name}
            </p>
          )}
        </div>
      </div>

      <Indicator isPlaying={playing} />
    </div>
  );
}
