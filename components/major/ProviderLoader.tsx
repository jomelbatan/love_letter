"use client";
import { api } from "@/convex/_generated/api";
import PictureProvider from "@/providers/PhotoProvider";
import PlaylistProvider from "@/providers/PlaylistProvider";
import PostProvider from "@/providers/PostProvider";
import ProfileProvider from "@/providers/ProfileProvider";
import { AuthorProps } from "@/types/props";
import { usePaginatedQuery, useQuery } from "convex/react";
import React from "react";

export default function ProviderLoader({
  author,
  children,
}: AuthorProps & { children: React.ReactNode }) {
  const {
    results: posts,
    status,
    loadMore,
    isLoading: postsLoading,
  } = usePaginatedQuery(
    api.post.getUserTimeline,
    author ? { authorId: author._id } : "skip",
    { initialNumItems: 10 },
  );
  const { results: friends, isLoading: friendsLoading } = usePaginatedQuery(
    api.follows.getFriends,
    { authorId: author._id },
    { initialNumItems: 9 },
  );

  const photos = useQuery(api.photos.getUserPhotos, { authorId: author._id });
  const {
    results: playlist,
    status: playlistStatus,
    loadMore: playlistLoadmore,
    isLoading: playlisLoading,
  } = usePaginatedQuery(
    api.post.getUserPlaylist,
    author ? { authorId: author._id } : "skip",
    { initialNumItems: 10 },
  );

  return (
    <ProfileProvider
      friends={friends}
      friendsLoading={friendsLoading}
      friendsCount={author.friendCount ?? 0}
    >
      <PostProvider
        posts={posts}
        status={status}
        loadMore={loadMore}
        isLoading={postsLoading}
      >
        <PlaylistProvider
          playlist={playlist}
          isLoading={playlisLoading}
          loadMore={playlistLoadmore}
          status={playlistStatus}
        >
          <PictureProvider pictures={photos ?? []}>{children}</PictureProvider>
        </PlaylistProvider>
      </PostProvider>
    </ProfileProvider>
  );
}
