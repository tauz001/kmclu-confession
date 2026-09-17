"use client";

import React from "react";
import { motion } from "framer-motion";

export default function WallPosters() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden select-none z-0">
      {/* =========================================================
          POSTER 1: TOP-LEFT — RETRO GIG / SOUNDS FLYER
          ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: -6 }}
        animate={{ opacity: 1, y: 0, rotate: -6 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="absolute top-16 -left-4 sm:left-4 md:left-8 z-0 w-44 sm:w-56 p-3 sm:p-4 bg-[#fb7185] text-slate-950 border-2 border-black shadow-[6px_8px_0px_rgba(0,0,0,0.85)]"
      >
        {/* Top Masking Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-6 tape-strip rounded-xs -rotate-2" />

        <div className="border border-black p-2 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-black pb-1 mb-2">
            <span className="text-[10px] font-mono font-black uppercase tracking-widest bg-black text-[#fb7185] px-1.5 py-0.5">
              KMCLU LIVE
            </span>
            <span className="text-[10px] font-mono font-bold">VOL. 04</span>
          </div>

          <div className="my-1">
            <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight leading-none">
              MIDNIGHT NOISE
            </h3>
            <p className="text-[11px] font-bold font-mono tracking-tight text-slate-900 mt-1">
              HOSTEL BASEMENT • 11 PM
            </p>
          </div>

          <div className="mt-2 pt-1 border-t border-dashed border-black/60 flex items-center justify-between text-[9px] font-mono font-extrabold">
            <span>NO PHONES ALLOWED</span>
            <span>ENTRY: FREE CHAI ☕</span>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          POSTER 2: TOP-RIGHT — SWISS BRUTALIST "SPILL THE TRUTH"
          ========================================================= */}
      <motion.div
        initial={{ opacity: 0, y: -20, rotate: 5 }}
        animate={{ opacity: 1, y: 0, rotate: 5 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="absolute top-20 -right-4 sm:right-6 md:right-10 z-0 w-48 sm:w-60 p-3.5 sm:p-5 bg-[#fef08a] text-black border-2 border-black shadow-[6px_8px_0px_rgba(0,0,0,0.85)]"
      >
        {/* Corner Tapes */}
        <div className="absolute -top-3 -right-2 w-14 h-5 tape-strip rotate-45" />
        <div className="absolute -bottom-3 -left-2 w-14 h-5 tape-strip rotate-45" />

        <div className="flex flex-col justify-between">
          <div className="flex items-center justify-between text-[10px] font-mono font-black uppercase">
            <span>ISSUE #26</span>
            <span className="bg-red-600 text-white px-1 py-0.5 text-[9px] font-bold">
              CLASSIFIED
            </span>
          </div>

          <div className="my-2">
            <h4 className="text-2xl sm:text-3xl font-black uppercase leading-none tracking-tighter">
              DON&apos;T DIE WITH SECRETS
            </h4>
            <p className="text-xs font-bold font-mono mt-1 text-slate-800">
              Spill it here. 100% untraced.
            </p>
          </div>

          <div className="mt-2 pt-2 border-t-2 border-black flex items-center justify-between">
            <div className="text-[9px] font-mono font-bold leading-tight">
              KMCLU CONFESSION WALL
              <br />
              LUCKNOW CAMPUS
            </div>
            <div className="text-xl font-black">🤫</div>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          POSTER 3: MID-LEFT — "MISSING / LOST WORDS" WITH TEAR TABS
          ========================================================= */}
      <motion.div
        initial={{ opacity: 0, rotate: -4 }}
        animate={{ opacity: 1, rotate: -4 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-[480px] -left-6 sm:left-6 md:left-10 z-0 w-48 sm:w-56 p-4 bg-[#ffffff] text-black border-2 border-black shadow-[5px_6px_0px_rgba(0,0,0,0.85)]"
      >
        {/* Top Pushpin */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-600 border border-white shadow-[1px_2px_4px_rgba(0,0,0,0.5)]">
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-white rounded-full" />
        </div>

        <div className="text-center border-b-2 border-black pb-2 mb-2">
          <span className="text-[10px] font-mono font-black tracking-widest uppercase bg-black text-white px-2 py-0.5 inline-block mb-1">
            WANTED: HONESTY
          </span>
          <h5 className="text-base sm:text-lg font-black uppercase leading-tight">
            LOST CRUSH CONFESSION
          </h5>
          <p className="text-[10px] font-mono text-slate-600 mt-0.5">
            Last seen: Library 2nd Floor
          </p>
        </div>

        <p className="text-[10px] font-mono leading-tight text-slate-800 text-center mb-3">
          If you are holding back feelings, post them to the wall before semester ends.
        </p>

        {/* Tear-off Tabs at the bottom */}
        <div className="grid grid-cols-4 border-t-2 border-dashed border-black pt-1.5 text-center text-[8px] font-mono font-bold">
          <span className="border-r border-dashed border-black pr-1">TELL HER</span>
          <span className="border-r border-dashed border-black pr-1">TELL HIM</span>
          <span className="border-r border-dashed border-black pr-1">CONFESS</span>
          <span>NO CAP</span>
        </div>
      </motion.div>

      {/* =========================================================
          POSTER 4: MID-RIGHT — PSYCHEDELIC OVERTHINKERS CLUB
          ========================================================= */}
      <motion.div
        initial={{ opacity: 0, rotate: 6 }}
        animate={{ opacity: 1, rotate: 6 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="absolute top-[520px] -right-6 sm:right-6 md:right-12 z-0 w-48 sm:w-56 p-4 bg-[#c084fc] text-slate-950 border-2 border-black shadow-[6px_8px_0px_rgba(0,0,0,0.85)]"
      >
        {/* Top Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-6 tape-strip -rotate-3" />

        <div className="border border-black p-2 bg-[#d8b4fe]">
          <div className="text-[9px] font-mono font-black uppercase tracking-widest text-center border-b border-black pb-1 mb-1.5">
            KMCLU MENTAL DETOX
          </div>

          <h5 className="text-lg sm:text-xl font-black uppercase text-center leading-tight tracking-tight">
            OVERTHINKERS ANONYMOUS
          </h5>

          <div className="my-2 text-center text-2xl">
            🧠 ⚡ ☕
          </div>

          <p className="text-[10px] font-mono font-bold text-center leading-tight">
            &ldquo;Proxy lagane wale ko jannat milegi.&rdquo;
          </p>

          <div className="mt-2 text-center text-[9px] font-mono bg-black text-[#c084fc] font-black py-0.5 uppercase">
            MEETINGS: 24/7 ON THIS WALL
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          POSTER 5: BOTTOM-LEFT — RETRO CHAI SAMOSA SOCIETY
          ========================================================= */}
      <motion.div
        initial={{ opacity: 0, rotate: 5 }}
        animate={{ opacity: 1, rotate: 5 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="absolute bottom-24 -left-4 sm:left-8 z-0 w-44 sm:w-52 p-3 bg-[#fed7aa] text-black border-2 border-black shadow-[5px_6px_0px_rgba(0,0,0,0.85)]"
      >
        {/* Pin */}
        <div className="absolute -top-2.5 left-4 w-3.5 h-3.5 rounded-full bg-cyan-500 border border-white shadow-sm" />

        <div className="text-center">
          <span className="text-2xl block mb-1">☕ 🥟</span>
          <h6 className="text-sm sm:text-base font-black uppercase tracking-tight leading-none">
            CHAI OVER FEELINGS
          </h6>
          <p className="text-[10px] font-mono font-bold text-slate-800 mt-1">
            CANTEEN VIBES ONLY
          </p>
          <div className="mt-2 text-[8px] font-mono border-t border-black pt-1 flex justify-between font-extrabold">
            <span>OFFICIAL STAMP</span>
            <span>100% UNFILTERED</span>
          </div>
        </div>
      </motion.div>

      {/* =========================================================
          POSTER 6: BOTTOM-RIGHT — STREET ART STAMP
          ========================================================= */}
      <motion.div
        initial={{ opacity: 0, rotate: -7 }}
        animate={{ opacity: 1, rotate: -7 }}
        transition={{ duration: 0.6, delay: 0.45 }}
        className="absolute bottom-24 -right-4 sm:right-10 z-0 w-44 sm:w-52 p-3.5 bg-[#bef264] text-black border-2 border-black shadow-[5px_6px_0px_rgba(0,0,0,0.85)]"
      >
        {/* Top Tape */}
        <div className="absolute -top-3 right-4 w-14 h-5 tape-strip rotate-6" />

        <div className="text-center border border-black p-2">
          <span className="text-xs font-mono font-black uppercase bg-black text-[#bef264] px-1.5 py-0.5 inline-block mb-1">
            DECREE 2026
          </span>
          <h6 className="text-base font-black uppercase tracking-tight leading-tight">
            WHAT HAPPENS AT KMCLU STAYS HERE
          </h6>
          <p className="text-[9px] font-mono font-bold mt-1 text-slate-800">
            ZERO LOGS • ZERO TRACES
          </p>
        </div>
      </motion.div>
    </div>
  );
}
