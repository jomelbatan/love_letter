import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";
import {
  extractAttachmentUrl,
  getCanonicalFacebookUrl,
  getCanonicalTikTokUrl,
} from "./link.helper";

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
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function handleIncomingMessage(event: any) {
  const senderId: string = event.sender.id;
  const messageText: string = (event.message.text || "").trim();
  const rawAttachments = event.message?.attachments;

  // Fast check: Only call extractor if attachments actually exist
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
    // 1. Check if user is answering a pending caption question
    const pendingPost = await convex.query(api.post.getPendingPost, {
      psid: senderId,
    });

    if (pendingPost && messageText) {
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
        `${author.author!.name} shared it to their timeline 💌`,
      );
      return;
    }

    // 2. If it's a Reel attachment, save pending post & ask for caption
    if (attachment && attachment.type === "reel" && attachment.url) {
      await convex.mutation(api.post.savePendingPost, {
        psid: senderId,
        authorId: author._id,
        type: "EMBED",
        embedUrl: attachment.url, // e.g. "https://www.facebook.com/reel/1631929631609795"
        embedType: "FACEBOOK",
        initialText: "",
      });

      await sendReply(
        senderId,
        "Do you want to add some caption write it down or type no",
      );
      return;
    }

    // 3. Fallback to normal text or typed URLs
    const { type, embedType, embedUrl, cleanText, hasUrl } =
      await parseContent(messageText);

    if (hasUrl) {
      await convex.mutation(api.post.savePendingPost, {
        psid: senderId,
        authorId: author._id,
        type,
        embedUrl: embedUrl ?? undefined,
        embedType,
        initialText: cleanText,
      });

      await sendReply(
        senderId,
        "Do you want to add some caption write it down or type no",
      );
      return;
    }

    // 4. Pure text message
    if (messageText) {
      await convex.mutation(api.post.createPost, {
        authorId: author.authorId,
        type: "LETTER",
        text: messageText,
        eventDate: Date.now(),
        published: true,
      });

      await sendReply(
        senderId,
        `${author.author!.name} shared it to their timeline 💌`,
      );
    }
  } catch (err) {
    console.error("[Timeline Bot] Failed to process message:", err);
    await sendReply(senderId, "Oops, could not save this entry. Check logs!");
  }
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
