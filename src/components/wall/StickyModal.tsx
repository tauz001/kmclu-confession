"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ConfessionItem } from "./StickyNote";

interface StickyModalProps {
  item: ConfessionItem | null;
  onClose: () => void;
}

const REACTIONS = [
  { emoji: "🤫", label: "Secret" },
  { emoji: "🔥", label: "Real" },
  { emoji: "💀", label: "Dead" },
  { emoji: "🫂", label: "Hug" },
  { emoji: "❤️", label: "Felt That" },
];

import { downloadOrShareConfessionImage } from "@/lib/generateConfessionImage";

export default function StickyModal({ item, onClose }: StickyModalProps) {
  const [copied, setCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageSuccess, setImageSuccess] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.confession);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareLink = async () => {
    const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/?note=${item._id}` : "";
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2500);
    }
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "KMCLU Confession",
          text: `"${item.confession.slice(0, 100)}..."`,
          url: shareUrl,
        });
      } catch {
        // Ignored if cancelled
      }
    }
  };

  const handleShareImage = async () => {
    try {
      setIsGeneratingImage(true);
      const result = await downloadOrShareConfessionImage(item);
      if (result === "downloaded" || result === "shared") {
        setImageSuccess(true);
        setTimeout(() => setImageSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to generate confession image:", err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleReact = (emoji: string) => {
    if (userReaction === emoji) {
      setUserReaction(null);
      setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 1) - 1 }));
    } else {
      if (userReaction) {
        setReactions((prev) => ({
          ...prev,
          [userReaction]: Math.max(0, (prev[userReaction] || 1) - 1),
        }));
      }
      setUserReaction(emoji);
      setReactions((prev) => ({ ...prev, [emoji]: (prev[emoji] || 0) + 1 }));
    }
  };

  const formattedDate = new Date(item.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        {/* Modal Sticky Note */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20, rotate: 2 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-lg max-h-[88dvh] flex flex-col rounded-sm p-4 sm:p-6 md:p-7 sticky-paper-shadow text-slate-900 border-t-8 border-amber-300/40"
          style={{
            backgroundColor: item.stickyColor || "#fff9c4",
          }}
        >
          {/* Top Tape decoration */}
          <div className="absolute -top-3.5 sm:-top-4 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-6 sm:h-7 tape-strip rounded-xs -rotate-1 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Header Metadata */}
          <div className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-mono text-slate-700/80 mb-3 sm:mb-4 pb-2 border-b border-black/10 flex-shrink-0 pr-8">
            <span className="truncate">Pinned on {formattedDate}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold whitespace-nowrap">100% Anonymous</span>
          </div>

          {/* Confession body (Centered text) */}
          <div className="flex-1 min-h-0 overflow-y-auto pr-1 sm:pr-2 my-2 sm:my-3 flex flex-col justify-center items-center text-center space-y-3">
            {/* Attached Photo */}
            {item.imageUrl && (
              <div className="mx-auto max-w-[220px] sm:max-w-xs bg-white p-1.5 sm:p-2 pb-2 sm:pb-3 rounded-xs shadow-[0_4px_12px_rgba(0,0,0,0.25)] border border-black/15 -rotate-1">
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-xs bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.imageUrl}
                    alt="Attached confession photo"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            <p className="font-sticky text-center text-xl sm:text-2xl md:text-3xl leading-relaxed text-slate-900 font-bold whitespace-pre-wrap break-words">
              {item.confession}
            </p>
          </div>

          {/* Reaction stamps bar */}
          <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-black/10 flex-shrink-0">
            <p className="text-[10px] sm:text-xs uppercase tracking-wider font-semibold text-slate-600 mb-1.5">
              Leave an anonymous reaction:
            </p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2 items-center">
              {REACTIONS.map(({ emoji, label }) => {
                const count = reactions[emoji] || 0;
                const isSelected = userReaction === emoji;
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-medium transition-all cursor-pointer ${
                      isSelected
                        ? "bg-black text-white shadow-md scale-105"
                        : "bg-black/5 hover:bg-black/15 text-slate-800"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="font-sans">{label}</span>
                    {count > 0 && <span className="font-mono text-[9px] sm:text-[10px] font-bold">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Expandable Sharing Options Drawer */}
          <AnimatePresence>
            {showShareOptions && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 overflow-hidden bg-black/5 rounded-xl border border-black/15 p-2.5 flex-shrink-0"
              >
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center justify-between">
                  <span>Share This Confession:</span>
                  <button
                    onClick={() => setShowShareOptions(false)}
                    className="text-[10px] text-slate-500 hover:text-black cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {/* Format 1: Link */}
                  <button
                    onClick={handleShareLink}
                    className="btn-funky-cyan px-2.5 py-2 rounded-lg text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer text-center"
                  >
                    <span>🔗</span>
                    <span>{linkCopied ? "Link Copied!" : "Share Link"}</span>
                  </button>

                  {/* Format 2: Elegant Image */}
                  <button
                    onClick={handleShareImage}
                    disabled={isGeneratingImage}
                    className="btn-funky-pink px-2.5 py-2 rounded-lg text-xs font-black uppercase flex items-center justify-center gap-1.5 cursor-pointer text-center disabled:opacity-50"
                  >
                    <span>🎨</span>
                    <span>
                      {isGeneratingImage
                        ? "Rendering..."
                        : imageSuccess
                        ? "Image Saved!"
                        : "Card Image"}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Row */}
          <div className="mt-3 sm:mt-4 flex items-center justify-between pt-2 sm:pt-2.5 border-t border-black/10 flex-shrink-0 flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-slate-700 hover:text-black py-1 px-2 rounded-md hover:bg-black/5 transition-colors cursor-pointer"
              >
                <span>{copied ? "✓ Copied!" : "📋 Copy"}</span>
              </button>

              {/* Little Share Button */}
              <button
                onClick={() => setShowShareOptions(!showShareOptions)}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer ${
                  showShareOptions
                    ? "bg-black text-white shadow-sm"
                    : "btn-funky-lime"
                }`}
                title="Share confession link or card image"
              >
                <span>📤</span>
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="px-3.5 sm:px-4 py-1.5 text-[11px] sm:text-xs font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
