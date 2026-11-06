import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.VSP_DIST_DIR || ".next",
  devIndicators: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  reactStrictMode: false,
};

export default nextConfig;
