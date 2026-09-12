import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createAuthor = mutation({
  args: {
    name: v.string(),
    avatarUrl: v.string(),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("authors", args);
  },
});
export const getAuthors = query({
  args: {},

  handler: async (ctx) => {
    return await ctx.db.query("authors").collect();
  },
});
export const getAuthorByName = query({
  args: { username: v.string() },
  handler: async (ctx, args) => {
    const author = await ctx.db
      .query("authors")
      .withIndex("by_name", (q) => q.eq("name", args.username))
      .unique();
    if (!author) return;

    return author;
  },
});
export const seedAuthors = mutation({
  args: {},

  handler: async (ctx) => {
    const existing = await ctx.db.query("authors").collect();

    if (existing.length > 0) {
      return existing;
    }

    await ctx.db.insert("authors", {
      name: "Mochi",
      avatarUrl: "/cat.svg",
    });

    await ctx.db.insert("authors", {
      name: "Bubu",
      avatarUrl: "/rabbit.svg",
    });

    return await ctx.db.query("authors").collect();
  },
});
export const notMe = query({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("authors")
      .filter((q) => q.neq(q.field("name"), args.name))
      .collect();
  },
});
