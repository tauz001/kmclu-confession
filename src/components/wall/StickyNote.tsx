"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export interface ConfessionItem {
  _id: string;
  confession: string;
  stickyColor?: string;
  rotation?: number;
  createdAt: string;
  imageUrl?: string;
}

interface StickyNoteProps {
  item: ConfessionItem;
  index: number;
  onOpenModal?: (item: ConfessionItem) => void;
}

// Fallback palette
const TASTEFUL_PALETTES = [
  { bg: "#fff9c4", text: "#422006", tape: "rgba(254, 240, 138, 0.45)", pin: "#ef4444" }, // Butter
  { bg: "#fce7f3", text: "#701a75", tape: "rgba(244, 114, 182, 0.35)", pin: "#d946ef" }, // Rose pink
  { bg: "#dcfce7", text: "#14532d", tape: "rgba(134, 239, 172, 0.4)", pin: "#10b981" }, // Mint green
  { bg: "#ede9fe", text: "#3b0764", tape: "rgba(196, 181, 253, 0.35)", pin: "#8b5cf6" }, // Soft Lavender
  { bg: "#ffedd5", text: "#7c2d12", tape: "rgba(253, 186, 116, 0.4)", pin: "#f97316" }, // Warm Peach
  { bg: "#e0f2fe", text: "#0c4a6e", tape: "rgba(186, 230, 253, 0.4)", pin: "#0ea5e9" }, // Sky
];

export default function StickyNote({ item, index, onOpenModal }: StickyNoteProps) {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Dynamic sizing based on length
  const length = item.confession.length;
  // Size classification: short (<120), medium (120-280), long (>280)
  const sizeClass =
    length < 120
      ? "min-h-[160px] md:min-h-[170px] text-lg md:text-xl"
      : length < 280
      ? "min-h-[200px] md:min-h-[220px] text-base md:text-lg"
      : "min-h-[240px] md:min-h-[270px] text-sm md:text-base";

  // Persistent rotation based on id or item rotation
  const baseRotation =
    item.rotation !== undefined
      ? item.rotation
      : ((index * 7) % 7) - 3.5;

  // Pin vs tape selector based on index
  const isPin = index % 3 === 0;

  // Determine color theme
  const colorIndex =
    Math.abs(
      item._id
        ? item._id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0)
        : index
    ) % TASTEFUL_PALETTES.length;
  const palette = TASTEFUL_PALETTES[colorIndex];
  const bgColor = item.stickyColor || palette.bg;

  // 3D Tilt calculation on hover
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 25 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 25 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  const formattedDate = new Date(item.createdAt || Date.now()).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: Math.min(index * 0.05, 0.8),
        ease: [0.23, 1, 0.32, 1],
      }}
      style={{
        rotate: isHovered ? 0 : `${baseRotation}deg`,
        rotateX: isHovered ? rotateX : 0,
        rotateY: isHovered ? rotateY : 0,
        transformStyle: "preserve-3d",
        backgroundColor: bgColor,
        color: palette.text,
        willChange: "transform",
        backfaceVisibility: "hidden",
      }}
      whileHover={{
        scale: 1.035,
        zIndex: 30,
        transition: { duration: 0.25, ease: [0.25, 1, 0.5, 1] },
      }}
      whileTap={{ scale: 0.98 }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => onOpenModal?.(item)}
      className={`group relative p-5 md:p-6 rounded-sm cursor-pointer select-none flex flex-col justify-between sticky-paper-shadow transition-shadow duration-300 ${sizeClass}`}
    >
      {/* Tape Strip or Push Pin at the top */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-20">
        {isPin ? (
          <div
            className="w-4 h-4 rounded-full push-pin border border-white/60 relative"
            style={{ backgroundColor: palette.pin }}
          >
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 rounded-full bg-white/80" />
          </div>
        ) : (
          <div
            className="w-16 h-6 tape-strip rounded-xs -rotate-2"
            style={{ backgroundColor: palette.tape }}
          />
        )}
      </div>

      {/* Subtle paper grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20 mix-blend-multiply rounded-sm"
        style={{
          backgroundImage: `radial-gradient(#000 0.75px, transparent 0.75px)`,
          backgroundSize: "8px 8px",
        }}
      />

      {/* Subtle Curled Bottom-Right Corner Highlight */}
      <div
        className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none transition-transform duration-300 group-hover:scale-125"
        style={{
          background:
            "linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.12) 50%, rgba(0,0,0,0.06) 100%)",
        }}
      />

      {/* Attached Photo (Polaroid / Film Snapshot Style) */}
      {item.imageUrl && (
        <div className="relative z-10 mb-2.5 self-center w-full max-w-[210px] bg-white p-1.5 pb-2 rounded-xs shadow-[0_3px_8px_rgba(0,0,0,0.25)] border border-black/15 -rotate-1 transition-transform group-hover:rotate-0">
          {/* Mini Tape on top edge of photo */}
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-3.5 tape-strip -rotate-2 pointer-events-none" />
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-xs bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.imageUrl}
              alt="Photo attached to confession"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      )}

      {/* Confession Text (Handwritten font with line-clamp protection) */}
      <div className="relative z-10 flex-1 pt-1">
        <p className="font-sticky text-left font-semibold leading-snug break-words whitespace-pre-wrap selection:bg-black/10">
          {item.confession}
        </p>
      </div>

      {/* Bottom info footer */}
      <div className="relative z-10 mt-4 pt-2 border-t border-black/10 flex items-center justify-between text-xs font-medium opacity-70 group-hover:opacity-100 transition-opacity">
        <span className="flex items-center gap-1 font-mono text-[11px]">
          <span>🕒</span>
          <span>{formattedDate}</span>
        </span>
        <span className="text-[11px] font-sans font-semibold tracking-wider uppercase opacity-80 group-hover:text-black">
          Read Note ↗
        </span>
      </div>
    </motion.div>
  );
}
