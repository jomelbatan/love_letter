/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const url = "https://www.youtube.com/watch/q3lX2p_Uy9I";
  async function handlePress() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(
        `https://www.youtube.com/oembed?url=${url}&format=json`,
      );

      if (!response.ok) {
        throw new Error("Invalid YouTube URL");
      }

      return response.json();
    } catch (error) {
      console.error("Failed to fetch embed data:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <button
        type="button"
        disabled={loading}
        onClick={handlePress}
        className="bg-red-500 hover:bg-red-600 disabled:opacity-50 px-4 py-2 text-white font-medium rounded"
      >
        {loading ? "Resolving..." : "Resolve Facebook URL"}
      </button>

      {error && (
        <div className="text-red-500 text-sm font-medium">Error: {error}</div>
      )}

      {result && (
        <pre className="p-3 bg-gray-100 dark:bg-gray-800 rounded text-xs overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
