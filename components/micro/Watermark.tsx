import Image from "next/image";
import React from "react";
import Afterword from "@/public/covers/afterword.png";

export default function Watermark() {
  return (
    <div className="py-4 border-t border-soft-dust w-full flex justify-end mt-4">
      <Image
        src={Afterword}
        alt="Afterword Logo"
        height={50}
        width={100}
        className="-mb-3 lg:-ml-5"
      />
    </div>
  );
}
