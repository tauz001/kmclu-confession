"use client";

import React from "react";
import { motion } from "framer-motion";

export default function CollageElements() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* Top Left Washi Tape Slogan */}
      <motion.div
        initial={{ opacity: 0, y: -10, rotate: -4 }}
        animate={{ opacity: 1, y: 0, rotate: -4 }}
        transition={{ delay: 0.15 }}
        className="absolute top-20 left-2 sm:left-6 z-10"
      >
        <div className="bg-[#bef264] text-black font-black text-xs px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000] uppercase tracking-wider flex items-center gap-1.5">
          <span>☕</span>
          <span>CANTEEN CHAI &gt; OVERTHINKING</span>
        </div>
      </motion.div>

      {/* Top Right Washi Tape Slogan */}
      <motion.div
        initial={{ opacity: 0, y: -10, rotate: 4 }}
        animate={{ opacity: 1, y: 0, rotate: 4 }}
        transition={{ delay: 0.2 }}
        className="absolute top-20 right-2 sm:right-8 z-10"
      >
        <div className="bg-[#38bdf8] text-black font-black text-xs px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000] uppercase tracking-wider flex items-center gap-1.5">
          <span>🤐</span>
          <span>100% UNTRACED • ZERO LOGS</span>
        </div>
      </motion.div>

      {/* Bottom Left Washi Tape Slogan */}
      <motion.div
        initial={{ opacity: 0, rotate: 3 }}
        animate={{ opacity: 1, rotate: 3 }}
        transition={{ delay: 0.25 }}
        className="absolute bottom-20 left-4 sm:left-8 z-10"
      >
        <div className="bg-[#fb7185] text-white font-black text-xs px-3.5 py-1.5 border-2 border-black shadow-[3px_3px_0px_#000] tracking-wide flex items-center gap-1.5">
          <span>🔥</span>
          <span>WHAT HAPPENS HERE STAYS HERE</span>
        </div>
      </motion.div>

      {/* Bottom Right Stamped Badge */}
      <motion.div
        initial={{ opacity: 0, rotate: -5 }}
        animate={{ opacity: 0.7, rotate: -5 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-20 right-4 sm:right-10 z-10 pointer-events-none"
      >
        <div className="border-3 border-dashed border-rose-500/80 text-rose-400 font-black text-xs sm:text-sm px-3.5 py-1 uppercase tracking-widest rounded-sm shadow-sm">
          TOP SECRET • KMCLU 🤫
        </div>
      </motion.div>

      {/* Subtle red pushpin at top center */}
      <div className="absolute top-14 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-white shadow-[1px_2px_4px_rgba(0,0,0,0.5)] pointer-events-none">
        <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
      </div>
    </div>
  );
}
