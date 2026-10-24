import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: import.meta.dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      {
        source: "/audio-guide",
        destination: "/how-it-works",
        permanent: true,
      },
      {
        source: "/guide",
        destination: "/how-it-works",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
