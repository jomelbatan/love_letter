import { NextRequest, NextResponse } from "next/server";

// GET /api/instagram-oembed?url=<instagram post/reel url>
//
// Requires env vars (server-side only, never exposed to client):
//   IG_APP_ID      -> your Facebook App ID
//   IG_APP_SECRET  -> your Facebook App Secret
// The Graph API accepts an app access token in the form "APP_ID|APP_SECRET".
// You can swap this for a long-lived user/page token if you already have one.

const GRAPH_VERSION = "v26.0";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing required 'url' query param" },
      { status: 400 },
    );
  }

  const graphUrl = new URL(
    `https://graph.facebook.com/${GRAPH_VERSION}/instagram_oembed`,
  );
  graphUrl.searchParams.set("url", url);

  try {
    const res = await fetch(graphUrl.toString(), {
      // oEmbed responses are static per-post; cache at the edge for an hour
      next: { revalidate: 3600 },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(
        { error: data?.error?.message ?? "Failed to fetch oEmbed data" },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: "Unexpected error contacting Graph API" },
      { status: 502 },
    );
  }
}
