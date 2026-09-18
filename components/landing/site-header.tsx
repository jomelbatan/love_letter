import { Heart } from "lucide-react";
import { Button } from "@/components/button/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 lg:px-8">
        <a
          href="#top"
          className="flex items-center gap-2.5"
          aria-label="Afterword home"
        >
          <span className="grid size-10 rotate-[-4deg] place-items-center rounded-[42%] bg-primary text-xl shadow-sm">
            🐾
          </span>
          <span className="font-hand text-2xl font-bold text-foreground">
            afterword.
          </span>
        </a>
        <nav
          className="hidden items-center gap-7 text-sm font-bold text-muted-foreground md:flex"
          aria-label="Main navigation"
        >
          <a
            className="transition-colors hover:text-foreground"
            href="#timeline"
          >
            Timeline
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="#how-it-works"
          >
            How it works
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="#features"
          >
            Why Afterword?
          </a>
        </nav>
        <Button href="#timeline" size="default">
          <Heart className="size-4" fill="currentColor" /> Visit timeline
        </Button>
      </div>
    </header>
  );
}
