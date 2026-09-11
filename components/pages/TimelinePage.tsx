"use client";
import Hero from "../Hero";
import { Doc } from "@/convex/_generated/dataModel";
import { PaginationResult } from "convex/server";
import ProfileTabs, { TabId } from "../ProfileTabs";
import { useState } from "react";
import ProfileLayout from "../ProfileLayout";
import About from "../sections/about";
import Friends from "../sections/friends";
import Photos from "../sections/photos";

export interface AuthorandPostProps {
  author: Doc<"authors">;
  posts: PaginationResult<Doc<"posts">>;
}
export default function TimelinePage({ author, posts }: AuthorandPostProps) {
  const [currentTab, setCurrentTab] = useState<TabId>("all");

  return (
    <div className=" px-0 lg:px-64">
      <Hero user={author} />
      <ProfileTabs
        defaultTab={currentTab}
        onTabChange={(tab) => setCurrentTab(tab)}
      />
      <div className=" p-4 sm:p-6">
        {currentTab === "all" && (
          <ProfileLayout author={author} posts={posts} />
        )}
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
    </div>
  );
}
