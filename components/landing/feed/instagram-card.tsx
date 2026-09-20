import { Instagram } from "feather-icons-react";

export function InstagramCard() {
  return (
    <div className="grid min-h-70 overflow-hidden rounded-lg border border-border sm:grid-cols-2">
      <div className="relative min-h-52 bg-pink">
        <div className="absolute inset-4 rounded-full border-18 border-card/40" />
        <div className="absolute inset-0 grid place-items-center text-7xl">
          🌷
        </div>
      </div>
      <div className="flex flex-col justify-center p-6">
        <Instagram className="size-6 text-instagram" />
        <p className="mt-5 font-kalam-bold text-2xl font-bold">
          Today looked a little like this.
        </p>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          quiet streets, pink flowers, and nowhere to be for once.
        </p>
        <p className="mt-5 text-xs font-bold text-instagram">
          View on Instagram
        </p>
      </div>
    </div>
  );
}
