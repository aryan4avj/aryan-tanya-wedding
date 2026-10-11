import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Add external domains here if serving images from a CDN
    remotePatterns: [],
  },
  // Allow static exports for Vercel / Netlify
  output: undefined,
};

export default nextConfig;
