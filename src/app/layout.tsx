import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/layout/toast-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { StudioShell } from "@/components/layout/studio-shell";
import { siteConfig } from "@/config/site";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    siteName: siteConfig.name,
    type: "website",
    url: siteConfig.url,
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F5" },
    { media: "(prefers-color-scheme: dark)", color: "#111016" },
  ],
};

import { cookies } from "next/headers";

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("audify-theme")?.value;
  // Default to "dark" for DAW native experience unless explicitly saved as "light"
  const initialTheme: "light" | "dark" = themeCookie === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased ${initialTheme === "dark" ? "dark" : ""}`}
    >
      <head>
        {/* Pre-hydration theme: paints the correct `dark` class before first
            paint to avoid FOUC and React hydration mismatches. Must mirror
            resolveInitialTheme() in theme-provider.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("audify-theme")||localStorage.getItem("audiomorph-theme")||localStorage.getItem("svaraya-theme");if(!t){t=window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(t==="dark"){document.documentElement.classList.add("dark")}else{document.documentElement.classList.remove("dark")}document.cookie="audify-theme="+t+"; path=/; max-age=31536000; SameSite=Lax";}catch(e){}})()`,
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full bg-canvas text-fg antialiased transition-colors duration-200"
      >
        <ThemeProvider initialTheme={initialTheme}>
          <StudioShell>{children}</StudioShell>
          <ToastProvider />
        </ThemeProvider>
      </body>
    </html>
  );
}
