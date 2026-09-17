"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import StickyNote, { ConfessionItem } from "./StickyNote";
import StickyModal from "./StickyModal";
import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";

// High-quality initial confessions so the wall immediately feels alive even on fresh deploy
const CURATED_INITIAL_CONFESSIONS: ConfessionItem[] = [
  {
    _id: "init-1",
    confession: "To the person in the library 3rd floor reading Dostoevsky every Tuesday: your quiet laugh whenever you flip pages is the only reason I study there.",
    stickyColor: "#fff9c4",
    rotation: -2.1,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    _id: "init-2",
    confession: "I submitted the entire group assignment alone at 3:45 AM and still put everyone's name on it. If you're reading this, you owe me chai for a lifetime.",
    stickyColor: "#fce7f3",
    rotation: 1.8,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    _id: "init-3",
    confession: "Professor thought I was furiously taking notes during today's lecture. I was actually calculating how many days are left until semester break.",
    stickyColor: "#dcfce7",
    rotation: -1.2,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    _id: "init-4",
    confession: "I pretend to be an extreme introvert at KMCLU so people don't ask me for assignment answers, but secretly I want to join the music club.",
    stickyColor: "#ede9fe",
    rotation: 2.5,
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    _id: "init-5",
    confession: "The campus maggi hits differently at 5 PM when you're questioning all your life choices and career aspirations.",
    stickyColor: "#ffedd5",
    rotation: -2.8,
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    _id: "init-6",
    confession: "I still remember the smile you gave me near the admin block fountain back in freshman orientation. 3 years later and I still look for you in the hallways.",
    stickyColor: "#e0f2fe",
    rotation: 1.4,
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    _id: "init-7",
    confession: "Whoever plays acoustic guitar near the hostel garden around sunset: never stop. It's keeping half our department sane.",
    stickyColor: "#fff9c4",
    rotation: -1.5,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    _id: "init-8",
    confession: "I accidentally waved back at someone who was waving at the person behind me. It's been 2 weeks and I still take the alternate stairs to avoid them.",
    stickyColor: "#fce7f3",
    rotation: 2.9,
    createdAt: new Date(Date.now() - 3600000 * 60).toISOString(),
  },
];

export default function ConfessionWall() {
  const [confessions, setConfessions] = useState<ConfessionItem[]>(CURATED_INITIAL_CONFESSIONS);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedNote, setSelectedNote] = useState<ConfessionItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "short" | "deep">("all");

  // Fetch approved confessions from the API
  const fetchConfessions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/confessions?limit=24");
      if (res.ok) {
        const data = await res.json();
        if (data.confessions && data.confessions.length > 0) {
          setConfessions(data.confessions);
          setNextCursor(data.nextCursor);
          setHasMore(data.hasMore);
        }
      }
    } catch (err) {
      console.warn("Using curated confessions (database empty or connecting):", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConfessions();
  }, [fetchConfessions]);

  // Open note modal automatically if shared URL ?note=<id> is present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const noteId = params.get("note");
      if (noteId && confessions.length > 0) {
        const found = confessions.find((c) => c._id === noteId);
        if (found) {
          setSelectedNote(found);
        }
      }
    }
  }, [confessions]);

  // Load more pagination
  const handleLoadMore = async () => {
    if (!nextCursor || loadingMore) return;
    try {
      setLoadingMore(true);
      const res = await fetch(`/api/confessions?limit=18&cursor=${encodeURIComponent(nextCursor)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.confessions && data.confessions.length > 0) {
          setConfessions((prev) => [...prev, ...data.confessions]);
          setNextCursor(data.nextCursor);
          setHasMore(data.hasMore);
        } else {
          setHasMore(false);
        }
      }
    } catch (err) {
      console.error("Failed to load more confessions:", err);
    } finally {
      setLoadingMore(false);
    }
  };

  // Filtered list
  const filteredConfessions = useMemo(() => {
    return confessions.filter((item) => {
      const matchesSearch = item.confession
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      if (activeFilter === "short") return item.confession.length < 130;
      if (activeFilter === "deep") return item.confession.length >= 130;
      return true;
    });
  }, [confessions, searchQuery, activeFilter]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 md:py-12">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        {/* Funky Animated Sticker Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full funky-sticker-badge text-pink-200 text-[10px] sm:text-xs font-bold mb-3 sm:mb-4 -rotate-1 shadow-md shadow-pink-500/10 flex-wrap justify-center"
        >
          <span className="text-xs sm:text-sm">✨</span>
          <span>KMCLU UNFILTERED WHISPERS</span>
          <span className="text-pink-400/60 hidden xs:inline">•</span>
          <span className="text-amber-200/90 font-mono text-[10px] sm:text-[11px] whitespace-nowrap">100% No Identity</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight px-1"
        >
          <span className="block text-purple-100">Say It. Leave It.</span>
          <span className="block bg-gradient-to-r from-amber-300 via-pink-400 to-purple-400 bg-clip-text text-transparent">
            Let It Float.
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base text-purple-200/70 max-w-xl mx-auto leading-relaxed px-2"
        >
          An eccentric digital corkboard of secrets, crushes, regrets, and midnight campus gossip. Click any note to peek inside and stamp reactions.
        </motion.p>

        {/* Confess CTA button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 sm:mt-7 flex items-center justify-center gap-4 px-2"
        >
          <Link href="/confess" className="w-full sm:w-auto flex justify-center">
            <button className="btn-confess-main w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-4 text-sm sm:text-base md:text-lg flex-wrap">
              <span className="text-xl sm:text-2xl">✍️</span>
              <span>Stick Your Confession</span>
              <span className="text-[10px] sm:text-xs bg-black text-[#bef264] px-1.5 sm:px-2 py-0.5 rounded-sm font-mono font-bold whitespace-nowrap">
                100% ANONYMOUS
              </span>
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mb-6 sm:mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 bg-[#1f1b29] p-3 sm:p-3.5 rounded-2xl border-2 border-black shadow-[4px_4px_0px_#000]">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search whispers..."
            className="w-full pl-9 pr-8 py-2 sm:py-2.5 text-xs sm:text-sm bg-[#120e1a] border-2 border-black rounded-xl text-amber-50 placeholder-slate-500 focus:outline-none focus:border-[#bef264] focus:ring-1 focus:ring-[#bef264] transition-all font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute inset-y-0 right-3 flex items-center text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Tabs with Distinct Funky Button Colors */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar touch-scroll pb-1 md:pb-0">
          {(
            [
              { key: "all", label: "All Whispers", color: "btn-funky-lime" },
              { key: "short", label: "Short Whispers ⚡", color: "btn-funky-pink" },
              { key: "deep", label: "Deep Thoughts 💭", color: "btn-funky-cyan" },
            ] as const
          ).map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs font-black whitespace-nowrap uppercase tracking-wider transition-all cursor-pointer flex-shrink-0 ${
                  isActive
                    ? `${tab.color} scale-105`
                    : "bg-[#14101d] text-slate-300 border-2 border-black/60 hover:border-black hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confession Wall Grid */}
      {filteredConfessions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-7 items-start">
          {filteredConfessions.map((item, idx) => (
            <StickyNote
              key={item._id || idx}
              item={item}
              index={idx}
              onOpenModal={(confession) => setSelectedNote(confession)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 px-4 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
          <span className="text-4xl block mb-3">🍂</span>
          <h3 className="text-lg font-bold text-slate-200">No whispers found</h3>
          <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
            {searchQuery
              ? `No confessions matching "${searchQuery}". Try different keywords.`
              : "Be the very first soul to pin a confession on the KMCLU wall!"}
          </p>
          <Link href="/confess">
            <button className="btn-confess-main mt-5 px-6 py-2.5 text-xs">
              <span>Stick Confession</span>
              <span className="text-sm">✍️</span>
            </button>
          </Link>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && (
        <div className="mt-12 text-center">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="btn-funky-cyan px-7 py-3 rounded-xl text-xs sm:text-sm font-black uppercase tracking-wider disabled:opacity-50"
          >
            {loadingMore ? "Uncovering more whispers..." : "Load More Sticky Notes ↓"}
          </button>
        </div>
      )}

      {/* Sticky Note Detail Modal */}
      <StickyModal
        item={selectedNote}
        onClose={() => setSelectedNote(null)}
      />

      {/* Footer Branding & Social Links */}
      <footer className="mt-20 pt-10 pb-8 border-t border-white/10 text-center text-xs text-slate-400 space-y-4">
        {/* Social Media Links Bar */}
        <div className="flex items-center justify-center gap-2.5 flex-wrap">
          <a
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 hover:border-pink-400/50 text-slate-300 hover:text-pink-300 transition-all text-[11px] font-semibold"
          >
            <span>📸</span>
            <span>Instagram</span>
          </a>

          <a
            href={siteConfig.socials.discord}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 hover:border-indigo-400/50 text-slate-300 hover:text-indigo-300 transition-all text-[11px] font-semibold"
          >
            <span>💬</span>
            <span>Discord Community</span>
          </a>

          <a
            href={siteConfig.socials.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 hover:border-emerald-400/50 text-slate-300 hover:text-emerald-300 transition-all text-[11px] font-semibold"
          >
            <span>💬</span>
            <span>WhatsApp Community</span>
          </a>

          <a
            href={siteConfig.socials.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 hover:border-cyan-400/50 text-slate-300 hover:text-cyan-300 transition-all text-[11px] font-semibold"
          >
            <span>✈️</span>
            <span>Telegram Channel</span>
          </a>

          <a
            href={siteConfig.socials.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-white/10 hover:border-slate-400 text-slate-300 hover:text-white transition-all text-[11px] font-semibold"
          >
            <span>✖️</span>
            <span>Twitter / X</span>
          </a>
        </div>

        {/* Sponsor & Student Community */}
        <div className="space-y-1.5 pt-2">
          <p className="font-medium tracking-wide text-slate-400">
            Powered by{" "}
            <a
              href={siteConfig.sponsor.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold underline decoration-amber-400/40 hover:decoration-amber-300 transition-colors"
            >
              <span>🪡 {siteConfig.sponsor.name}</span>
              <span className="text-[10px] bg-amber-400/15 text-amber-300 px-1.5 py-0.5 rounded border border-amber-400/30 no-underline">
                Official Sponsor
              </span>
            </a>
          </p>
          <p className="text-[11px] text-slate-500">
            Developed With ❤️ By{" "}
            <a
              href={siteConfig.community.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-300 hover:text-white font-medium transition-colors"
            >
              {siteConfig.community.label}
            </a>
            {" • "}
            <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors">
              Mod Portal
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
