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

export default function StickyModal({ item, onClose }: StickyModalProps) {
  const [copied, setCopied] = useState(false);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [userReaction, setUserReaction] = useState<string | null>(null);

  if (!item) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(item.confession);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
          className="relative z-10 w-full max-w-lg rounded-sm p-6 sm:p-8 sticky-paper-shadow text-slate-900 border-t-8 border-amber-300/40"
          style={{
            backgroundColor: item.stickyColor || "#fff9c4",
          }}
        >
          {/* Top Tape decoration */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-7 tape-strip rounded-xs -rotate-1 pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/10 hover:bg-black/20 flex items-center justify-center text-slate-800 transition-colors"
            aria-label="Close modal"
          >
            ✕
          </button>

          {/* Header Metadata */}
          <div className="flex items-center gap-2 text-xs font-mono text-slate-700/80 mb-4 pb-2 border-b border-black/10">
            <span>Pinned on {formattedDate}</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold">100% Anonymous</span>
          </div>

          {/* Confession body */}
          <div className="max-h-[55vh] overflow-y-auto pr-2 my-4 space-y-3">
            {/* Attached Photo */}
            {item.imageUrl && (
              <div className="mx-auto max-w-xs bg-white p-2 pb-3 rounded-xs shadow-[0_4px_12px_rgba(0,0,0,0.25)] border border-black/15 -rotate-1">
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

            <p className="font-sticky text-2xl sm:text-3xl leading-relaxed text-slate-900 font-bold whitespace-pre-wrap break-words">
              {item.confession}
            </p>
          </div>

          {/* Reaction stamps bar */}
          <div className="mt-6 pt-4 border-t border-black/10">
            <p className="text-xs uppercase tracking-wider font-semibold text-slate-600 mb-2">
              Leave an anonymous reaction:
            </p>
            <div className="flex flex-wrap gap-2 items-center">
              {REACTIONS.map(({ emoji, label }) => {
                const count = reactions[emoji] || 0;
                const isSelected = userReaction === emoji;
                return (
                  <button
                    key={emoji}
                    onClick={() => handleReact(emoji)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-black text-white shadow-md scale-105"
                        : "bg-black/5 hover:bg-black/15 text-slate-800"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span className="font-sans">{label}</span>
                    {count > 0 && <span className="font-mono text-[10px] font-bold">({count})</span>}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row */}
          <div className="mt-6 flex items-center justify-between pt-3 border-t border-black/10">
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-black py-1 px-2 rounded-md hover:bg-black/5 transition-colors"
            >
              <span>{copied ? "✓ Copied!" : "📋 Copy confession"}</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-1.5 text-xs font-semibold rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Done Reading
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
