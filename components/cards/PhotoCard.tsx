import React from "react";
import Image from "next/image";

export default function PhotoCard() {
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
        {[
          "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
          "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5",
          "https://images.unsplash.com/photo-1469474968028-56623f02e42e",
          "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d",
          "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05",
          "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
        ].map((src, i) => (
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
