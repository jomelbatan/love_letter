import { Loader2, Play } from "lucide-react";
import React from "react";

interface IndicatorProps {
  isPlaying: boolean;
  isLoading?: boolean;
}

export default function Indicator({ isPlaying, isLoading }: IndicatorProps) {
  const bars = [
    { delay: "0ms", duration: "800ms" },
    { delay: "200ms", duration: "1000ms" },
    { delay: "400ms", duration: "750ms" },
  ];

  return (
    <div
      className={`flex items-end gap-1 h-6 absolute right-4 bottom-2`}
      aria-label={isLoading ? "Loading track" : "Audio wave"}
    >
      {isLoading ? (
        <Loader2 className="size-5 animate-spin" aria-hidden="true" />
      ) : isPlaying ? (
        bars.map((bar, i) => (
          <span
            key={i}
            className={`w-1 rounded-full bg-chalk-terracotta transition-all duration-300 animate-music-bar`}
            style={
              isPlaying
                ? {
                    animationDelay: bar.delay,
                    animationDuration: bar.duration,
                  }
                : undefined
            }
          />
        ))
      ) : (
        <Play />
      )}
    </div>
  );
}
