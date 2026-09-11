/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";

export default function Test() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  async function handlePress() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/resolve-facebook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: "https://www.facebook.com/share/v/19ZXFD1j3j/",
        }),
      });

      // Check if the response returned an error status before parsing JSON
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Server returned ${response.status}: ${errorText || response.statusText}`,
        );
      }

      const data = await response.json();
      console.log("Resolved:", data);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Something went wrong");
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
