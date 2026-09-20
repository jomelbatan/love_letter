"use client";

import { useEffect, useState } from "react";
import { Share2, X, Copy, Check } from "lucide-react";
import QRCode from "react-qr-code";

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Fall back to window.location if no link prop is passed (client only)
  useEffect(() => {
    function init() {
      if (typeof window !== "undefined") {
        setShareUrl(window.location.href);
      }
    }
    init();
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API can fail (e.g. insecure context) — no-op fallback
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full item-center justify-center px-4 py-2 border-2 border-chalk-terracotta flex flex-row gap-2 rounded-xl cursor-pointer"
      >
        <Share2 className="text-chalk-terracotta size-5" />
        <p className="text-chalk-terracotta font-kalam-bold">Share Profile</p>
      </button>

      {/* Modal */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm rounded-2xl bg-chalk-cream p-6 shadow-xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-kalam-bold font-semibold text-chalk-terracotta">
                Share this link
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 text-primary-orange hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="rounded-xl border border-chalk-terracotta p-3">
                <QRCode
                  value={shareUrl}
                  size={256}
                  bgColor="#faf5ef"
                  fgColor="#3a2e2b"
                />
              </div>

              <div className="flex w-full items-center gap-2">
                <input
                  readOnly
                  value={shareUrl}
                  onFocus={(e) => e.currentTarget.select()}
                  className="w-full truncate rounded-lg border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-deep-charcoal focus:outline-none "
                />
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1.5 rounded-lg bg-chalk-terracotta px-3 py-2 text-sm font-medium text-pure-chalk transition active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
