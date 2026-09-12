"use client";

import { useState } from "react";
import ProfileLayout from "./ProfileLayout";
import About from "../sections/about";
import Friends from "../sections/friends";
import Photos from "../sections/photos";
import { Doc } from "@/convex/_generated/dataModel";
import { AuthorProps } from "./Hero";

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
  const [currentTab, setCurrentTab] = useState<TabId>("all");

  const handleTabClick = (tabId: TabId) => {
    setCurrentTab(tabId);
  };

  return (
    <>
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
      <div className=" p-4 sm:p-6">
        {currentTab === "all" && <ProfileLayout author={author} />}
        {currentTab === "about" && (
          <div className="flex flex-col gap-4">
            <About author={author} />
            <Friends name={author.name} />
            <Photos />
          </div>
        )}
        {currentTab === "friends" && (
          <div className="flex flex-col gap-4">
            <Friends name={author.name} />
            <Photos />
          </div>
        )}
        {currentTab === "photos" && (
          <div className="flex flex-col gap-4">
            <Photos />
          </div>
        )}
      </div>
    </>
  );
}
