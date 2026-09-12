import React from "react";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { AuthorIdProps } from "@/types/props";

export default function PhotoCard({ authorId }: AuthorIdProps) {
  const photos = useQuery(api.photos.getUserPhotos, {
    authorId,
  });

  if (!photos || photos?.length === 0) return;
  return (
    <section className="bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-kalam-bold text-deep-charcoal">Photos</h2>
        <button className="text-sm font-kalam text-text-brown hover:underline transition-colors">
          See all photos
        </button>
      </div>

      {/* 3x2 Photo Grid */}
      <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
        {photos.map((src, i) => (
          <div
            key={i}
            className="relative aspect-square bg-zinc-800 overflow-hidden group"
          >
            <Image
              src={`${src}?w=300&h=300&fit=crop&auto=format`}
              width={300}
              height={300}
              alt={`Photo thumbnail ${i + 1}`}
              className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
