import Hero from "@/components/major/Hero";
import ProfileTabs from "@/components/major/ProfileTabs";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserTimeline({ params }: Props) {
  const { username } = await params;
  const author = await fetchQuery(api.author.getAuthorByName, {
    username,
  });
  if (!author) {
    notFound();
  }
  return (
    <div className=" px-0 lg:px-64">
      <Hero author={author} />
      <ProfileTabs author={author} />
    </div>
  );
}
