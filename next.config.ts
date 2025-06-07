import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Enable pages directory for NextAuth API routes
    appDir: true,
  },
  // Allow pages and app directories to coexist
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
