import { Clock3, Heart, Play, Radio } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative border-y border-border bg-card py-20 sm:py-28"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 flex h-1.5">
        <span className="flex-1 bg-primary" />
        <span className="flex-1 bg-pink" />
        <span className="flex-1 bg-butter" />
        <span className="flex-1 bg-sage" />
        <span className="flex-1 bg-mint" />
      </div>
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex font-kalam-bold text-sm font-bold text-primary">
            the lovely little details
          </span>
          <h2 className="mt-4 font-kalam-bold text-4xl font-bold sm:text-5xl">
            Made for sharing softly.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={Play}
            title="Everything plays here"
            text="Spotify, YouTube, Instagram, Facebook, TikTok, and more—without leaving the page."
            tone="bg-peach"
          />
          <FeatureCard
            icon={Clock3}
            title="Notes that drift away"
            text="Share a passing thought as a temporary note that disappears when its moment has passed."
            tone="bg-butter"
          />
          <FeatureCard
            icon={Heart}
            title="A face, not a name"
            text="Every anonymous share gets a friendly animal identity, keeping it warm and human."
            tone="bg-pink"
          />
          <FeatureCard
            icon={Radio}
            title="Always in the moment"
            text="New memories arrive as they’re shared, so the timeline stays alive and gently surprising."
            tone="bg-mint"
          />
        </div>
      </div>
    </section>
  );
}
