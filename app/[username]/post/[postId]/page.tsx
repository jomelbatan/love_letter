import notFound from "@/app/not-found";
import PostCard from "@/components/cards/PostCard";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import React from "react";
type Props = {
  params: Promise<{ postId: string }>;
};

export default async function PostPage({ params }: Props) {
  const { postId } = await params;

  const result = await fetchQuery(api.post.getPost, {
    postId,
  });

  if (!result) {
    return notFound();
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-xl">
        <PostCard
          post={result.post}
          author={result.author}
          watermark
          disableAuthorLink={false}
        />
      </div>
    </main>
  );
}
