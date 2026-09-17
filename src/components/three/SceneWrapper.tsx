"use client";

import dynamic from "next/dynamic";
import React from "react";

const ParticleBackground = dynamic(
  () => import("@/components/three/ParticleBackground"),
  {
    ssr: false,
    loading: () => (
      <div className="pointer-events-none fixed inset-0 z-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-500/5 via-purple-900/5 to-transparent" />
    ),
  }
);

export default function SceneWrapper() {
  return <ParticleBackground />;
}
