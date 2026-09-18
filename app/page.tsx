import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/site-header";
import { HeroSection } from "@/components/landing/hero-section";
import { TimelineSection } from "@/components/landing/timeline-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesSection } from "@/components/landing/features-section";
import { FinalCtaSection } from "@/components/landing/final-cta-section";
import { SiteFooter } from "@/components/landing/site-footer";

export const metadata: Metadata = {
  title: "Afterword — Your anonymous shared scrapbook",
  description:
    "Share thoughts, songs, videos, and little moments anonymously in one warm, shared timeline.",
  openGraph: {
    title: "Afterword — Your anonymous shared scrapbook",
    description:
      "A cozy anonymous timeline for thoughts, songs, videos, and memories.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  return (
    <main className="overflow-hidden bg-background text-foreground">
      <SiteHeader />
      <HeroSection />
      <TimelineSection />
      <HowItWorksSection />
      <FeaturesSection />
      <FinalCtaSection />
      <SiteFooter />
    </main>
  );
}
