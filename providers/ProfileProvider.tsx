"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { createContext, useContext } from "react";

type ProfileContextValue = {
  friends: Doc<"authors">[];
  friendsLoading: boolean;
  friendsCount: number;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

type ProfileProviderType = ProfileContextValue & { children: React.ReactNode };
export default function ProfileProvider({
  children,
  friends,
  friendsLoading,
  friendsCount,
}: ProfileProviderType) {
  return (
    <ProfileContext.Provider value={{ friends, friendsLoading, friendsCount }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error("useProfile must be used inside ProfileProvider");
  }

  return context;
}
