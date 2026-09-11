import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  authors: defineTable({
    name: v.string(),
    avatarUrl: v.string(),
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
  })
    .index("by_psid", ["psid"])
    .index("by_author", ["authorId"]),

  posts: defineTable({
    authorId: v.id("authors"),
    type: v.union(
      v.literal("TEXT"),
      v.literal("LETTER"),
      v.literal("IMAGE"),
      v.literal("NOTE"),
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
  })
    .index("by_author", ["authorId"])
    .index("by_published", ["published"])
    .index("by_author_published", ["authorId", "published"]),

  pendingPosts: defineTable({
    psid: v.string(),
    authorId: v.id("authorAccounts"),
    type: v.literal("EMBED"),
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
    initialText: v.optional(v.string()),
  }).index("by_psid", ["psid"]),
});
