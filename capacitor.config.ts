import type { CapacitorConfig } from "@capacitor/cli";

/**
 * Capacitor configuration for Audify native shells (Android first, iOS later).
 *
 * Strategy: thin native WebView wrapper around the deployed production site.
 * The web app already ships the contact API route and latest code, so loading
 * the live URL keeps a single source of truth. Server-side rendering, SEO and
 * API routes stay untouched — no `output: "export"` needed.
 */
const config: CapacitorConfig = {
  appId: "in.nyxen.audify",
  appName: "Audify",
  webDir: "public",
  server: {
    // Load the deployed production site inside the WebView.
    url: "https://audify.nyxen.in",
    androidScheme: "https",
    // Never allow dev live-reload / local assets to hijack release builds.
    cleartext: false,
    allowNavigation: ["audify.nyxen.in", "*.nyxen.in"],
  },
  android: {
    allowMixedContent: false,
    backgroundColor: "#0b0a10",
  },
};

export default config;
