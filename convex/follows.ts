import { v } from "convex/values";
import { query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const getFriends = query({
  args: {
    authorId: v.id("authors"),
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, { authorId, paginationOpts }) => {
    const following = await ctx.db
      .query("follows")
      .withIndex("by_follower", (q) => q.eq("followerId", authorId))
      .paginate(paginationOpts);

    const friends = [];

    for (const follow of following.page) {
      const mutual = await ctx.db
        .query("follows")
        .withIndex("by_follower_following", (q) =>
          q.eq("followerId", follow.followingId).eq("followingId", authorId),
        )
        .unique();

      if (mutual) {
        const friend = await ctx.db.get(follow.followingId);

        if (friend) {
          friends.push(friend);
        }
      }
    }

    return {
      ...following,
      page: friends,
    };
  },
});
