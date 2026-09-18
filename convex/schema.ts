import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authors: defineTable({
    name: v.string(),
    avatarUrl: v.string(),
    postCount: v.number(),
    personalDetails: v.optional(
      v.object({
        location: v.optional(v.string()),
        gender: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
        relationshipStatus: v.optional(
          v.union(v.literal("Single"), v.literal("In a Relationship")),
        ),
      }),
    ),
    bio: v.optional(v.string()),
    work: v.optional(
      v.array(
        v.object({
          workplace: v.optional(v.string()),
          role: v.optional(v.string()),
          startDate: v.optional(v.string()),
          endDate: v.optional(v.string()),
        }),
      ),
    ),
    education: v.optional(v.string()),
    contactInfo: v.optional(
      v.object({
        email: v.optional(v.string()),
        number: v.optional(v.string()),
      }),
    ),
  }).index("by_name", ["name"]),

  authorAccounts: defineTable({
    authorId: v.id("authors"),
    psid: v.string(),
    pendingDeletePostId: v.optional(v.id("posts")),
  })
    .index("by_psid", ["psid"])
    .index("by_author", ["authorId"]),

  posts: defineTable({
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
  })
    .index("by_author", ["authorId"])
    .index("by_published", ["published"])
    .index("by_author_published", ["authorId", "published"])
    .index("by_author_type", ["authorId", "embedType"]),

  pendingPosts: defineTable({
    psid: v.string(),
    authorId: v.id("authorAccounts"),
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
    platform: v.union(v.literal("page"), v.literal("instagram")),
  }).index("by_psid", ["psid"]),

  photos: defineTable({
    authorId: v.id("authors"),
    storageId: v.id("_storage"),
    postId: v.optional(v.id("posts")),
    caption: v.optional(v.string()),
  })
    .index("by_author", ["authorId"])
    .index("by_post", ["postId"]),

  follows: defineTable({
    followerId: v.id("authors"),
    followingId: v.id("authors"),
  })
    .index("by_follower", ["followerId"])
    .index("by_following", ["followingId"])
    .index("by_follower_following", ["followerId", "followingId"]),

  notes: defineTable({
    authorId: v.id("authors"),
    content: v.string(),
    expiresAt: v.optional(v.number()),
  })
    .index("by_author", ["authorId"])
    .index("by_expires_at", ["expiresAt"]),
});
