"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";
import SubmissionAnimation from "./SubmissionAnimation";
import CameraModal from "./CameraModal";
import Link from "next/link";
import { siteConfig } from "@/config/site";

const COLOR_OPTIONS = [
  { hex: "#fff9c4", label: "Butter", name: "Yellow" },
  { hex: "#fce7f3", label: "Rose", name: "Pink" },
  { hex: "#dcfce7", label: "Mint", name: "Green" },
  { hex: "#ede9fe", label: "Lavender", name: "Purple" },
  { hex: "#ffedd5", label: "Peach", name: "Orange" },
  { hex: "#e0f2fe", label: "Sky", name: "Blue" },
];

export default function ConfessForm() {
  const [confession, setConfession] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleCameraTrigger = () => {
    // On mobile devices, native front camera capture input works seamlessly on all browsers & HTTP/HTTPS
    const isMobile =
      typeof navigator !== "undefined" &&
      /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent);

    if (isMobile && cameraInputRef.current) {
      cameraInputRef.current.click();
    } else {
      setIsCameraOpen(true);
    }
  };

  const maxLength = 500;
  const currentLength = confession.length;
  const isOverLimit = currentLength > maxLength;
  const canSubmit = (currentLength > 0 || !!photo) && !isOverLimit && !isSubmitting;

  // Handle image upload from file picker with auto-compression
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxDim = 800; // Optimal for fast upload and crisp display
        let w = img.width;
        let h = img.height;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0, w, h);
          let dataUrl = canvas.toDataURL("image/webp", 0.78);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.78);
          }
          setPhoto(dataUrl);
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/confessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          confession: confession.trim() || (photo ? "Photo Whisper 📸" : ""),
          imageUrl: photo || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.details || data.error || "Failed to submit confession. Please try again.");
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(data.message || "Your confession has been submitted and is under review.");
      setIsSubmitted(true);
    } catch (err) {
      console.error("Submission error:", err);
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setConfession("");
    setPhoto(null);
    setIsSubmitted(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="w-full flex flex-col justify-between px-3.5 sm:px-6 py-3 sm:py-6 min-h-[92dvh] max-w-2xl mx-auto">
      {/* Top Bar: Nav link + Animated Heading */}
      <div className="flex-shrink-0 text-center">
        <div className="flex items-center justify-between mb-2">
          <Link
            href="/"
            className="btn-funky-cyan px-2.5 sm:px-3 py-1 text-xs font-black uppercase rounded-lg flex items-center gap-1 cursor-pointer"
          >
            <span>←</span>
            <span className="hidden xs:inline">Wall</span>
          </Link>

          <div className="bg-[#bef264] text-black font-black text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 border border-black uppercase tracking-wider rounded-sm shadow-[2px_2px_0px_#000]">
            ⚡ ZERO IDENTITY LOGS
          </div>
        </div>

        {/* Animated Heading & Slogan */}
        <motion.h1
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight text-amber-50 uppercase"
        >
          Say It. Leave It.{" "}
          <span className="text-[#bef264] underline decoration-wavy decoration-[#fb7185]">
            Let It Float.
          </span>
        </motion.h1>

        <p className="text-[11px] sm:text-xs text-amber-100/70 mt-1 font-mono">
          Write freely. Your IP and browser are never revealed to the public.
        </p>
      </div>

      {/* Center: Sticky Note Styled Textarea */}
      <div className="flex-1 flex flex-col justify-center my-2 sm:my-3 min-h-0">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="relative w-full rounded-2xl p-4 sm:p-6 sticky-paper-shadow flex flex-col transition-colors duration-300 border-t-8 border-black/10 min-h-[220px] sm:min-h-[260px]"
          style={{
            backgroundColor: selectedColor,
            color: "#1e1e1e",
          }}
        >
          {/* Top tape decoration */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-20 h-6 tape-strip rounded-xs -rotate-1 pointer-events-none" />

          {/* Attached Polaroid Photo Preview */}
          {photo && (
            <div className="relative mb-2.5 self-start bg-white p-1.5 pb-2 rounded-xs shadow-[0_3px_8px_rgba(0,0,0,0.25)] border border-black/15 -rotate-1 max-w-[120px] sm:max-w-[150px] flex-shrink-0 group">
              <button
                type="button"
                onClick={() => setPhoto(null)}
                title="Remove photo"
                className="absolute -top-2 -right-2 w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-[10px] font-black hover:bg-rose-600 transition-colors z-20 shadow-md cursor-pointer"
              >
                ✕
              </button>
              <div className="aspect-4/3 overflow-hidden rounded-xs bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt="Attached Preview" className="w-full h-full object-cover" />
              </div>
              <div className="text-[8px] font-mono text-center text-slate-600 mt-1 font-bold">
                ATTACHED PHOTO ✓
              </div>
            </div>
          )}

          {/* Textarea */}
          <textarea
            value={confession}
            onChange={(e) => setConfession(e.target.value)}
            placeholder={
              photo
                ? "Add a small note or caption with your photo... (e.g. Caught this moment in library floor 2)"
                : "Type your confession here... e.g. To the person in the library reading Dostoevsky every Tuesday, your quiet laugh makes my day..."
            }
            maxLength={maxLength + 50}
            rows={photo ? 3 : 5}
            className="w-full flex-1 bg-transparent resize-none border-none outline-none font-sticky text-lg sm:text-xl md:text-2xl text-slate-900 placeholder:text-slate-700/60 font-semibold leading-relaxed focus:ring-0 p-0 selection:bg-black/10 overflow-y-auto"
            autoFocus
          />

          {/* Color Chooser, Photo Actions & Character Counter */}
          <div className="mt-3 pt-2.5 border-t border-black/10 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
            {/* Palette dots */}
            <div className="flex items-center gap-1 sm:gap-1.5">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => setSelectedColor(c.hex)}
                  title={c.label}
                  className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-black/20 transition-transform cursor-pointer ${
                    selectedColor === c.hex
                      ? "scale-125 ring-2 ring-black/40 shadow-sm"
                      : "hover:scale-110 opacity-80"
                  }`}
                  style={{ backgroundColor: c.hex }}
                />
              ))}
            </div>

            {/* Photo Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleCameraTrigger}
                title="Take photo with camera"
                className={`inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition-all border border-black/15 active:scale-95 cursor-pointer ${
                  photo
                    ? "bg-[#bef264] text-black border-black/40 shadow-xs"
                    : "bg-black/10 hover:bg-black/20 text-slate-900"
                }`}
              >
                <span>📸</span>
                <span>{photo ? "Retake" : "Camera"}</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload photo from device"
                className="inline-flex items-center gap-1 px-2 sm:px-2.5 py-1 bg-black/10 hover:bg-black/20 text-slate-900 rounded-lg text-[11px] sm:text-xs font-bold transition-all border border-black/15 active:scale-95 cursor-pointer"
              >
                <span>📁</span>
                <span>Upload</span>
              </button>

              {/* Standard device file picker */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Native front camera capture on mobile */}
              <input
                ref={cameraInputRef}
                type="file"
                accept="image/*"
                capture="user"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Character counter */}
            <div className="flex items-center gap-1 font-mono text-[11px] sm:text-xs font-bold text-slate-800">
              <span className={isOverLimit ? "text-rose-600 font-extrabold" : ""}>
                {currentLength}
              </span>
              <span className="text-slate-600">/</span>
              <span>{maxLength}</span>
            </div>
          </div>
        </motion.div>

        {/* Error Feedback */}
        {errorMessage && (
          <div className="mt-2 text-center text-xs font-semibold text-rose-400 bg-rose-950/40 border border-rose-500/20 py-1.5 px-3 rounded-xl">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Confess Button (Consistently styled as homepage "Stick Your Confession") */}
        <div className="mt-3 flex justify-center flex-shrink-0 w-full px-1">
          <MagneticButton
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={isSubmitting}
            className="w-full sm:w-auto"
          >
            <span className="text-xl sm:text-2xl">✍️</span>
            <span>Stick Your Confession</span>
            <span className="text-[10px] sm:text-xs bg-black text-[#bef264] px-1.5 sm:px-2 py-0.5 rounded-sm font-mono font-bold whitespace-nowrap">
              100% ANONYMOUS
            </span>
          </MagneticButton>
        </div>
      </div>

      {/* Bottom: Sponsorship & Credits */}
      <div className="flex-shrink-0 text-center text-[11px] sm:text-xs text-slate-400 space-y-1 pt-1.5 border-t border-white/5">
        <p className="font-medium tracking-wide">
          Powered by{" "}
          <a
            href={siteConfig.sponsor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 hover:text-amber-300 font-bold underline decoration-amber-400/40 hover:decoration-amber-300 transition-colors inline-flex items-center gap-1"
          >
            <span>🪡 {siteConfig.sponsor.name}</span>
          </a>
        </p>
        <p className="text-[10px] text-slate-500">
          Developed With ❤️ By{" "}
          <a
            href={siteConfig.community.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-400 hover:text-white transition-colors font-medium"
          >
            {siteConfig.community.label}
          </a>
        </p>
      </div>

      {/* Submission Success Particle Explosion & Modal */}
      {isSubmitted && (
        <SubmissionAnimation
          onReset={handleReset}
          message={successMessage}
        />
      )}

      {/* Camera Capture Modal */}
      <CameraModal
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={(dataUrl) => setPhoto(dataUrl)}
        onFallbackUpload={() => fileInputRef.current?.click()}
      />
    </div>
  );
}
