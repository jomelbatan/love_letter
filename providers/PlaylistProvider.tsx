"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { createContext, useContext } from "react";

type PlaylistContextValue = {
  playlist: Doc<"posts">[];
  isLoading: boolean;
  loadMore: (n: number) => void;
  status: "LoadingFirstPage" | "CanLoadMore" | "LoadingMore" | "Exhausted";
};
type PlaylistProviderType = PlaylistContextValue & {
  children: React.ReactNode;
};
const PlaylistContext = createContext<PlaylistContextValue | null>(null);

export default function PlaylistProvider({
  children,
  playlist,
  isLoading,
  loadMore,
  status,
}: PlaylistProviderType) {
  return (
    <PlaylistContext.Provider value={{ playlist, isLoading, loadMore, status }}>
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylist() {
  const context = useContext(PlaylistContext);

  if (!context) {
    throw new Error("usePlaylist must be used inside PlaylistProvider");
  }

  return context;
}
