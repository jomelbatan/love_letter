import { Music2, Play } from "lucide-react";

export function SpotifyCard() {
  return (
    <div className="min-h-70 rounded-lg bg-spotify p-6 text-spotify-foreground sm:p-8">
      <div className="flex h-full min-h-57.5 flex-col justify-between">
        <Music2 className="size-8" />
        <div>
          <p className="text-xs font-bold uppercase tracking-wider opacity-70">
            On repeat tonight
          </p>
          <h4 className="mt-2 text-3xl font-bold">Sweet Disposition</h4>
          <p className="mt-1 opacity-75">The Temper Trap</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="grid size-12 place-items-center rounded-full bg-spotify-foreground text-spotify">
            <Play className="ml-0.5 size-5" fill="currentColor" />
          </span>
          <div className="h-1 flex-1 rounded-full bg-spotify-foreground/25">
            <div className="h-full w-1/3 rounded-full bg-spotify-foreground" />
          </div>
          <span className="text-xs">2:14</span>
        </div>
      </div>
    </div>
  );
}
