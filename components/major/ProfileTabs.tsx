"use client";
import React from "react";
import { TabId } from "./ProfileNav";
import { usePlaylist } from "@/providers/PlaylistProvider";

interface Tab {
  id: TabId;
  label: string;
}

const TABS: Tab[] = [
  { id: "all", label: "All" },
  { id: "about", label: "About" },
  { id: "friends", label: "Friends" },
  { id: "photos", label: "Photos" },
  { id: "playlist", label: "Playlist" },
];

interface ProfileTabsProps {
  currentTab: TabId;
  setCurrentTab: (t: TabId) => void;
}

export default function ProfileTabs({
  currentTab,
  setCurrentTab,
}: ProfileTabsProps) {
  function handleTabClick(tabId: TabId) {
    setCurrentTab(tabId);
  }
  const { playlist } = usePlaylist();
  return (
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
            className={`relative pt-3.5 pb-2 text-base font-medium font-kalam transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm
                ${tab.id === "playlist" && playlist.length === 0 ? "hidden" : ""}
                ${
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
  );
}
