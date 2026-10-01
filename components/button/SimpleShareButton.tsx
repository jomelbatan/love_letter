"use client";

import { useState } from "react";
import { Check, Copy, Share } from "lucide-react";
import { Share2 } from "feather-icons-react";

interface SimpleShareButtonProps {
  textToCopy: string;
  label?: string;
  copiedLabel?: string;
  duration?: number; // Duration in milliseconds before resetting
  className?: string;
}

export function SimpleShareButton({
  textToCopy,
  duration = 2000,
  className = "",
}: SimpleShareButtonProps) {
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
          <Share2 className="size-5 text-neutral-500 transition-transform duration-200" />
        </>
      )}
    </button>
  );
}
