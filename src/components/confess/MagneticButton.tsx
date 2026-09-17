"use client";

import React, { useRef, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export default function MagneticButton({
  children,
  onClick,
  disabled = false,
  loading = false,
  className = "",
}: MagneticButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Magnetic coordinates
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 180, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading || !btnRef.current) return;
    const { clientX, clientY } = e;
    const { height, width, left, top } = btnRef.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    // Magnetic pull distance
    x.set(middleX * 0.35);
    y.set(middleY * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.button
      ref={btnRef}
      style={{ x: springX, y: springY, willChange: "transform" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={disabled || loading ? {} : { scale: 1.04 }}
      whileTap={disabled || loading ? {} : { scale: 0.96 }}
      className={`btn-confess-main w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg select-none disabled:opacity-50 disabled:cursor-not-allowed flex-wrap ${className}`}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
          <span>Floating into the void...</span>
        </div>
      ) : (
        children
      )}
    </motion.button>
  );
}
