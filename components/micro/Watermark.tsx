import Image from "next/image";
import React from "react";
import Afterword from "@/public/covers/afterword.png";
import Link from "next/link";

export default function Watermark() {
  return (
    <div className="py-4 border-t border-soft-dust w-full flex justify-end mt-4">
      <Link href="/" className="flex shrink-0">
        <Image
          src={Afterword}
          alt="Afterword Logo"
          height={50}
          width={120}
          className="-mb-3"
        />
      </Link>
    </div>
  );
}
