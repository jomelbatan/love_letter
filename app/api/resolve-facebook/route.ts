import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const url = body?.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: 'A valid "url" field is required.' },
        { status: 400 },
      );
    }

    let targetUrl = url.trim();

    if (targetUrl.includes("/share/")) {
      const fbResponse = await fetch(targetUrl, {
        method: "GET",
        redirect: "manual",
        headers: {
          "User-Agent":
            "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
        },
      });

      const location = fbResponse.headers.get("location");
      if (location) {
        targetUrl = location;
      }
    }

    const parsed = new URL(targetUrl);
    const cleanUrl = `${parsed.origin}${parsed.pathname}`;

    const idMatch =
      cleanUrl.match(/\/reel\/(\d+)/) ||
      cleanUrl.match(/\/videos\/(\d+)/) ||
      targetUrl.match(/[?&]v=(\d+)/);

    const videoId = idMatch ? idMatch[1] : null;

    return NextResponse.json({
      success: true,
      originalUrl: url,
      canonicalUrl: cleanUrl,
      watchUrl: videoId ? `https://www.facebook.com/watch/?v=${videoId}` : null,
      videoId,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500 },
    );
  }
}
