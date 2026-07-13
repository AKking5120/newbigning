import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.supabase.co" },
    ],
    // Optimize images for better Core Web Vitals
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400, // 24 hours
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Compress responses
  compress: true,
  // Enable SWR (Stale-While-Revalidate) for better caching
  onDemandEntries: {
    maxInactiveAge: 60 * 1000, // 1 minute
    pagesBufferLength: 5,
  },
  // Enable incremental static regeneration
  experimental: {
    optimizeCss: true, // Optimize CSS
    optimizePackageImports: ["@radix-ui/react-*"], // Optimize imports
  },
  // Headers for SEO and performance
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
  // Redirects for SEO-friendly URLs
  async redirects() {
    return [
      // Add redirects for old URLs if migrating
    ];
  },
  // Rewrites for clean URLs
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
