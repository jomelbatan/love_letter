import { usePicture } from "@/providers/PhotoProvider";
import Image from "next/image";
import React from "react";

export default function Photos() {
  const { pictures, setSelectedPhoto } = usePicture();
  return (
    <section className="bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <h2 className="text-xl font-kalam-bold text-deep-charcoal mb-3">
        Photos
      </h2>
      <div className="grid grid-cols-3 lg:grid-cols-5 gap-1.5 rounded-lg overflow-hidden">
        {pictures.map((src, i) => (
          <div
            key={i}
            onClick={() => setSelectedPhoto(src.url!)}
            className="relative aspect-square bg-zinc-800 overflow-hidden group"
          >
            <Image
              src={`${src.url}`}
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
