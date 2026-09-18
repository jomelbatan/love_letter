import { paginationOptsValidator } from "convex/server";
import {
  query,
  mutation,
  internalMutation,
  internalAction,
} from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const getTimeline = query({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_published", (q) => q.eq("published", true))
      .order("desc")
      .collect();

    return await Promise.all(
      posts.map(async (post) => {
        const author = await ctx.db.get(post.authorId);

        return {
          ...post,
          author,
        };
      }),
    );
  },
});

export const createPost = mutation({
  args: {
    authorId: v.id("authors"),
    type: v.union(
      v.literal("TEXT"),
      v.literal("LETTER"),
      v.literal("IMAGE"),
      v.literal("EMBED"),
    ),
    text: v.optional(v.string()),
    eventDate: v.optional(v.number()),
    imageUrl: v.optional(v.string()),
    embedUrl: v.optional(v.string()),
    embedType: v.optional(
      v.union(
        v.literal("SPOTIFY"),
        v.literal("TIKTOK"),
        v.literal("FACEBOOK"),
        v.literal("YOUTUBE"),
        v.literal("YOUTUBE_MUSIC"),
        v.literal("INSTAGRAM"),
        v.literal("LINK"),
      ),
    ),
    published: v.boolean(),
    metadata: v.optional(v.any()),
  },

  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.authorId);
    const post = await ctx.db.insert("posts", args);
    ctx.db.patch(args.authorId, {
      postCount: author!.postCount + 1,
    });
    return post;
  },
});

export const getUserTimeline = query({
  args: {
    authorId: v.id("authors"),
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    return await ctx.db
      .query("posts")
      .withIndex("by_author_published", (q) =>
        q.eq("authorId", args.authorId).eq("published", true),
      )
      .order("desc")
      .paginate(args.paginationOpts);
  },
});

//For Caption
export const getPendingPost = query({
  args: { psid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("pendingPosts")
      .withIndex("by_psid", (q) => q.eq("psid", args.psid))
      .first();
  },
});

export const clearPendingPost = mutation({
  args: { psid: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pendingPosts")
      .withIndex("by_psid", (q) => q.eq("psid", args.psid))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

//For Deletion
export const getPendingDelete = query({
  args: { psid: v.string() },
  handler: async (ctx, args) => {
    const author = await ctx.db
      .query("authorAccounts")
      .withIndex("by_psid", (q) => q.eq("psid", args.psid))
      .first();

    if (!author?.pendingDeletePostId) return null;

    return { postId: author.pendingDeletePostId };
  },
});

export const savePendingDelete = mutation({
  args: {
    psid: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const author = await ctx.db
      .query("authorAccounts")
      .withIndex("by_psid", (q) => q.eq("psid", args.psid))
      .first();

    if (!author) throw new Error("Author account not found");

    await ctx.db.patch(author._id, {
      pendingDeletePostId: args.postId,
    });
  },
});

export const clearPendingDelete = mutation({
  args: { psid: v.string() },
  handler: async (ctx, args) => {
    const author = await ctx.db
      .query("authorAccounts")
      .withIndex("by_psid", (q) => q.eq("psid", args.psid))
      .first();

    if (author && author.pendingDeletePostId) {
      await ctx.db.patch(author._id, {
        pendingDeletePostId: undefined,
      });
    }
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts"), authorId: v.id("authors") },
  handler: async (ctx, args) => {
    const author = await ctx.db.get(args.authorId);
    const existing = await ctx.db.get(args.postId);
    if (existing && author) {
      await ctx.db.delete(existing._id);
      ctx.db.patch(author._id, {
        postCount: author!.postCount - 1,
      });
    }
  },
});

const PENDING_POST_TIMEOUT_MS = 5 * 60 * 1000; // tune this — e.g. 5 min

export const resolveThenSavePendingPost = mutation({
  args: {
    psid: v.string(),
    accountId: v.id("authorAccounts"),
    authorId: v.id("authors"),
    type: v.union(
      v.literal("TEXT"),
      v.literal("LETTER"),
      v.literal("IMAGE"),
      v.literal("EMBED"),
    ),
    embedUrl: v.optional(v.string()),
    embedType: v.optional(
      v.union(
        v.literal("SPOTIFY"),
        v.literal("TIKTOK"),
        v.literal("FACEBOOK"),
        v.literal("YOUTUBE"),
        v.literal("YOUTUBE_MUSIC"),
        v.literal("INSTAGRAM"),
        v.literal("LINK"),
      ),
    ),
    initialText: v.optional(v.string()),
    platform: v.union(v.literal("page"), v.literal("instagram")), // new
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("pendingPosts")
      .withIndex("by_psid", (q) => q.eq("psid", args.psid))
      .first();

    if (existing) {
      const author = await ctx.db.get(args.authorId);
      await ctx.db.insert("posts", {
        authorId: args.authorId,
        type: existing.type,
        text: existing.initialText || "",
        embedUrl: existing.embedUrl,
        embedType: existing.embedType,
        eventDate: Date.now(),
        published: true,
      });
      await ctx.db.patch(args.authorId, {
        postCount: (author?.postCount ?? 0) + 1,
      });
      await ctx.db.delete(existing._id);
    }

    const pendingPostId = await ctx.db.insert("pendingPosts", {
      psid: args.psid,
      authorId: args.accountId,
      type: args.type,
      embedUrl: args.embedUrl,
      embedType: args.embedType,
      initialText: args.initialText,
      platform: args.platform,
    });

    // Auto-finalize if nobody responds within the threshold
    await ctx.scheduler.runAfter(
      PENDING_POST_TIMEOUT_MS,
      internal.post.finalizeStalePendingPost,
      { pendingPostId },
    );
  },
});

export const finalizeStalePendingPostRecord = internalMutation({
  args: { pendingPostId: v.id("pendingPosts") },
  handler: async (ctx, args) => {
    const pending = await ctx.db.get(args.pendingPostId);
    if (!pending) return null;

    const account = await ctx.db.get(pending.authorId);
    if (!account) return null;
    const author = await ctx.db.get(account.authorId);
    if (!author) return null;

    await ctx.db.insert("posts", {
      authorId: account.authorId,
      type: pending.type,
      text: pending.initialText || "",
      embedUrl: pending.embedUrl,
      embedType: pending.embedType,
      eventDate: Date.now(),
      published: true,
    });
    await ctx.db.patch(account.authorId, { postCount: author.postCount + 1 });
    await ctx.db.delete(pending._id);

    return {
      psid: pending.psid,
      platform: pending.platform,
      authorName: author.name,
    };
  },
});

export const finalizeStalePendingPost = internalAction({
  args: { pendingPostId: v.id("pendingPosts") },
  handler: async (ctx, args) => {
    const result = await ctx.runMutation(
      internal.post.finalizeStalePendingPostRecord,
      { pendingPostId: args.pendingPostId },
    );
    if (!result) return;
  },
});
