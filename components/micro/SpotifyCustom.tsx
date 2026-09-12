/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image"; // or your framework's image component
import Indicator from "../loaders/Indicator";
import { VideoPostProps } from "./FacebookReel";

interface SpotifyMetadata {
  title: string;
  author_name: string;
  thumbnail_url: string;
}

export default function SpotifyCustom({ post }: VideoPostProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const embedRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<any>(null);

  const [metadata, setMetadata] = useState<SpotifyMetadata | null>(null);
  const [api, setApi] = useState<any>(null);

  const [isReady, setIsReady] = useState(false);
  const [isPaused, setIsPaused] = useState(true);

  const url = post.embedUrl!;

  // Metadata
  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    async function fetchMetadata() {
      try {
        const response = await fetch(
          `https://open.spotify.com/oembed?url=${encodeURIComponent(url)}`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Spotify metadata");
        }

        const data = await response.json();

        setMetadata({
          title: data.title,
          author_name: data.author_name,
          thumbnail_url: data.thumbnail_url,
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error(error);
        }
      }
    }

    fetchMetadata();

    return () => controller.abort();
  }, [url]);

  // Spotify iframe API
  useEffect(() => {
    if (window.onSpotifyIframeApiReady) return;

    const script = document.createElement("script");
    script.src = "https://open.spotify.com/embed/iframe-api/v1";
    script.async = true;

    document.body.appendChild(script);

    window.onSpotifyIframeApiReady = (SpotifyIframeApi) => {
      setApi(SpotifyIframeApi);
    };

    return () => {
      script.remove();
    };
  }, []);

  // Create Spotify controller
  useEffect(() => {
    if (!api || !embedRef.current || controllerRef.current) {
      return;
    }

    api.createController(
      embedRef.current,
      {
        width: "1",
        height: "1",
        url,
      },
      (controller: any) => {
        controllerRef.current = controller;

        controller.addListener("ready", () => {
          setIsReady(true);
        });

        controller.addListener("playback_update", (event: any) => {
          const { isPaused } = event.data;

          setIsPaused(isPaused ?? true);
        });
      },
    );

    return () => {
      controllerRef.current = null;
      setIsReady(false);
    };
  }, [api, url]);

  // Pause when card leaves viewport
  useEffect(() => {
    if (!isReady || !cardRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          controllerRef.current?.pause();
        }
      },
      {
        threshold: 0.1,
      },
    );

    observer.observe(cardRef.current);

    return () => observer.disconnect();
  }, [isReady]);

  const togglePlay = () => {
    if (!isReady) return;

    controllerRef.current?.togglePlay();
  };

  const loading = !metadata || !isReady;

  return (
    <div
      ref={cardRef}
      onClick={togglePlay}
      className="group relative w-full cursor-pointer select-none overflow-hidden rounded-2xl bg-peach-milk text-chalk-terracotta"
    >
      {/* Loading skeleton */}
      <div
        className={`absolute inset-0 z-20 flex h-24 w-full items-center gap-4 transition-opacity duration-200 ${
          loading ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <div className="size-24 shrink-0 animate-pulse rounded-l-2xl bg-peach-milk-dark" />

        <div className="flex flex-1 flex-col gap-2 pr-4">
          <div className="h-5 w-2/3 animate-pulse rounded bg-peach-milk-dark" />
          <div className="h-4 w-1/3 animate-pulse rounded bg-peach-milk-dark" />
        </div>

        <div className="mr-4 size-6 animate-pulse rounded-full bg-peach-milk-dark" />
      </div>

      {/* Actual card — always mounted */}
      <div
        className={`relative z-10 flex h-24 w-full items-center gap-4 pr-4 transition-opacity duration-200 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        {metadata?.thumbnail_url && (
          <Image
            src={metadata.thumbnail_url}
            alt={metadata.title ?? ""}
            width={300}
            height={300}
            className="size-24 shrink-0 rounded-l-2xl object-cover"
          />
        )}

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

        <Indicator isPlaying={!isPaused} />
      </div>

      {/* Spotify controller */}
      <div
        ref={embedRef}
        className="pointer-events-none absolute left-0 top-0 h-px w-px overflow-hidden opacity-0"
      />
    </div>
  );
}
