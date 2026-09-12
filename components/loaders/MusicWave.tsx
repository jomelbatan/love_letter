"use client";

import React from "react";

interface MusicWaveProps {
  isPlaying?: boolean;
  color?: string; // Tailwind background color class, e.g. "bg-emerald-500"
  className?: string;
}

export default function MusicWave({
  isPlaying = true,
  color = "bg-emerald-500",
  className = "",
}: MusicWaveProps) {
  const bars = [
    { delay: "0ms", duration: "800ms" },
    { delay: "200ms", duration: "1000ms" },
    { delay: "400ms", duration: "750ms" },
  ];

  return (
    <div
      className={`flex items-end gap-1 h-6 ${className}`}
      aria-label="Audio wave"
    >
      {bars.map((bar, i) => (
        <span
          key={i}
          className={`w-1 rounded-full ${color} transition-all duration-300 ${
            isPlaying ? "animate-music-bar" : "h-1.5 opacity-60"
          }`}
          style={
            isPlaying
              ? {
                  animationDelay: bar.delay,
                  animationDuration: bar.duration,
                }
              : undefined
          }
        />
      ))}
    </div>
  );
}
