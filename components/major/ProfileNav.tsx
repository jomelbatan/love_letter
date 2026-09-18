"use client";

import { useRef, useState } from "react";
import ProfileLayout from "./ProfileLayout";
import About from "../sections/about";
import Friends from "../sections/friends";
import Photos from "../sections/photos";
import { AuthorProps } from "@/types/props";
import ProviderLoader from "./ProviderLoader";
import PhotoView from "./PhotoView";
import Playlist from "../sections/playlist";
import ProfileTabs from "./ProfileTabs";

export type TabId = "all" | "about" | "friends" | "photos" | "playlist";

export default function Profile({ author }: AuthorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentTab, setCurrentTab] = useState<TabId>("all");

  return (
    <div ref={containerRef}>
      <ProviderLoader author={author}>
        <div className="w-full">
          <ProfileTabs currentTab={currentTab} setCurrentTab={setCurrentTab} />
        </div>

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
          <div
            className={
              currentTab === "playlist" ? "flex flex-col gap-4" : "hidden"
            }
          >
            <Playlist authorName={author.name} />
          </div>
        </div>
        <PhotoView />
      </ProviderLoader>
    </div>
  );
}
