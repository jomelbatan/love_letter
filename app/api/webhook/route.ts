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

  // Verify HMAC signature from Meta
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

  // Meta expects an immediate 200 OK
  return NextResponse.json({ status: "EVENT_RECEIVED" }, { status: 200 });
}

// Helper: HMAC verification
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

// Helper: Core message parser and poster
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function handleIncomingMessage(event: any) {
  console.log("Event: ", event);
  const senderId: string = event.sender.id;
  const messageText: string = event.message.text || "";

  // Map PSID to Author
  const author = await convex.query(api.authorAccount.getAuthorPSID, {
    psid: senderId,
  });

  // During setup: if PSID is not yet configured, log it so you can copy it
  if (!author) {
    console.log(`[Timeline Bot] Unrecognized sender PSID: ${senderId}`);
    await sendReply(senderId, `Connected! Your sender PSID is: ${senderId}`);
    return;
  }

  // Parse URLs and determine type
  const { type, embedType, embedUrl, cleanText } =
    await parseContent(messageText);

  try {
    // Call internal Convex mutation

    await convex.mutation(api.post.createPost, {
      authorId: author._id,
      type,
      text: cleanText,
      embedUrl: embedUrl ?? undefined,
      embedType,
      eventDate: Date.now(),
      published: true,
    });

    await sendReply(senderId, `${author.name} shared it their timeline 💌`);
  } catch (err) {
    console.error("[Timeline Bot] Failed to save post:", err);
    await sendReply(senderId, "Oops, could not save this entry. Check logs!");
  }
}
//TODO Need some improvement
// Helper: Detect link type and clean up body
async function parseContent(text: string) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const urls = text.match(urlRegex);

  let embedUrl = urls?.[0] ?? null;

  let type: PostType = "LETTER";
  let embedType: EmbedType | undefined;

  if (embedUrl) {
    type = "EMBED";

    if (embedUrl.includes("spotify.com")) {
      embedType = "SPOTIFY";
    } else if (embedUrl.includes("tiktok.com")) {
      embedType = "TIKTOK";
    } else if (
      embedUrl.includes("youtube.com") ||
      embedUrl.includes("youtu.be")
    ) {
      embedType = "YOUTUBE";
    } else if (
      embedUrl.includes("facebook.com") ||
      embedUrl.includes("instagram.com")
    ) {
      embedType = "FACEBOOK";

      if (embedUrl.includes("share")) {
        embedUrl = await getCanonicalUrl(embedUrl);
      }
    } else {
      embedType = "LINK";
    }
  }

  const cleanText = text.replace(embedUrl ?? "", "").trim();

  return {
    type,
    embedType,
    embedUrl,
    cleanText: cleanText || text,
  };
}

// Helper: Send reply back to user via Messenger Send API
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
function getCanonicalUrl(
  embedUrl: string,
): string | PromiseLike<string | null> | null {
  throw new Error("Function not implemented.");
}
