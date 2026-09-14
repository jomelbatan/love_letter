import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createNote = mutation({
  args: {
    authorId: v.id("authors"),
    content: v.string(),
  },

  handler: async (ctx, args) => {
    const existingNote = await ctx.db
      .query("notes")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .first();

    if (existingNote) {
      await ctx.db.delete(existingNote._id);
    }

    const now = Date.now();

    return await ctx.db.insert("notes", {
      authorId: args.authorId,
      content: args.content,
      expiresAt: now + 24 * 60 * 60 * 1000,
    });
  },
});

export const getNote = query({
  args: { authorId: v.id("authors") },
  handler: async (ctx, args) => {
    return ctx.db
      .query("notes")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .first();
  },
});

export const deleteSomething = mutation({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await ctx.db.delete(args.id as any);
  },
});
