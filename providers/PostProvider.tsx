"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { createContext, useContext } from "react";

type PostContextValue = {
  posts: Doc<"posts">[];
  isLoading: boolean;
  loadMore: (n: number) => void;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
};
type PostProviderType = PostContextValue & {
  children: React.ReactNode;
};
const PostContext = createContext<PostContextValue | null>(null);

export default function PostProvider({
  children,
  posts,
  isLoading,
  loadMore,
  status,
}: PostProviderType) {
  return (
    <PostContext.Provider value={{ posts, isLoading, loadMore, status }}>
      {children}
    </PostContext.Provider>
  );
}

export function usePost() {
  const context = useContext(PostContext);

  if (!context) {
    throw new Error("usePost must be used inside PostProvider");
  }

  return context;
}
