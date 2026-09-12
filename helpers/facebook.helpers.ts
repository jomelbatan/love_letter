/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import {
  extractAttachmentUrl,
  getCanonicalFacebookUrl,
  getCanonicalTikTokUrl,
} from "./link.helper";
import { Id } from "@/convex/_generated/dataModel";

type PostType = "TEXT" | "LETTER" | "IMAGE" | "EMBED";
type EmbedType = "SPOTIFY" | "TIKTOK" | "FACEBOOK" | "YOUTUBE" | "LINK";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const pageAccessToken =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_META_PAGE_ACCESS_TOKEN
    : process.env.META_PAGE_ACCESS_TOKEN;

export function verifySignature(
  payload: string,
  signatureHeader: string | null,
  secret: string,
): boolean {
  if (!signatureHeader) return false;
  const [method, signature] = signatureHeader.split("=");
  if (method !== "sha256" || !signature) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

export async function parseContent(text: string) {
  const urlRegex = /https?:\/\/[^\s]+/i;
  const match = text.match(urlRegex);

  // No URL = normal letter/text post
  if (!match) {
    return {
      type: "LETTER" as PostType,
      embedType: undefined,
      embedUrl: null,
      cleanText: text.trim(),
      hasUrl: false,
    };
  }

  let embedUrl = match[0].replace(/[.,!?;:)>]+$/, "");
  const lower = embedUrl.toLowerCase();

  let embedType: EmbedType;

  if (lower.includes("spotify.com")) {
    embedType = "SPOTIFY";
  } else if (
    embedUrl.includes("tiktok.com") ||
    embedUrl.includes("vt.tiktok.com") ||
    embedUrl.includes("vm.tiktok.com")
  ) {
    embedType = "TIKTOK";

    // Detect short links or links with tracking query params
    if (
      embedUrl.includes("vt.tiktok.com") ||
      embedUrl.includes("vm.tiktok.com") ||
      embedUrl.includes("/t/") ||
      embedUrl.includes("?")
    ) {
      embedUrl = await getCanonicalTikTokUrl(embedUrl);
    }
  } else if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    embedType = "YOUTUBE";
  } else if (lower.includes("facebook.com") || lower.includes("fb.watch")) {
    embedType = "FACEBOOK";

    if (lower.includes("facebook.com/share/")) {
      embedUrl = await getCanonicalFacebookUrl(embedUrl);
    }
  } else {
    embedType = "LINK";
  }

  return {
    type: "EMBED" as PostType,
    embedType,
    embedUrl,
    cleanText: text.replace(match[0], "").trim(),
    hasUrl: true,
  };
}
export async function sendReply(recipientId: string, messageText: string) {
  await fetch(
    `https://graph.facebook.com/v20.0/me/messages?access_token=${pageAccessToken}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: messageText },
      }),
    },
  );
}

// ============================================================================
// Types
// ============================================================================

interface AuthorRecord {
  _id: Id<"authorAccounts">;
  _creationTime: number;
  pendingDeletePostId?: Id<"posts"> | undefined;
  authorId: Id<"authors">;
  psid: string;
  author: {
    name: string | undefined;
  };
}

// ============================================================================
// Main Entrypoint
// ============================================================================

export async function handleIncomingMessage(event: any) {
  const senderId: string = event.sender?.id;
  const messageText: string = (event.message?.text || "").trim();
  const rawAttachments = event.message?.attachments;

  const attachment =
    rawAttachments && rawAttachments.length > 0
      ? extractAttachmentUrl(rawAttachments)
      : null;

  const author = await convex.query(api.authorAccount.getAuthorPSID, {
    psid: senderId,
  });

  if (!author) {
    console.log(`[Timeline Bot] Unrecognized sender PSID: ${senderId}`);
    await sendReply(senderId, `Connected! Your sender PSID is: ${senderId}`);
    return;
  }

  try {
    // 1. Pending delete confirmation check (takes precedence over new commands)
    const handledPendingDelete = await handlePendingDelete(
      senderId,
      author,
      messageText,
    );
    if (handledPendingDelete) return;

    // 2. New delete command: /delete:{postId}
    const handledDeleteCommand = await handleDeleteCommand(
      senderId,
      messageText,
    );
    if (handledDeleteCommand) return;

    // 3. Pending caption response
    const handledPendingCaption = await handlePendingCaption(
      senderId,
      author,
      messageText,
    );
    if (handledPendingCaption) return;

    // 4. Inbound Reel or Facebook attachment
    const handledAttachment = await handleAttachment(
      senderId,
      author,
      attachment,
    );
    if (handledAttachment) return;

    // 5. Inbound text containing URLs or raw text fallback
    if (messageText) {
      await handleTextMessageOrUrl(senderId, author, messageText);
    }
  } catch (err) {
    console.error("[Timeline Bot] Failed to process message:", err);
    await sendReply(senderId, "Oops, could not save this entry. Check logs!");
  }
}

async function handlePendingDelete(
  senderId: string,
  author: AuthorRecord,
  messageText: string,
): Promise<boolean> {
  const pendingDelete = await convex.query(api.post.getPendingDelete, {
    psid: senderId,
  });

  if (!pendingDelete || !messageText) return false;

  const isConfirmed = /^(yes|y|confirm|sure)$/i.test(messageText);
  const isCancelled = /^(no|none|cancel|nope|stop)$/i.test(messageText);

  if (isConfirmed) {
    await convex.mutation(api.post.deletePost, {
      postId: pendingDelete.postId,
      authorId: author.authorId,
    });
    await convex.mutation(api.post.clearPendingDelete, { psid: senderId });
    await sendReply(senderId, "Post deleted successfully 🗑️");
    return true;
  }

  if (isCancelled) {
    await convex.mutation(api.post.clearPendingDelete, { psid: senderId });
    await sendReply(senderId, "Deletion cancelled.");
    return true;
  }

  // User typed something else while a delete confirmation is waiting
  await sendReply(
    senderId,
    "Are you sure you wanted to delete? Reply YES to confirm or NO to cancel.",
  );
  return true;
}

/**
 * Parses `/delete:{postId}` and initiates the confirmation flow.
 * Returns true if a delete command was matched.
 */
async function handleDeleteCommand(
  senderId: string,
  messageText: string,
): Promise<boolean> {
  const match = messageText.match(/^\/delete:(.+)$/i);
  if (!match) return false;

  const postId = match[1].trim() as Id<"posts">;
  if (!postId) {
    await sendReply(senderId, "Please provide a post ID: `/delete:{postId}`");
    return true;
  }

  await convex.mutation(api.post.savePendingDelete, {
    psid: senderId,
    postId,
  });

  await sendReply(
    senderId,
    `Are you sure you wanted to delete post ${postId}? Reply YES to confirm or NO to cancel.`,
  );
  return true;
}

/**
 * Handles completing a post when the user submits or skips a pending caption.
 */
async function handlePendingCaption(
  senderId: string,
  author: AuthorRecord,
  messageText: string,
): Promise<boolean> {
  const pendingPost = await convex.query(api.post.getPendingPost, {
    psid: senderId,
  });

  if (!pendingPost || !messageText) return false;

  const isNoCaption = /^(no|none|skip|nope)$/i.test(messageText);
  const finalCaption = isNoCaption
    ? pendingPost.initialText || ""
    : messageText;

  await convex.mutation(api.post.createPost, {
    authorId: author.authorId,
    type: pendingPost.type,
    text: finalCaption,
    embedUrl: pendingPost.embedUrl,
    embedType: pendingPost.embedType,
    eventDate: Date.now(),
    published: true,
  });

  await convex.mutation(api.post.clearPendingPost, { psid: senderId });
  await sendReply(
    senderId,
    `${author.author?.name || "Author"} shared it to their timeline 💌`,
  );
  return true;
}

/**
 * Saves a pending post for incoming video/reel attachments.
 */
async function handleAttachment(
  senderId: string,
  author: AuthorRecord,
  attachment: any,
): Promise<boolean> {
  if (
    !attachment ||
    (attachment.type !== "reel" && attachment.type !== "post") ||
    !attachment.url
  ) {
    return false;
  }

  await convex.mutation(api.post.savePendingPost, {
    psid: senderId,
    authorId: author._id,
    type: "EMBED",
    embedUrl: attachment.url,
    embedType: "FACEBOOK",
    initialText: "",
  });

  await sendReply(
    senderId,
    "Do you want to add some caption? Write it down or type no",
  );
  return true;
}

/**
 * Processes plain text or URL content.
 */
async function handleTextMessageOrUrl(
  senderId: string,
  author: AuthorRecord,
  messageText: string,
): Promise<void> {
  const { type, embedType, embedUrl, hasUrl } = await parseContent(messageText);

  if (hasUrl) {
    await convex.mutation(api.post.savePendingPost, {
      psid: senderId,
      authorId: author._id,
      type,
      embedUrl: embedUrl ?? undefined,
      embedType,
    });

    await sendReply(
      senderId,
      "Do you want to add some caption? Write it down or type no",
    );
    return;
  }

  // Pure text message (letter)
  await convex.mutation(api.post.createPost, {
    authorId: author.authorId,
    type: "LETTER",
    text: messageText,
    eventDate: Date.now(),
    published: true,
  });

  await sendReply(
    senderId,
    `${author.author?.name || "Author"} shared it to their timeline 💌`,
  );
}
