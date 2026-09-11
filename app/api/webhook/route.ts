import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@/convex/_generated/api";

type PostType = "TEXT" | "LETTER" | "IMAGE" | "EMBED";
type EmbedType = "SPOTIFY" | "TIKTOK" | "FACEBOOK" | "YOUTUBE" | "LINK";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

// 1. GET: Webhook Verification Challenge
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

// 2. POST: Message Ingestion
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  if (!verifySignature(rawBody, signature, process.env.META_APP_SECRET!)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody);

  if (payload.object !== "page") {
    return NextResponse.json({ status: "not_a_page_event" });
  }

  for (const entry of payload.entry || []) {
    for (const messagingEvent of entry.messaging || []) {
      if (messagingEvent.message && !messagingEvent.message.is_echo) {
        await handleIncomingMessage(messagingEvent);
      }
    }
  }

  return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
}

function verifySignature(
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
async function handleIncomingMessage(event: any) {
  const senderId: string = event.sender.id;
  const messageText: string = (event.message.text || "").trim();

  if (!messageText) return;

  const author = await convex.query(api.authorAccount.getAuthorPSID, {
    psid: senderId,
  });

  if (!author) {
    console.log(`[Timeline Bot] Unrecognized sender PSID: ${senderId}`);
    await sendReply(senderId, `Connected! Your sender PSID is: ${senderId}`);
    return;
  }

  try {
    // 1. Check if user is answering a pending caption prompt
    const pendingPost = await convex.query(api.post.getPendingPost, {
      psid: senderId,
    });

    if (pendingPost) {
      const isNoCaption = /^(no|none|skip|nope)$/i.test(messageText);
      const finalCaption = isNoCaption
        ? pendingPost.initialText || ""
        : messageText;

      await convex.mutation(api.post.createPost, {
        authorId: author.author!._id,
        type: "EMBED",
        text: finalCaption,
        embedUrl: pendingPost.embedUrl,
        embedType: pendingPost.embedType,
        eventDate: Date.now(),
        published: true,
      });

      // Clear pending post session
      await convex.mutation(api.post.clearPendingPost, { psid: senderId });

      await sendReply(
        senderId,
        `${author.author!.name} shared it to their timeline 💌`,
      );
      return;
    }

    // 2. Parse incoming content
    const { embedType, embedUrl, cleanText, hasUrl } =
      await parseContent(messageText);

    if (hasUrl) {
      // If a URL is detected, stash it and prompt for caption
      await convex.mutation(api.post.savePendingPost, {
        psid: senderId,
        authorId: author._id,
        type: "EMBED",
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

    // 3. Normal text: create immediately
    await convex.mutation(api.post.createPost, {
      authorId: author.author!._id,
      type: "LETTER",
      text: messageText,
      eventDate: Date.now(),
      published: true,
    });

    await sendReply(
      senderId,
      `${author.author!.name} shared it to their timeline 💌`,
    );
  } catch (err) {
    console.error("[Timeline Bot] Failed to process message:", err);
    await sendReply(senderId, "Oops, could not save this entry. Check logs!");
  }
}

async function parseContent(text: string) {
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
  } else if (lower.includes("tiktok.com")) {
    embedType = "TIKTOK";
  } else if (lower.includes("youtube.com") || lower.includes("youtu.be")) {
    embedType = "YOUTUBE";
  } else if (lower.includes("facebook.com") || lower.includes("fb.watch")) {
    embedType = "FACEBOOK";

    if (lower.includes("facebook.com/share/")) {
      embedUrl = await getCanonicalUrl(embedUrl);
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

async function sendReply(recipientId: string, messageText: string) {
  await fetch(
    `https://graph.facebook.com/v20.0/me/messages?access_token=${process.env.META_PAGE_ACCESS_TOKEN}`,
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

async function getCanonicalUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": "facebookexternalhit/1.1" },
    });
    const location = res.headers.get("location");
    return (location || url).split("?")[0];
  } catch {
    return url;
  }
}
