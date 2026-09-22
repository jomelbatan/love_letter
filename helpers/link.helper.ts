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
export async function getCanonicalInstagramUrl(url: string): Promise<string> {
  const POST_PATH = /\/(p|reel|reels|tv)\/[A-Za-z0-9_-]+/;

  const fallback = () => {
    // Best-effort: extract the post path + username-less canonical from the input itself
    const match = url.match(POST_PATH);
    if (match) return `https://www.instagram.com${match[0]}/`;
    return url.split("?")[0];
  };

  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const finalUrl = res.url || url;

    // If we're still on a post/reel page, that's the canonical.
    // Otherwise Instagram bounced us to /accounts/login or a challenge page.
    if (POST_PATH.test(new URL(finalUrl).pathname)) {
      const match = finalUrl.match(POST_PATH);
      return match ? `https://www.instagram.com${match[0]}/` : fallback();
    }

    return fallback();
  } catch {
    return fallback();
  }
}

export function extractAttachmentUrl(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attachments: any[],
): { type: string; url: string | null } | null {
  const firstAttachment = attachments[0];

  const type = firstAttachment?.type || "";
  const rawUrl = firstAttachment?.payload?.url || "";

  if (!rawUrl) return null;

  return {
    type,
    url: rawUrl.split("?")[0],
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
export async function getYouTubeMetadata(url: string) {
  const response = await fetch(
    `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
  );

  if (!response.ok) {
    throw new Error("Failed to fetch YouTube metadata");
  }

  const data = await response.json();

  return {
    title: data.title,
    author_name: data.author_name.replace(/\s*-\s*Topic$/, ""),
    thumbnail_url: data.thumbnail_url.replace("hqdefault", "maxresdefault"),
  };
}
export function getYouTubeVideoId(url: string): string | null {
  try {
    const parsedUrl = new URL(url);

    // youtube.com/watch?v=...
    if (parsedUrl.searchParams.has("v")) {
      return parsedUrl.searchParams.get("v");
    }

    // youtu.be/...
    if (parsedUrl.hostname === "youtu.be") {
      return parsedUrl.pathname.slice(1);
    }

    // youtube.com/shorts/...
    if (parsedUrl.pathname.startsWith("/shorts/")) {
      return parsedUrl.pathname.split("/")[2];
    }

    return null;
  } catch {
    return null;
  }
}
