"use client";

import { useState } from "react";

export default function Test({ recipientId }: { recipientId: string }) {
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true);

    try {
      const response = await fetch("/api/insta/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipientId,
          text: "Hello World",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      alert("Message sent!");
    } catch (error) {
      console.error(error);
      alert("Failed to send message");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={loading}
      className="rounded-lg bg-black px-4 py-2 text-white disabled:opacity-50"
    >
      {loading ? "Sending..." : "Send Instagram Message"}
    </button>
  );
}
