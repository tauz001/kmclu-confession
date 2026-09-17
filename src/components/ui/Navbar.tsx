"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { siteConfig } from "@/config/site";

export default function Navbar() {
  const pathname = usePathname();
  const isConfessPage = pathname === "/confess";

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-slate-950/40 border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link
          href="/"
          className="group flex items-center gap-2 sm:gap-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded-lg p-1 min-w-0"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 flex-shrink-0">
            <span className="text-sm sm:text-base select-none">🤫</span>
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-bold text-sm sm:text-base tracking-tight bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:to-white transition-colors truncate">
              KMCLU Confessions
            </span>
            <span className="text-[9px] sm:text-[10px] text-slate-400 -mt-0.5 sm:-mt-1 font-medium tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block flex-shrink-0" />
              <span className="truncate">anonymous & uncensored</span>
            </span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram"
            className="hidden md:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-pink-300 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            <span>📸</span>
            <span className="text-[11px] font-medium">Insta</span>
          </a>

          <Link
            href="/admin"
            className="text-[11px] sm:text-xs text-slate-400 hover:text-slate-200 px-2 sm:px-2.5 py-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            <span className="hidden sm:inline">Mod Portal</span>
            <span className="sm:hidden">Mod</span>
          </Link>

          {!isConfessPage && (
            <Link href="/confess">
              <button className="btn-confess-main px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm">
                <span className="hidden sm:inline">Stick Confession</span>
                <span className="sm:hidden font-bold">Confess</span>
                <span className="text-sm sm:text-base">✍️</span>
              </button>
            </Link>
          )}

          {isConfessPage && (
            <Link
              href="/"
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
            >
              <span>← <span className="hidden sm:inline">Back to Wall</span><span className="sm:hidden">Wall</span></span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
