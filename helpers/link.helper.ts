export async function getCanonicalFacebookUrl(url: string): Promise<string> {
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

export async function getCanonicalTikTokUrl(url: string): Promise<string> {
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    });
    return (res.url || url).split("?")[0];
  } catch {
    return url;
  }
}

export function extractAttachmentUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments: any[],
): { type: string; url: string | null } | null {
  const firstAttachment = attachments[0];
  const type: string = firstAttachment?.type || "";
  const rawUrl: string = firstAttachment?.payload?.url || "";

  if (!rawUrl) return null;

  // If it's a reel, strip everything starting from '?'
  if (type === "reel" || rawUrl.includes("/reel/")) {
    const cleanUrl = rawUrl.split("?")[0];
    return {
      type: "reel",
      url: cleanUrl,
    };
  }

  return {
    type,
    url: rawUrl,
  };
}

export function getTikTokVideoId(url: string): string | null {
  const match = url.match(/\/video\/(\d+)/);
  return match?.[1] ?? null;
}
type YouTubeVideo = {
  id: string;
  isShort: boolean;
  aspectRatio: number;
};

export function parseYouTubeUrl(url: string): YouTubeVideo | null {
  try {
    const parsed = new URL(url);

    // youtube.com/shorts/VIDEO_ID
    if (parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.split("/")[2];

      if (!id) return null;

      return {
        id,
        isShort: true,
        aspectRatio: 9 / 16,
      };
    }

    // youtube.com/embed/VIDEO_ID
    if (parsed.pathname.startsWith("/embed/")) {
      const id = parsed.pathname.split("/")[2];

      if (!id) return null;

      return {
        id,
        isShort: false,
        aspectRatio: 16 / 9,
      };
    }

    // youtube.com/watch?v=VIDEO_ID
    // youtube.com/watch/VIDEO_ID
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");

      if (!id) return null;

      return {
        id,
        isShort: false,
        aspectRatio: 16 / 9,
      };
    }

    if (parsed.pathname.startsWith("/watch/")) {
      const id = parsed.pathname.split("/")[2];

      if (!id) return null;

      return {
        id,
        isShort: false,
        aspectRatio: 16 / 9,
      };
    }

    // youtu.be/VIDEO_ID
    if (parsed.hostname === "youtu.be") {
      const id = parsed.pathname.slice(1);

      if (!id) return null;

      return {
        id,
        isShort: false,
        aspectRatio: 16 / 9,
      };
    }

    return null;
  } catch {
    return null;
  }
}
type SpotifyType = "track" | "episode" | "playlist";

type SpotifyInfo = {
  id: string;
  type: SpotifyType;
};

export function getSpotifyInfo(url: string): SpotifyInfo | null {
  try {
    const { pathname } = new URL(url);

    const match = pathname.match(/^\/(track|episode|playlist)\/([^/?#]+)/);

    if (!match) return null;

    const [, type, id] = match;

    return {
      id,
      type: type as SpotifyType,
    };
  } catch {
    return null;
  }
}
