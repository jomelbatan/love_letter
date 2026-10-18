import { EmbedScripts } from "@/components/EmbedScript";
import Script from "next/script";
import React from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <EmbedScripts />
    </>
  );
}
