import Image from "next/image";
import { ArrowRight, MessageCircleHeart, Sparkles } from "lucide-react";
import { Button } from "@/components/button/button";
import mascotArt from "@/public/covers/girl.png";

export function HeroSection() {
  return (
    <section
      id="top"
      className="paper-speckle relative min-h-[calc(100svh-4.5rem)] border-b border-border"
    >
      <div className="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-7xl items-center gap-8 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:py-16 lg:px-8">
        <div className="relative z-10 max-w-xl animate-rise">
          <div className="mb-5 inline-flex -rotate-2 items-center gap-2 rounded-sm bg-butter px-3 py-1.5 font-hand text-sm font-bold text-butter-foreground shadow-sm">
            <Sparkles className="size-4" /> no names, just little moments
          </div>
          <h1 className="font-hand text-5xl leading-[1.02] font-bold sm:text-6xl lg:text-7xl">
            your thoughts deserve a{" "}
            <span className="relative inline-block text-primary after:absolute after:-bottom-1 after:left-0 after:h-2 after:w-full after:rounded-full after:bg-pink/60 after:content-['']">
              soft place
            </span>{" "}
            to land.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
            Afterword is a cozy, anonymous timeline for the songs you replay,
            the videos you love, and the thoughts you almost kept to yourself.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#timeline" size="lg">
              Open the timeline <ArrowRight className="size-5" />
            </Button>
            <Button href="#how-it-works" size="lg" variant="secondary">
              <MessageCircleHeart className="size-5 text-link" /> Send via
              Messenger
            </Button>
          </div>
          <div className="mt-8 flex items-center gap-3 text-sm font-semibold text-muted-foreground">
            <div className="flex -space-x-2" aria-hidden="true">
              {["🐰", "🐻", "🐱", "🦊"].map((animal) => (
                <span
                  key={animal}
                  className="grid size-9 place-items-center rounded-full border-2 border-background bg-card text-lg"
                >
                  {animal}
                </span>
              ))}
            </div>
            <span>shared gently by anonymous friends</span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl animate-rise-delayed">
          <div className="absolute left-[5%] top-[8%] z-10 rotate-[-8deg] rounded-sm bg-pink px-4 py-2 font-hand text-sm font-bold shadow-sm">
            made with heart ♡
          </div>
          <div
            className="absolute right-[6%] top-[12%] h-5 w-24 rotate-15 bg-tape/80"
            aria-hidden="true"
          />
          <Image
            src={mascotArt}
            alt="A bunny, bear, and cat making a memory scrapbook together"
            className="w-full mix-blend-multiply drop-shadow-[0_20px_28px_var(--image-shadow)]"
            priority
          />
          <div className="absolute bottom-[5%] right-[1%] rotate-[4deg] rounded-md border border-border bg-card p-3 shadow-paper">
            <p className="font-hand text-base font-bold">keep this moment</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              posted by little bunny · now
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
