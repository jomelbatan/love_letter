import TimelinePage from "@/components/pages/TimelinePage";
import { api } from "@/convex/_generated/api";
import { fetchQuery } from "convex/nextjs";
import { notFound } from "next/navigation";
import React from "react";

type Props = {
  params: Promise<{ username: string }>;
};

export default async function UserTimeline({ params }: Props) {
  const { username } = await params;
  const { author, posts } = await fetchQuery(api.post.getUserTimeline, {
    name: username,
    paginationOpts: {
      numItems: 10,
      cursor: null,
    },
  });
  if (!author || !posts) {
    notFound();
  }
  return <TimelinePage author={author} posts={posts} />;
}
