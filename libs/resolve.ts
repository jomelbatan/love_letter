export async function resolveFacebookUrl(inputUrl: string) {
  const response = await fetch(inputUrl, {
    redirect: "follow",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/140.0.0.0 Safari/537.36",
    },
  });

  return response.url;
}
