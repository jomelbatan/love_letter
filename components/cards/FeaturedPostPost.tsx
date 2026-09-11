import Image from "next/image";
import React from "react";

export default function FeaturedPost() {
  return (
    <section className="bg-pure-chalk rounded-xl p-4 border border-soft-dust">
      <h2 className="text-xl font-kalam-bold text-deep-charcoal mb-3">
        Featured
      </h2>

      <div className="bg-[#18191a] rounded-lg p-3 border border-zinc-800">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="w-10 h-10 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center font-bold text-sm">
            ae
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-zinc-100 text-sm">aespa</span>
              <span className="text-text-brown text-xs">✓</span>
            </div>
            <span className="text-xs text-zinc-400">August 4 · 🌐</span>
          </div>
        </div>

        <p className="text-sm text-zinc-200 mb-3">
          aespa 에스파 &apos;Switchblade (Feat. Ty Dolla $ign)&apos; MV
        </p>

        {/* Video/Image Preview banner */}
        <div className="relative aspect-video rounded-md overflow-hidden bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <Image
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&fit=crop&auto=format"
            alt="Featured media preview"
            width={300}
            height={300}
            className="w-full h-full object-cover"
          />

          <span className="absolute bottom-2 left-2 text-xs font-bold tracking-widest text-white/90 drop-shadow">
            SMTOWN OFFICIAL
          </span>
        </div>
      </div>
    </section>
  );
}
