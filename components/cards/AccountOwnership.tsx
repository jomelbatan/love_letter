import { BadgeInfo } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function AccountOwnership() {
  return (
    <section className="flex flex-row justify-center items-center gap-4 bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <div className="flex items-center justify-center rounded-full p-3 bg-primary-orange w-fit">
        <BadgeInfo className="size-10 text-pure-chalk" />
      </div>
      <div className="flex-1 flex-col justify-center items-center h-full ">
        <h2 className="text-xl font-kalam-bold text-deep-charcoal">
          This account doesn&apos;t have owner just yet
        </h2>
        <p className="font-kalam text-deep-charcoal">
          If you want to claim it, message our{" "}
          <Link
            href={`https://www.facebook.com/afterword.feed`}
            target="_blank"
            className="text-chalk-terracotta underline"
          >
            page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
