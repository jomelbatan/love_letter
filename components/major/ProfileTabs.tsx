"use client";

import { useRef, useState } from "react";
import ProfileLayout from "./ProfileLayout";
import About from "../sections/about";
import Friends from "../sections/friends";
import Photos from "../sections/photos";
import { AuthorProps } from "@/types/props";
import { usePaginatedQuery, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ProfileProvider from "@/providers/ProfileProvider";
import PostProvider from "@/providers/PostProvider";
import ProviderLoader from "./ProviderLoader";
import PhotoView from "./PhotoView";

export type TabId = "all" | "about" | "friends" | "photos";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "all", label: "All" },
  { id: "about", label: "About" },
  { id: "friends", label: "Friends" },
  { id: "photos", label: "Photos" },
];

export default function ProfileTabs({ author }: AuthorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState<TabId>("all");

  function handleTabClick(tabId: TabId) {
    setCurrentTab(tabId);
  }

  return (
    <div ref={containerRef}>
      <div className="w-full">
        <nav
          role="tablist"
          aria-label="Profile navigation"
          className="flex items-center gap-6 px-6 overflow-x-auto scrollbar-none"
        >
          {TABS.map((tab) => {
            const isActive = currentTab === tab.id;

            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`relative pt-3.5 pb-2 text-base font-medium font-kalam transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm ${
                  isActive
                    ? "text-primary-orange font-semibold"
                    : "text-warm-dust hover:text-zinc-400"
                }`}
              >
                {tab.label}

                {/* Active bottom indicator line */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-0 bottom-0 h-1 bg-primary-orange rounded-t-sm"
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
      <ProviderLoader author={author}>
        <div className=" p-4 sm:p-6">
          <div className={currentTab === "all" ? "" : "hidden"}>
            <ProfileLayout author={author} />
          </div>

          <div
            className={
              currentTab === "about" ? "flex flex-col gap-4" : "hidden"
            }
          >
            <About author={author} />
            <Friends />
            <Photos />
          </div>

          <div
            className={
              currentTab === "friends" ? "flex flex-col gap-4" : "hidden"
            }
          >
            <Friends />
            <Photos />
          </div>

          <div
            className={
              currentTab === "photos" ? "flex flex-col gap-4" : "hidden"
            }
          >
            <Photos />
          </div>
        </div>
        <PhotoView />
      </ProviderLoader>
    </div>
  );
}
