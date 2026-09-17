import { internal } from "./_generated/api";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
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
  args: {
    authorId: v.id("authors"),
  },

  handler: async (ctx, args) => {
    const note = await ctx.db
      .query("notes")
      .withIndex("by_author", (q) => q.eq("authorId", args.authorId))
      .first();

    if (!note || note.expiresAt! <= Date.now()) {
      return null;
    }

    return note;
  },
});

export const deleteExpiredNotes = internalMutation({
  args: {},

  handler: async (ctx) => {
    const now = Date.now();

    const notes = await ctx.db
      .query("notes")
      .withIndex("by_expires_at", (q) => q.lt("expiresAt", now))
      .collect();

    for (const note of notes) {
      await ctx.db.delete(note._id);
    }
  },
});
