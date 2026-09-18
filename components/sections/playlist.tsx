import { AuthorProps } from "@/types/props";
import React from "react";

export default function playlist({ author }: AuthorProps) {
  return (
    <section className="bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <h2 className="text-xl font-kalam-bold text-deep-charcoal">{`${author.name}'s Playlist`}</h2>
    </section>
  );
}
