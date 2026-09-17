"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function FloatingSocialLogos() {
  const [isMounted, setIsMounted] = useState(false);

  // Raw mouse coordinates normalized (-1 to 1)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth, jitter-free spring physics for rigid 3D movement
  const springConfig = { damping: 26, stiffness: 110, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D Parallax Transformations for Instagram (Right-Center Side)
  const instaX = useTransform(smoothX, [-1, 1], [-20, 20]);
  const instaY = useTransform(smoothY, [-1, 1], [-18, 18]);
  const instaRotateX = useTransform(smoothY, [-1, 1], [16, -16]);
  const instaRotateY = useTransform(smoothX, [-1, 1], [-20, 20]);
  const instaRotateZ = useTransform(smoothX, [-1, 1], [-5, 5]);

  // 3D Parallax Transformations for Discord (Left-Center Side)
  const discordX = useTransform(smoothX, [-1, 1], [20, -20]);
  const discordY = useTransform(smoothY, [-1, 1], [18, -18]);
  const discordRotateX = useTransform(smoothY, [-1, 1], [-16, 16]);
  const discordRotateY = useTransform(smoothX, [-1, 1], [20, -20]);
  const discordRotateZ = useTransform(smoothX, [-1, 1], [5, -5]);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth === 0 || innerHeight === 0) return;
      const normX = (e.clientX / innerWidth - 0.5) * 2;
      const normY = (e.clientY / innerHeight - 0.5) * 2;
      mouseX.set(normX);
      mouseY.set(normY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-30 overflow-hidden select-none"
      style={{ perspective: 1200 }}
      aria-hidden="false"
    >
      {/* Centered constraining wrapper: keeps logos in the center flanks rather than far monitor edges */}
      <div className="max-w-6xl mx-auto h-full w-full relative px-4 sm:px-6">
        {/* =========================================================
            1. HARD 3D DISCORD BLOCK (LEFT-CENTER FLANK)
            ========================================================= */}
        <motion.div
          style={{
            x: discordX,
            y: discordY,
            rotateX: discordRotateX,
            rotateY: discordRotateY,
            rotateZ: discordRotateZ,
            willChange: "transform",
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="absolute top-24 sm:top-32 left-2 sm:left-6 md:left-10 pointer-events-auto"
        >
          {/* Ambient rigid float bobbing */}
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [-1.5, 1.5, -1.5],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <a
              href={siteConfig.socials.discord}
              target="_blank"
              rel="noopener noreferrer"
              title="Join KMCLU Discord Community"
              className="group block relative focus:outline-none cursor-pointer"
            >
              {/* Hard 3D Tile Container */}
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:-translate-y-2.5 group-active:translate-y-1"
                style={{
                  backgroundColor: "#5865F2",
                  border: "3px solid #000000",
                  // Hard, rigid 3D extruded ledge & drop shadow
                  boxShadow:
                    "0 10px 0px #1e235e, 0 13px 0px #000000, 6px 18px 24px rgba(0, 0, 0, 0.75)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Sharp acrylic diagonal glint highlight */}
                <div className="absolute inset-x-1.5 top-1.5 h-7 bg-gradient-to-b from-white/40 via-white/10 to-transparent rounded-t-xl pointer-events-none" />

                {/* Hard Bevel Inner Border */}
                <div className="absolute inset-1 rounded-xl border border-white/20 pointer-events-none" />

                {/* 3D Discord Clyde Icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-11 h-11 sm:w-13 sm:h-13 text-white drop-shadow-[0_3px_0px_#1e235e] transition-transform duration-200 group-hover:scale-105"
                  fill="currentColor"
                >
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>

                {/* Hard Notification Dot */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#bef264] text-black border-2 border-black rounded-full flex items-center justify-center text-[10px] font-black shadow-[2px_2px_0px_#000]">
                  ●
                </div>
              </div>

              {/* Hard Neo-Brutalist Tag */}
              <div className="mt-2 text-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider bg-[#38bdf8] text-black px-2.5 py-0.5 rounded-md border-2 border-black shadow-[3px_3px_0px_#000] group-hover:bg-[#7dd3fc] group-hover:shadow-[4px_4px_0px_#000] transition-all whitespace-nowrap">
                  <span>💬</span>
                  <span>DISCORD ↗</span>
                </span>
              </div>
            </a>
          </motion.div>
        </motion.div>

        {/* =========================================================
            2. HARD 3D INSTAGRAM BLOCK (RIGHT-CENTER FLANK)
            ========================================================= */}
        <motion.div
          style={{
            x: instaX,
            y: instaY,
            rotateX: instaRotateX,
            rotateY: instaRotateY,
            rotateZ: instaRotateZ,
            willChange: "transform",
            backfaceVisibility: "hidden",
            transformStyle: "preserve-3d",
          }}
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute top-24 sm:top-32 right-2 sm:right-6 md:right-10 pointer-events-auto"
        >
          {/* Ambient rigid float bobbing */}
          <motion.div
            animate={{
              y: [0, 12, 0],
              rotate: [1.5, -1.5, 1.5],
            }}
            transition={{
              duration: 4.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
              title="Visit KMCLU Confessions on Instagram"
              className="group block relative focus:outline-none cursor-pointer"
            >
              {/* Hard 3D Tile Container */}
              <div
                className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center transition-all duration-200 group-hover:-translate-y-2.5 group-active:translate-y-1"
                style={{
                  background:
                    "linear-gradient(135deg, #fdf497 0%, #fd5949 28%, #d6249f 65%, #285AEB 100%)",
                  border: "3px solid #000000",
                  // Hard, rigid 3D extruded ledge & drop shadow
                  boxShadow:
                    "0 10px 0px #8b1352, 0 13px 0px #000000, 6px 18px 24px rgba(0, 0, 0, 0.75)",
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Sharp acrylic diagonal glint highlight */}
                <div className="absolute inset-x-1.5 top-1.5 h-7 bg-gradient-to-b from-white/45 via-white/15 to-transparent rounded-t-xl pointer-events-none" />

                {/* Hard Bevel Inner Border */}
                <div className="absolute inset-1 rounded-xl border border-white/25 pointer-events-none" />

                {/* 3D Instagram Camera Icon */}
                <svg
                  viewBox="0 0 24 24"
                  className="w-10 h-10 sm:w-12 sm:h-12 text-white drop-shadow-[0_3px_0px_rgba(0,0,0,0.6)] transition-transform duration-200 group-hover:scale-105"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" strokeWidth="2.8" />
                </svg>

                {/* Hard Camera Flash / Sparkle Badge */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#fb7185] text-white border-2 border-black rounded-full flex items-center justify-center text-[10px] font-black shadow-[2px_2px_0px_#000]">
                  ★
                </div>
              </div>

              {/* Hard Neo-Brutalist Tag */}
              <div className="mt-2 text-center">
                <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono font-black uppercase tracking-wider bg-[#bef264] text-black px-2.5 py-0.5 rounded-md border-2 border-black shadow-[3px_3px_0px_#000] group-hover:bg-[#d9f99d] group-hover:shadow-[4px_4px_0px_#000] transition-all whitespace-nowrap">
                  <span>📸</span>
                  <span>INSTA ↗</span>
                </span>
              </div>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
