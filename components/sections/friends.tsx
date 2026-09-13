import { useProfile } from "@/providers/ProfileProvider";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function Friends() {
  const { friends, friendsLoading } = useProfile();
  return (
    <section className="bg-pure-chalk rounded-xl p-4 shadow-sm border border-soft-dust">
      <h2 className="text-xl font-kalam-bold text-deep-charcoal">Friends</h2>
      <div className="flex items-center pb-4">
        <p
          className={`relative py-2 text-base font-kalam rounded-sm text-primary-orange font-semibold`}
        >
          All Friends
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1 bg-primary-orange rounded-t-sm"
          />
        </p>
      </div>
      {/* Loading */}
      {friendsLoading
        ? [1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className=" flex items-center gap-3 border border-chalk-terracotta/20 rounded-md px-3 py-3 sm:px-4 animate-pulse "
            >
              <div className="shrink-0 size-16 sm:size-20 lg:size-28 rounded-xl bg-chalk-cream" />
              <div className="flex flex-col gap-2 flex-1">
                <div className="h-6 w-24 rounded bg-chalk-cream" />
                <div className="h-4 w-16 rounded bg-chalk-cream" />
              </div>
            </div>
          ))
        : friends.map((f) => (
            <div
              className="
    w-full md:w-1/2
    flex flex-row items-center justify-between
    gap-3
    border border-chalk-terracotta/20
    rounded-md
    px-3 py-3 sm:px-4
  "
              key={f._id}
            >
              {/* User info */}
              <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                {/* Avatar */}
                <div className="avatar relative shrink-0 size-16 sm:size-20 lg:size-28 bg-chalk-cream rounded-xl overflow-hidden">
                  <Image
                    src={f.avatarUrl}
                    alt={`${f.name}'s avatar`}
                    fill
                    className="object-cover rounded-xl"
                  />
                </div>

                {/* Details */}
                <div className="flex min-w-0 flex-col items-start">
                  <Link href={`/${f.name}`} className="max-w-full">
                    <p className="truncate text-lg sm:text-xl lg:text-4xl font-yuyu">
                      {f.name}
                    </p>
                  </Link>

                  <div className="flex gap-1 font-kalam text-sm sm:text-base">
                    <p>1 friend</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <MoreHorizontal className="shrink-0 text-primary-orange" />
            </div>
          ))}
    </section>
  );
}
