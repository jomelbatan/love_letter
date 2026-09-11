import { paginationOptsValidator } from "convex/server";
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

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
        v.literal("LINK"),
      ),
    ),
    published: v.boolean(),
    metadata: v.optional(v.any()),
  },

  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", args);
  },
});

export const getUserTimeline = query({
  args: {
    name: v.string(),
    paginationOpts: paginationOptsValidator,
  },

  handler: async (ctx, args) => {
    const author = await ctx.db
      .query("authors")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique();

    if (!author) {
      return {
        author: null,
        posts: {
          page: [],
          isDone: true,
          continueCursor: "",
        },
      };
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_author_published", (q) =>
        q.eq("authorId", author._id).eq("published", true),
      )
      .order("desc")
      .paginate(args.paginationOpts);

    return {
      author,
      posts,
    };
  },
});
