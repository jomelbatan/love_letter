import { v } from "convex/values";
import { query } from "./_generated/server";

export const getUserPhotos = query({
  args: {
    authorId: v.id("authors"),
  },
  handler: async (ctx, { authorId }) => {
    const photos = await ctx.db
      .query("photos")
      .withIndex("by_author", (q) => q.eq("authorId", authorId))
      .order("desc")
      .collect();

    return Promise.all(
      photos.map(async (photo) => ({
        ...photo,
        url: await ctx.storage.getUrl(photo.storageId),
      })),
    );
  },
});
