"use client";

import {
  Bell,
  CircleUserRound,
  MessageCircle,
  PawPrint,
  SquareText,
} from "lucide-react";
import Link from "next/link";

export default function AfterwordNavbar() {
  return (
    <header className="hidden sticky top-0 z-50 lg:flex justify-center w-full">
      <nav
        className="relative h-18 flex w-full items-center justify-between gap-2
                 rounded-b-[2] border border-soft-dust bg-off-white/90
                   px-8 py-2.5 shadow-[0_2px_0_0_var(--color-soft-dust)]
                   backdrop-blur-sm sm:px-5"
      >
        <Link href="/" className="group flex shrink-0 items-center gap-1.5">
          <PawPrint className="text-deep-charcoal size-10" />
          <span className="font-kalam-bold text-xl text-deep-charcoal">
            afterword
          </span>
        </Link>

        <div className="flex flex-row gap-4">
          <SquareText className="text-deep-charcoal size-8" />
          <MessageCircle className="text-deep-charcoal size-8" />
          <Bell className="text-deep-charcoal size-8" />
          <CircleUserRound className="text-deep-charcoal size-8" />
        </div>
      </nav>
    </header>
  );
}
