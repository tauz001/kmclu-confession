"use client";

import React, { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import Link from "next/link";

interface Metadata {
  ip?: string;
  userAgent?: string;
  language?: string;
  platform?: string;
  browser?: string;
  deviceType?: string;
}

interface ConfessionRecord {
  _id: string;
  confession: string;
  imageUrl?: string;
  status: "pending" | "approved" | "rejected";
  stickyColor?: string;
  rotation?: number;
  moderationReason?: string | null;
  createdAt: string;
  metadata?: Metadata;
}

interface Stats {
  pending: number;
  approved: number;
  rejected: number;
  total: number;
}

export default function AdminDashboardClient({ adminEmail }: { adminEmail: string }) {
  const [confessions, setConfessions] = useState<ConfessionRecord[]>([]);
  const [stats, setStats] = useState<Stats>({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const [statusFilter, setStatusFilter] = useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedMetaId, setExpandedMetaId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ConfessionRecord | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  const fetchAdminConfessions = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: statusFilter,
        limit: "50",
      });
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/admin/confessions?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setConfessions(data.confessions || []);
        if (data.stats) setStats(data.stats);
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to load confessions", "error");
      }
    } catch (err) {
      console.error("Error fetching admin confessions:", err);
      showToast("Network error fetching confessions", "error");
    } finally {
      setLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    fetchAdminConfessions();
  }, [fetchAdminConfessions]);

  const handleUpdateStatus = async (id: string, newStatus: "approved" | "rejected") => {
    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/confessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Optimistically update list & stats
        setConfessions((prev) =>
          prev.map((c) => (c._id === id ? { ...c, status: newStatus } : c))
        );
        showToast(`Confession marked as ${newStatus}!`, "success");
        // Refresh counts
        fetchAdminConfessions();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to update confession", "error");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      showToast("Network error updating status", "error");
    } finally {
      setActionLoading(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const id = deleteTarget._id;
    const targetStatus = deleteTarget.status;
    try {
      setActionLoading(id);
      const res = await fetch(`/api/admin/confessions/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setConfessions((prev) => prev.filter((c) => c._id !== id));
        setStats((prev) => ({
          ...prev,
          [targetStatus]: Math.max(0, prev[targetStatus] - 1),
          total: Math.max(0, prev.total - 1),
        }));
        showToast("Confession permanently deleted.", "success");
        setDeleteTarget(null);
        fetchAdminConfessions();
      } else {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || "Failed to delete confession", "error");
      }
    } catch (err) {
      console.error("Error deleting confession:", err);
      showToast("Network error deleting confession", "error");
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top bar */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🛡️</span>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                KMCLU Moderation Dashboard
              </h1>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Logged in as <span className="text-amber-300 font-mono">{adminEmail}</span>
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            >
              View Public Wall ↗
            </Link>

            <button
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </header>

        {/* KPI Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-500/10 border border-amber-500/20">
            <div className="text-[10px] sm:text-xs font-semibold text-amber-400 uppercase tracking-wider truncate">
              Pending Review
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
              {stats.pending}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
            <div className="text-[10px] sm:text-xs font-semibold text-emerald-400 uppercase tracking-wider truncate">
              Approved
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
              {stats.approved}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-rose-500/10 border border-rose-500/20">
            <div className="text-[10px] sm:text-xs font-semibold text-rose-400 uppercase tracking-wider truncate">
              Rejected
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
              {stats.rejected}
            </div>
          </div>

          <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-800/50 border border-white/10">
            <div className="text-[10px] sm:text-xs font-semibold text-slate-400 uppercase tracking-wider truncate">
              Total
            </div>
            <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white mt-1">
              {stats.total}
            </div>
          </div>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-slate-900/60 border border-white/5">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar touch-scroll pb-1 sm:pb-0">
            {(
              [
                { key: "pending", label: "Pending Review" },
                { key: "approved", label: "Approved" },
                { key: "rejected", label: "Rejected" },
                { key: "all", label: "All Submissions" },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  statusFilter === tab.key
                    ? "bg-amber-400 text-slate-950 shadow-md font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in confessions..."
              className="w-full px-3.5 py-1.5 text-xs bg-slate-950 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1.5 text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Confession Records List */}
        {loading ? (
          <div className="text-center py-20 text-slate-400">
            <span className="inline-block w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mb-2" />
            <p className="text-xs">Loading submissions...</p>
          </div>
        ) : confessions.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">
            <span className="text-3xl block mb-2">🎉</span>
            <h3 className="text-base font-bold text-white">Queue is clear</h3>
            <p className="text-xs text-slate-400 mt-1">
              No confessions found in the &ldquo;{statusFilter}&rdquo; category.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {confessions.map((item) => {
              const isPending = item.status === "pending";
              const isApproved = item.status === "approved";
              const isRejected = item.status === "rejected";
              const isBusy = actionLoading === item._id;
              const hasMeta = !!item.metadata;
              const isMetaExpanded = expandedMetaId === item._id;

              return (
                <div
                  key={item._id}
                  className="p-5 rounded-2xl bg-slate-900/80 border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                >
                  {/* Left: Swatch & Text */}
                  <div className="flex items-start gap-4 flex-1">
                    {/* Sticky Color Swatch */}
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm border border-black/20 flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: item.stickyColor || "#fff9c4" }}
                      title={`Color: ${item.stickyColor}`}
                    />

                    <div className="space-y-2 flex-1">
                      {/* Confession text */}
                      <p className="text-sm sm:text-base text-slate-100 font-medium leading-relaxed whitespace-pre-wrap">
                        {item.confession}
                      </p>

                      {/* Photo Thumbnail if attached */}
                      {item.imageUrl && (
                        <div className="pt-1 pb-1">
                          <a
                            href={item.imageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block relative group"
                            title="Click to view full image in new tab"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={item.imageUrl}
                              alt="Attached Photo"
                              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-white/20 shadow-md group-hover:scale-105 transition-transform"
                            />
                            <span className="absolute bottom-1 right-1 bg-black/80 text-[9px] text-amber-300 px-1.5 py-0.5 rounded font-mono font-bold">
                              📸 Photo
                            </span>
                          </a>
                        </div>
                      )}

                      {/* Meta badges */}
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <span
                          className={`px-2 py-0.5 rounded-full font-semibold uppercase text-[10px] ${
                            isApproved
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : isRejected
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                          }`}
                        >
                          {item.status}
                        </span>

                        <span>•</span>
                        <span>
                          {new Date(item.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </span>

                        {item.moderationReason && (
                          <>
                            <span>•</span>
                            <span className="text-rose-400 font-mono">
                              Flag: {item.moderationReason}
                            </span>
                          </>
                        )}

                        {hasMeta && (
                          <button
                            onClick={() =>
                              setExpandedMetaId(isMetaExpanded ? null : item._id)
                            }
                            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 ml-1"
                          >
                            {isMetaExpanded ? "Hide Metadata ▲" : "View Metadata ▼"}
                          </button>
                        )}
                      </div>

                      {/* Expanded Technical Metadata (Admin Only) */}
                      {isMetaExpanded && item.metadata && (
                        <div className="mt-3 p-3 rounded-xl bg-slate-950/80 border border-indigo-500/20 text-xs font-mono grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                          <div>
                            <span className="text-slate-500">IP Address:</span>{" "}
                            <span className="text-amber-300">{item.metadata.ip || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Device Type:</span>{" "}
                            <span>{item.metadata.deviceType || "N/A"}</span>
                          </div>
                          <div>
                            <span className="text-slate-500">Browser / OS:</span>{" "}
                            <span>
                              {item.metadata.browser || "N/A"} / {item.metadata.platform || "N/A"}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-500">Language:</span>{" "}
                            <span>{item.metadata.language || "N/A"}</span>
                          </div>
                          <div className="col-span-full break-all">
                            <span className="text-slate-500">User-Agent:</span>{" "}
                            <span className="text-slate-400 text-[10px]">{item.metadata.userAgent || "N/A"}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center flex-wrap sm:flex-nowrap flex-shrink-0 pt-2 sm:pt-0">
                    {!isApproved && (
                      <button
                        onClick={() => handleUpdateStatus(item._id, "approved")}
                        disabled={isBusy}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        ✓ Approve
                      </button>
                    )}

                    {!isRejected && (
                      <button
                        onClick={() => handleUpdateStatus(item._id, "rejected")}
                        disabled={isBusy}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 transition-colors disabled:opacity-50 cursor-pointer"
                      >
                        ✕ Reject
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteTarget(item)}
                      disabled={isBusy}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-1 hover:scale-105 active:scale-95"
                      title="Permanently Delete"
                    >
                      <span>🗑️</span>
                      <span className="hidden sm:inline font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Custom In-App Delete Confirmation Modal */}
        {deleteTarget && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => !actionLoading && setDeleteTarget(null)}
          >
            <div 
              className="w-full max-w-md bg-slate-900 border-2 border-rose-500/30 rounded-2xl p-6 shadow-2xl space-y-5 text-slate-100"
              role="dialog"
              aria-modal="true"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-xl flex-shrink-0">
                  ⚠️
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Permanently Delete?</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    This confession will be permanently removed from MongoDB Atlas. This action cannot be undone.
                  </p>
                </div>
              </div>

              {/* Snippet preview */}
              <div 
                className="p-3.5 rounded-xl border border-black/15 text-slate-950 font-medium text-xs sm:text-sm leading-relaxed max-h-36 overflow-y-auto shadow-inner"
                style={{ backgroundColor: deleteTarget.stickyColor || "#FFF9C4" }}
              >
                &ldquo;{deleteTarget.confession}&rdquo;
                {deleteTarget.imageUrl && (
                  <div className="mt-2 text-[10px] font-mono text-slate-800 font-bold bg-black/10 px-2 py-0.5 rounded w-fit">
                    📸 Includes attached photo
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => !actionLoading && setDeleteTarget(null)}
                  disabled={!!actionLoading}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={!!actionLoading}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {actionLoading === deleteTarget._id ? (
                    <>
                      <span className="inline-block w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <span>🗑️ Permanently Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Global Toast Notification */}
        {toast && (
          <div className="fixed bottom-5 right-5 z-50 pointer-events-none animate-in slide-in-from-bottom-5 fade-in duration-200">
            <div
              className={`px-4 py-3 rounded-xl border shadow-2xl flex items-center gap-2.5 text-xs font-semibold backdrop-blur-md ${
                toast.type === "success"
                  ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-200 shadow-emerald-950/50"
                  : "bg-rose-950/90 border-rose-500/40 text-rose-200 shadow-rose-950/50"
              }`}
            >
              <span className="text-sm">{toast.type === "success" ? "✓" : "⚠️"}</span>
              <span>{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
