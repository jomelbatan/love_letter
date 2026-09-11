import {
  handleIncomingMessage,
  verifySignature,
} from "@/helpers/facebook.helpers";
import { NextRequest, NextResponse } from "next/server";
const metaToken =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_META_VERIFY_TOKEN
    : process.env.META_VERIFY_TOKEN;
const appSecret =
  process.env.NODE_ENV === "development"
    ? process.env.DEV_META_APP_SECRET
    : process.env.META_APP_SECRET;

// 1. GET: Webhook Verification Challenge
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  if (mode === "subscribe" && token === metaToken) {
    return new Response(challenge, { status: 200 });
  }

  return new Response("Forbidden", { status: 403 });
}

// 2. POST: Message Ingestion
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("x-hub-signature-256");

  // Verify HMAC signature from Meta
  if (!verifySignature(rawBody, signature, appSecret!)) {
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
