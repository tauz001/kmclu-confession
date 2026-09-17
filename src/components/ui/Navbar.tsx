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
          className="group flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-amber-400/50 rounded-lg p-1"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
            <span className="text-base select-none">🤫</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight bg-gradient-to-r from-amber-200 via-rose-200 to-indigo-200 bg-clip-text text-transparent group-hover:from-amber-100 group-hover:to-white transition-colors">
              KMCLU Confessions
            </span>
            <span className="text-[10px] text-slate-400 -mt-1 font-medium tracking-wide flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              anonymous & uncensored
            </span>
          </div>
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            title="Follow us on Instagram"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-400 hover:text-pink-300 px-2 py-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            <span>📸</span>
            <span className="text-[11px] font-medium">Insta</span>
          </a>

          <Link
            href="/admin"
            className="text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-md hover:bg-white/5 transition-colors"
          >
            Mod Portal
          </Link>

          {!isConfessPage && (
            <Link href="/confess">
              <button className="btn-confess-main px-4 py-2 text-xs sm:text-sm">
                <span>Stick Confession</span>
                <span className="text-base">✍️</span>
              </button>
            </Link>
          )}

          {isConfessPage && (
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors"
            >
              <span>← Back to Wall</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
