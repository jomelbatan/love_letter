"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { createContext, useContext, useState } from "react";
type Picture = Doc<"photos"> & {
  url: string | null;
};

type PictureContextValue = {
  pictures: Picture[];
  selectedPhoto: string;
  setSelectedPhoto: (s: string) => void;
};

const PictureContext = createContext<PictureContextValue | null>(null);

export default function PictureProvider({
  children,
  pictures,
}: {
  children: React.ReactNode;
  pictures: Picture[];
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");

  return (
    <PictureContext.Provider
      value={{ pictures, selectedPhoto, setSelectedPhoto }}
    >
      {children}
    </PictureContext.Provider>
  );
}

export function usePicture() {
  const context = useContext(PictureContext);

  if (!context) {
    throw new Error("usePicture must be used inside PictureProvider");
  }

  return context;
}
