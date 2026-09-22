"use client";

import { useState } from "react";
import { BadgeCheck, Clock3, Globe, Heart } from "lucide-react";
import { feedTabs, animalProfiles, type FeedType } from "@/libs/timeline-data";
import { FeedContent } from "./feed/feed-content";
import Image from "next/image";
import Link from "next/link";

export function TimelineSection() {
  const [activeFeed, setActiveFeed] = useState<FeedType>("note");
  const profile = animalProfiles[activeFeed];

  return (
    <section id="timeline" className="relative bg-secondary py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-kalam-bold text-lg font-bold text-primary">
            a little peek inside
          </p>
          <h2 className="mt-2 font-kalam-bold text-4xl font-bold sm:text-5xl">
            One feed, all your favorites.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Songs, reels, videos, posts, and tiny passing thoughts—gathered into
            one shared memory book.
          </p>
        </div>

        <div
          className="mt-10 flex justify-start gap-2 overflow-x-auto pb-3 sm:justify-center"
          role="tablist"
          aria-label="Feed examples"
        >
          {feedTabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={activeFeed === id}
              onClick={() => setActiveFeed(id)}
              className={`flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition-all",
               ${
                 activeFeed === id
                   ? "border-primary bg-primary text-primary-foreground shadow-sm"
                   : "border-border bg-card text-muted-foreground hover:-translate-y-0.5 hover:text-foreground"
               }
             `}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-6 max-w-2xl">
          <div
            className="absolute -left-5 top-16 hidden h-20 w-7 rotate-[-8deg] bg-tape/75 sm:block"
            aria-hidden="true"
          />
          <article className="overflow-hidden rounded-lg border border-border bg-card shadow-paper">
            <div className="flex w-full items-center justify-between px-8 pt-8">
              <div className="flex items-center gap-3">
                <div className="avatar size-14 bg-chalk-cream rounded-full border border-chalk-terracotta">
                  <Image
                    src={profile.profile}
                    alt={`${profile.name}'s avatar`}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <Link href={`/${profile.name.toLocaleLowerCase()}`}>
                      <span className="font-kalam-bold text-2xl">
                        {profile.name}
                      </span>
                    </Link>
                    <BadgeCheck className="size-5" />
                  </div>
                  <div className="flex items-center text-xs text-zinc-400">
                    <span>{profile.time}</span>
                    <span>·</span>
                    <Globe className="w-3 h-3 inline" />
                  </div>
                </div>
              </div>

              <span className="rounded-full bg-sage px-3 py-1 text-xs font-bold text-sage-foreground">
                kind corner
              </span>
            </div>
            <div className="min-h-82.5 p-5 sm:p-7">
              <FeedContent type={activeFeed} />
            </div>
            <div className="flex items-center justify-between border-t border-border px-5 py-3 text-sm font-semibold text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Heart className="size-4 text-primary" fill="currentColor" /> 24
                warm hearts
              </span>
              <span>saved to the scrapbook</span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
