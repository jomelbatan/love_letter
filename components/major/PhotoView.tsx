"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { usePicture } from "@/providers/PhotoProvider";

export default function PhotoView() {
  const { selectedPhoto, setSelectedPhoto } = usePicture();
  if (!selectedPhoto) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-6"
      onClick={() => setSelectedPhoto("")}
      role="dialog"
      aria-modal="true"
    >
      <button
        type="button"
        onClick={() => setSelectedPhoto("")}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 sm:right-6 sm:top-6"
        aria-label="Close"
      >
        <X className="h-6 w-6" />
      </button>

      <div
        className="relative flex h-full max-h-[90vh] w-full max-w-6xl items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={selectedPhoto}
          alt="Photo"
          width={1600}
          height={1200}
          sizes="95vw"
          className="max-h-[90vh] w-auto max-w-full rounded-md object-contain"
          priority
        />
      </div>
    </div>
  );
}
