import Image from "next/image";
import NotfoundImg from "@/public/images/notfound.png";
import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-chalk-cream px-6 py-12">
      <div className="flex w-full max-w-lg flex-col items-center text-center">
        <Image
          src={NotfoundImg}
          alt="Content not found"
          className="mb-8 w-64 sm:w-72"
          priority
        />

        <div className="space-y-3">
          <h1 className="font-kalam-bold text-2xl text-chalk-terracotta sm:text-3xl">
            This content isn&apos;t available
          </h1>

          <p className="mx-auto max-w-md text-sm leading-6 text-stone-500 sm:text-base">
            The page you&apos;re looking for may have been deleted, made
            private, or is no longer available.
          </p>
        </div>

        <Link
          href="/"
          className="mt-8 rounded-xl bg-chalk-terracotta px-6 py-3
            font-kalam-bold text-white shadow-sm transition
            hover:-translate-y-0.5 hover:shadow-md
            focus:outline-none focus:ring-2 focus:ring-chalk-terracotta
            focus:ring-offset-2"
        >
          Go to feed
        </Link>
      </div>
    </main>
  );
}
