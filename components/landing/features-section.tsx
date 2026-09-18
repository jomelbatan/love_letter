import { Clock3, Heart, Play, Radio } from "lucide-react";
import { FeatureCard } from "./feature-card";

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="border-y border-border bg-card py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="max-w-2xl">
          <p className="font-hand text-lg font-bold text-primary">
            the lovely little details
          </p>
          <h2 className="mt-2 font-hand text-4xl font-bold sm:text-5xl">
            Made for sharing softly.
          </h2>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
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
