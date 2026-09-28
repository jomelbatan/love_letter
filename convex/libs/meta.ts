import { env } from "../_generated/server";

type Platform = "page" | "instagram";

export async function sendReply(
  platform: Platform,
  recipientId: string,
  messageText: string,
) {
  if (platform === "page") {
    const accessToken = env.META_PAGE_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("FB_ACCESS_TOKEN is not configured");
    }

    return fetch(
      `https://graph.facebook.com/v20.0/me/messages?access_token=${accessToken}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipient: {
            id: recipientId,
          },
          message: {
            text: messageText,
          },
        }),
      },
    );
  }

  const accessToken = env.IG_PAGE_ACCESS_TOKEN;

  if (!accessToken) {
    throw new Error("IG_ACCESS_TOKEN is not configured");
  }

  return fetch("https://graph.instagram.com/v25.0/me/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
      },
    }),
  });
}
