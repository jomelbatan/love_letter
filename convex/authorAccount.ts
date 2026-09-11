import { v } from "convex/values";
import { query } from "./_generated/server";

export const getAuthorPSID = query({
  args: { psid: v.string() },
  handler: async (ctx, args) => {
    const instance = await ctx.db
      .query("authorAccounts")
      .withIndex("by_psid", (q) => q.eq("psid", args.psid))
      .unique();

    if (!instance) return;

    return instance.authorId;
  },
});
