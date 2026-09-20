import { ArrowRight, MessageCircleHeart } from "lucide-react";
import { Button } from "@/components/button/button";

export function FinalCtaSection() {
  return (
    <section
      id="final-cta"
      className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-24"
    >
      <div
        className="absolute -left-12 -top-14 text-[10rem] opacity-10"
        aria-hidden="true"
      >
        🐾
      </div>
      <div
        className="absolute -bottom-16 -right-12 rotate-12 text-[11rem] opacity-10"
        aria-hidden="true"
      >
        ♡
      </div>
      <div className="relative mx-auto max-w-3xl px-5 text-center">
        <span className="inline-block rotate-[-4deg] rounded-sm bg-butter px-4 py-2 font-kalam-bold text-sm font-bold text-butter-foreground">
          there&rsquo;s room for your story
        </span>
        <h2 className="mt-6 font-kalam-bold text-4xl font-bold sm:text-6xl">
          Leave a little piece of today behind.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-primary-foreground/80">
          A song, a thought, a funny clip, a memory—whatever it is, it belongs
          somewhere gentle.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="#timeline" variant="secondary" size="lg">
            Visit the timeline <ArrowRight className="size-5" />
          </Button>
          <Button href="#how-it-works" variant="dark" size="lg">
            <MessageCircleHeart className="size-5" /> Submit a thought
          </Button>
        </div>
      </div>
    </section>
  );
}
