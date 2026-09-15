// lib/instagram.ts

const INSTAGRAM_API_URL = "https://graph.instagram.com/v25.0/me/messages";

export async function sendInstagramMessage({
  recipientId,
  text,
}: {
  recipientId: string;
  text: string;
}) {
  const accessToken = process.env.IG_PAGE_ACCESS_SP;

  if (!accessToken) {
    throw new Error("Missing INSTAGRAM_ACCESS_TOKEN");
  }

  const response = await fetch(INSTAGRAM_API_URL, {
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
        text,
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Instagram API error: ${JSON.stringify(data)}`);
  }

  return data;
}
