"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (dataUrl: string) => void;
  onFallbackUpload?: () => void;
}

export default function CameraModal({
  isOpen,
  onClose,
  onCapture,
  onFallbackUpload,
}: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isCapturing, setIsCapturing] = useState(false);
  const [isShutterFlash, setIsShutterFlash] = useState(false);

  // Stop camera tracks cleanly
  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    setError("");
    stopStream();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera API is not supported on this browser or device.");
      }

      let mediaStream: MediaStream;
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user", // Front camera on mobile & laptop webcam
            width: { ideal: 1280 },
            height: { ideal: 960 },
          },
          audio: false,
        });
      } catch (constraintErr) {
        console.warn("Retrying camera without facingMode constraint:", constraintErr);
        mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false,
        });
      }

      streamRef.current = mediaStream;

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: unknown) {
      console.error("Camera access error:", err);
      const msg =
        err instanceof Error
          ? err.message
          : "Unable to access front camera. Please check permissions.";
      setError(msg);
    }
  }, [stopStream]);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopStream();
    }
    return () => {
      stopStream();
    };
  }, [isOpen, startCamera, stopStream]);

  // Capture frame from video and compress to data URL
  const handleSnap = () => {
    if (!videoRef.current || isCapturing) return;

    setIsCapturing(true);
    setIsShutterFlash(true);

    setTimeout(() => {
      try {
        const video = videoRef.current;
        if (!video) return;

        const maxDim = 800; // Optimal medium resolution for fast upload & crisp display
        let w = video.videoWidth || video.clientWidth || 640;
        let h = video.videoHeight || video.clientHeight || 480;
        if (w <= 0) w = 640;
        if (h <= 0) h = 480;

        if (w > maxDim || h > maxDim) {
          if (w > h) {
            h = Math.round((h * maxDim) / w);
            w = maxDim;
          } else {
            w = Math.round((w * maxDim) / h);
            h = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          // Mirror horizontal like front camera
          ctx.translate(w, 0);
          ctx.scale(-1, 1);
          ctx.drawImage(video, 0, 0, w, h);

          // Convert to efficient WebP or JPEG
          let dataUrl = canvas.toDataURL("image/webp", 0.78);
          if (!dataUrl.startsWith("data:image/webp")) {
            dataUrl = canvas.toDataURL("image/jpeg", 0.78);
          }

          stopStream();
          onCapture(dataUrl);
          onClose();
        }
      } catch (snapErr) {
        console.error("Snapshot error:", snapErr);
        setError("Failed to capture image. Please try again or upload a photo.");
      } finally {
        setIsCapturing(false);
        setIsShutterFlash(false);
      }
    }, 180);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            className="relative z-10 w-full max-w-md bg-slate-900 border-2 border-white/10 rounded-3xl p-5 shadow-2xl overflow-hidden text-white flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xl">📸</span>
                <div>
                  <h3 className="text-sm font-extrabold uppercase tracking-wide">
                    Take Front Camera Photo
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    One photo only to tape on your sticky note
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-xs font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="relative aspect-4/3 w-full bg-black rounded-2xl overflow-hidden border border-white/15 flex items-center justify-center">
              {error ? (
                <div className="p-5 text-center space-y-3">
                  <span className="text-3xl block">⚠️</span>
                  <p className="text-xs text-rose-300 font-medium">{error}</p>
                  <div className="flex items-center justify-center gap-2 pt-1 flex-wrap">
                    <button
                      type="button"
                      onClick={startCamera}
                      className="btn-funky-cyan px-3 py-1.5 text-xs rounded-lg uppercase font-bold"
                    >
                      Retry Camera
                    </button>
                    {onFallbackUpload && (
                      <button
                        type="button"
                        onClick={() => {
                          onClose();
                          onFallbackUpload();
                        }}
                        className="btn-confess-main px-3 py-1.5 text-xs rounded-lg uppercase font-bold text-black"
                      >
                        📁 Choose Photo
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover transform -scale-x-100"
                  />

                  {/* Viewfinder crosshairs */}
                  <div className="absolute inset-4 border border-white/20 rounded-xl pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between text-[10px] font-mono text-white/50">
                      <span>┌ KMCLU CAM ┐</span>
                      <span>[ LIVE ]</span>
                    </div>
                    <div className="text-center text-[10px] font-mono text-white/40">
                      + CENTER SHOT +
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-white/50">
                      <span>└ 1 PHOTO ONLY ┘</span>
                      <span>AUTO-COMPRESS</span>
                    </div>
                  </div>

                  {/* Shutter Flash Animation */}
                  {isShutterFlash && (
                    <div className="absolute inset-0 bg-white animate-pulse" />
                  )}
                </>
              )}
            </div>

            {/* Bottom Trigger Controls */}
            <div className="mt-4 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSnap}
                disabled={!!error || isCapturing}
                className="btn-confess-main px-6 py-2.5 text-sm uppercase rounded-xl flex items-center gap-2 font-black disabled:opacity-50"
              >
                <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
                <span>Snap Photo 📸</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
