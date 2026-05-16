import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Tree-shake barrel imports so the dev compiler and prod bundle only pull
  // the icons/functions actually used instead of the entire package barrel.
  // The lucide-react sidebar barrel import was the single biggest dev-server
  // cost on weaker machines.
  experimental: {
    optimizePackageImports: ["lucide-react", "date-fns"],
  },

  // Smaller, faster client bundles in production (no behavior change).
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production" ? { exclude: ["error"] } : false,
  },
};

export default nextConfig;
