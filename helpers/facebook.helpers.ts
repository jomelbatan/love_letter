/* eslint-disable @typescript-eslint/no-explicit-any */
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import {
  extractAttachmentUrl,
  getCanonicalFacebookUrl,
  getCanonicalInstagramUrl,
  getCanonicalTikTokUrl,
} from "./link.helper";
import { Id } from "@/convex/_generated/dataModel";
import {
  AuthorRecord,
  EmbedType,
  PendingDelete,
  PendingPost,
  PostType,
} from "@/types/interception";
import { classifyIntent } from "./intent.helper";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

const FBAccessToken =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_META_PAGE_ACCESS_TOKEN
    : process.env.META_PAGE_ACCESS_TOKEN;

const IGAccessToken =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_IG_PAGE_ACCESS_TOKEN
    : process.env.IG_PAGE_ACCESS_TOKEN;

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
  } else if (lower.includes("instagram.com")) {
    embedType = "INSTAGRAM";
    embedUrl = await getCanonicalInstagramUrl(embedUrl);
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
export async function sendReply(
  payload: string,
  recipientId: string,
  messageText: string,
) {
  return payload === "page"
    ? await fetch(
        `https://graph.facebook.com/v20.0/me/messages?access_token=${FBAccessToken}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            recipient: { id: recipientId },
            message: { text: messageText },
          }),
        },
      )
    : await fetch("https://graph.instagram.com/v25.0/me/messages", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${IGAccessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: {
            text: messageText,
          },
          recipient: {
            id: recipientId,
          },
        }),
      });
}

// ============================================================================
// Main Entrypoint
// ============================================================================

export async function handleIncomingMessage(event: any, payload: string) {
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
    await sendReply(
      payload,
      senderId,
      `Connected! Your sender PSID is: ${senderId}`,
    );
    return;
  }

  try {
    await dispatchMessage(payload, senderId, author, messageText, attachment);
  } catch (err) {
    console.error("[Timeline Bot] Failed to process message:", err);
    await sendReply(
      payload,
      senderId,
      "Oops, could not save this entry. Check logs!",
    );
  }
}

/**
 * Figures out which single handler applies to this message and runs only
 * that one. Previously, `getPendingDelete` and `getPendingPost` were queried
 * one after another on *every* incoming message (including attachment-only
 * messages with no text, where neither result could ever be used). Now:
 *  - both are skipped entirely when there's no messageText to react to
 *  - when they are needed, they're fetched together in one round trip
 *    instead of sequentially
 *  - the `/delete:{id}` command is a plain regex check, so it costs nothing
 */

async function dispatchMessage(
  payload: string,
  senderId: string,
  author: AuthorRecord,
  messageText: string,
  attachment: any,
): Promise<void> {
  const [pendingDelete, pendingPost] =
    messageText || attachment
      ? await Promise.all([
          convex.query(api.post.getPendingDelete, {
            psid: senderId,
          }) as Promise<PendingDelete | null>,
          convex.query(api.post.getPendingPost, {
            psid: senderId,
          }) as Promise<PendingPost | null>,
        ])
      : [null, null];

  const intent = classifyIntent(
    messageText,
    attachment,
    pendingDelete,
    pendingPost,
  );

  switch (intent.kind) {
    case "confirmDelete":
      return resolvePendingDelete(
        payload,
        senderId,
        author,
        intent.pending,
        intent.text,
      );
    case "startDelete":
      return startDeleteFlow(payload, senderId, intent.postId);
    case "createNote":
      return void convex.mutation(api.notes.createNote, {
        authorId: author.authorId,
        content: intent.content,
      });
    case "interruptCaptionWithNewPost":
      await resolvePendingCaption(
        payload,
        senderId,
        author,
        intent.pending,
        "",
      );
      return handleTextMessageOrUrl(payload, senderId, author, intent.url);
    case "interruptCaptionWithImage":
      await resolvePendingCaption(
        payload,
        senderId,
        author,
        intent.pending,
        "",
      );
      return handleAttachment(payload, senderId, author, {
        type: "image",
        url: intent.imageUrl,
      });
    case "provideCaption":
      return resolvePendingCaption(
        payload,
        senderId,
        author,
        intent.pending,
        intent.text,
      );
    case "handleAttachment":
      return handleAttachment(payload, senderId, author, intent.attachment);
    case "handleTextOrUrl":
      return handleTextMessageOrUrl(payload, senderId, author, intent.text);
    case "noop":
      return;
  }
}

async function resolvePendingDelete(
  payload: string,
  senderId: string,
  author: AuthorRecord,
  pendingDelete: PendingDelete,
  messageText: string,
): Promise<void> {
  const isConfirmed = /^(yes|y|confirm|sure)$/i.test(messageText);
  const isCancelled = /^(no|none|cancel|nope|stop)$/i.test(messageText);

  if (isConfirmed) {
    await convex.mutation(api.post.deletePost, {
      postId: pendingDelete.postId,
      authorId: author.authorId,
    });
    await convex.mutation(api.post.clearPendingDelete, { psid: senderId });
    await sendReply(payload, senderId, "Post deleted successfully 🗑️");
    return;
  }

  if (isCancelled) {
    await convex.mutation(api.post.clearPendingDelete, { psid: senderId });
    await sendReply(payload, senderId, "Deletion cancelled.");
    return;
  }

  // User typed something else while a delete confirmation is waiting
  await sendReply(
    payload,
    senderId,
    "Are you sure you wanted to delete? Reply YES to confirm or NO to cancel.",
  );
}

async function startDeleteFlow(
  payload: string,
  senderId: string,
  postId: string,
): Promise<void> {
  if (!postId) {
    await sendReply(
      payload,
      senderId,
      "Please provide a post ID: `/delete:{postId}`",
    );
    return;
  }

  await convex.mutation(api.post.savePendingDelete, {
    psid: senderId,
    postId: postId as Id<"posts">,
  });

  await sendReply(
    payload,
    senderId,
    `Are you sure you wanted to delete post ${postId}? Reply YES to confirm or NO to cancel.`,
  );
}

async function resolvePendingCaption(
  payload: string,
  senderId: string,
  author: AuthorRecord,
  pendingPost: PendingPost,
  messageText: string,
): Promise<void> {
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
    payload,
    senderId,
    `${author.author?.name || "Author"} shared it to their timeline 💌`,
  );
}

async function handleAttachment(
  payload: string,
  senderId: string,
  author: AuthorRecord,
  attachment: any,
): Promise<void> {
  await convex.mutation(api.post.savePendingPost, {
    psid: senderId,
    authorId: author._id,
    type: "EMBED",
    embedUrl: attachment.url,
    embedType: "FACEBOOK",
    initialText: "",
  });

  await sendReply(
    payload,
    senderId,
    "Do you want to add some caption? Write it down or type no",
  );
}

async function handleTextMessageOrUrl(
  payload: string,
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
      payload,
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
    payload,
    senderId,
    `${author.author?.name || "Author"} shared it to their timeline 💌`,
  );
}
