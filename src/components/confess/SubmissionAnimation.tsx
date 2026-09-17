"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

interface SubmissionAnimationProps {
  onReset: () => void;
  message?: string;
}

export default function SubmissionAnimation({
  onReset,
  message = "Your confession was quietly released into the void.",
}: SubmissionAnimationProps) {
  // Generate random flying paper scraps/particles
  const flyingParticles = useMemo(() => {
    const colors = ["#fff9c4", "#fce7f3", "#dcfce7", "#ede9fe", "#ffedd5", "#e0f2fe", "#f59e0b"];
    return Array.from({ length: 32 }).map((_, i) => {
      const angle = (i / 32) * Math.PI * 2;
      const distance = 250 + Math.random() * 400;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        rotation: (Math.random() - 0.5) * 720,
        scale: 0.4 + Math.random() * 0.8,
        color: colors[i % colors.length],
        duration: 1.2 + Math.random() * 0.8,
        delay: Math.random() * 0.2,
      };
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl overflow-hidden">
      {/* Expanding Ambient Light Halo */}
      <motion.div
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: [0, 2.5, 4], opacity: [0.8, 0.4, 0] }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="absolute w-96 h-96 rounded-full bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-500 blur-3xl pointer-events-none"
      />

      {/* Flying Sticky Note Particle Explosion */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {flyingParticles.map((p) => (
          <motion.div
            key={p.id}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0, opacity: 1 }}
            animate={{
              x: p.x,
              y: p.y,
              scale: [0, p.scale, 0],
              rotate: p.rotation,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="absolute w-12 h-12 rounded-sm shadow-xl flex items-center justify-center text-[10px] select-none"
            style={{ backgroundColor: p.color }}
          >
            <span className="opacity-40">🤫</span>
          </motion.div>
        ))}
      </div>

      {/* Confirmation State Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6, type: "spring", damping: 20 }}
        className="relative z-10 max-w-md w-full p-8 rounded-3xl bg-slate-900/90 border border-white/10 shadow-2xl text-center backdrop-blur-2xl"
      >
        {/* Glow Orb behind icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center shadow-lg shadow-amber-500/30 text-3xl">
          ✨
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Say It. Leave It. Let It Float.
        </h2>

        <p className="mt-3 text-sm text-slate-300 leading-relaxed">
          {message}
        </p>

        <div className="mt-4 p-3.5 rounded-2xl bg-white/5 border border-white/5 text-xs text-slate-400 text-left flex items-start gap-2.5">
          <span className="text-emerald-400 text-base">🛡️</span>
          <span>
            Automated sanity check in progress. Approved whispers float onto the wall automatically within minutes.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
          <Link href="/" className="w-full sm:w-auto">
            <button className="btn-funky-lime w-full px-7 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider">
              Go To Wall ↗
            </button>
          </Link>

          <button
            onClick={onReset}
            className="btn-funky-pink w-full sm:w-auto px-6 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider"
          >
            Write Another Secret ✍️
          </button>
        </div>
      </motion.div>
    </div>
  );
}
