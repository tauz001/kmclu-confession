"use client";

import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { siteConfig } from "@/config/site";

export default function FloatingSocialLogos() {
  const [isMounted, setIsMounted] = useState(false);

  // Normalized mouse coordinates (-1 to 1) for subtle movement
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Gentle, subtle spring physics (no dizzying floating or 3D bobbing)
  const springConfig = { damping: 25, stiffness: 140, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Very subtle offset (max ±6px) to give a responsive, tactile feel without floatiness
  const subtleX = useTransform(smoothX, [-1, 1], [-6, 6]);
  const subtleY = useTransform(smoothY, [-1, 1], [-5, 5]);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth === 0 || innerHeight === 0) return;
      mouseX.set((e.clientX / innerWidth - 0.5) * 2);
      mouseY.set((e.clientY / innerHeight - 0.5) * 2);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!isMounted) return null;

  return (
    <div
      className="fixed bottom-4 sm:bottom-5 right-3.5 sm:right-5 z-40 pointer-events-none select-none"
      aria-hidden="false"
    >
      <motion.div
        style={{ x: subtleX, y: subtleY }}
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="pointer-events-auto flex items-center gap-2 sm:gap-2.5"
      >
        {/* Instagram Neo-Brutalist Button */}
        <motion.a
          href={siteConfig.socials.instagram}
          target="_blank"
          rel="noopener noreferrer"
          title="Visit KMCLU Confessions on Instagram"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="btn-funky-pink px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase flex items-center gap-1.5 shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-shadow cursor-pointer"
        >
          <span className="text-sm">📸</span>
          <span className="font-mono">Insta</span>
          <span className="text-[10px] opacity-70">↗</span>
        </motion.a>

        {/* Discord Neo-Brutalist Button */}
        <motion.a
          href={siteConfig.socials.discord}
          target="_blank"
          rel="noopener noreferrer"
          title="Join KMCLU Discord Community"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="btn-funky-cyan px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black uppercase flex items-center gap-1.5 shadow-[3px_3px_0px_#000] hover:shadow-[5px_5px_0px_#000] transition-shadow cursor-pointer"
        >
          <span className="text-sm">💬</span>
          <span className="font-mono">Discord</span>
          <span className="text-[10px] opacity-70">↗</span>
        </motion.a>
      </motion.div>
    </div>
  );
}
