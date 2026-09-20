import { Play } from "lucide-react";

export function YoutubeCard() {
  return (
    <div className="group relative min-h-70 overflow-hidden rounded-lg bg-video">
      <div className="absolute inset-0 grid grid-cols-5 gap-3 p-6 opacity-55">
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="rounded-full bg-video-dot" />
        ))}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-foreground/10 text-video-foreground">
        <span className="grid size-16 place-items-center rounded-full bg-youtube shadow-lg transition-transform group-hover:scale-105">
          <Play className="ml-1 size-7" fill="currentColor" />
        </span>
        <h4 className="mt-5 font-kalam-bold text-2xl font-bold">
          A tiny concert for a rainy day
        </h4>
        <p className="mt-1 text-sm opacity-80">4:18 · shared from YouTube</p>
      </div>
    </div>
  );
}
