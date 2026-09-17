import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["three", "@react-three/fiber", "@react-three/drei"],
  serverExternalPackages: ["mongoose"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
