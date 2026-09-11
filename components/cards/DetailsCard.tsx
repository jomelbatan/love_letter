import { LinkIcon, MessageCircle, Star } from "lucide-react";
import React from "react";

export default function DetailsCard() {
  return (
    <section className="bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <h2 className="text-xl font-kalam-bold text-deep-charcoal mb-3">
        Details
      </h2>

      <div className="space-y-3.5 text-sm">
        <div className="flex items-center gap-3 text-zinc-300">
          <Star className="w-5 h-5 text-deep-charcoal shrink-0" />
          <span className="flex flex-row gap-1">
            <strong className="text-deep-charcoal">98%</strong>
            <p className="text-deep-charcoal">recommend (931 reviews)</p>
          </span>
        </div>

        <div className="pt-1">
          <h3 className="text-sm font-kalam-bold text-deep-charcoal mb-1.5">
            Links
          </h3>
          <div className="flex items-center gap-3">
            <LinkIcon className="w-5 h-5 text-deep-charcoal shrink-0" />
            <a
              href="https://lnk.to"
              target="_blank"
              rel="noreferrer"
              className="text-text-brown hover:underline font-medium"
            >
              lnk.to
            </a>
          </div>
        </div>

        <div className="pt-1">
          <h3 className="text-sm font-kalam-bold text-deep-charcoal mb-1.5">
            Contact info
          </h3>
          <div className="flex items-center gap-3 text-zinc-300">
            <MessageCircle className="w-5 h-5  shrink-0 text-deep-charcoal" />
            <span className="text-deep-charcoal">aespa</span>
          </div>
        </div>
      </div>
    </section>
  );
}
