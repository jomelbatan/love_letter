"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  duration?: number; // Duration in milliseconds before resetting
  className?: string;
}

export function CopyButton({
  textToCopy,
  duration = 2000,
  className = "",
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (copied) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, duration);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button type="button" onClick={handleCopy}>
      {copied ? (
        <>
          <Check className="size-5 text-emerald-500 transition-transform duration-200" />
        </>
      ) : (
        <>
          <Copy className="size-5 text-neutral-500 transition-transform duration-200" />
        </>
      )}
    </button>
  );
}
