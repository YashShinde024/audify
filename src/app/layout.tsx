import type { Metadata, Viewport } from "next";
import { Sora, Manrope, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/layout/toast-provider";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { StudioShell } from "@/components/layout/studio-shell";
import { siteConfig } from "@/config/site";

const sora = Sora({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
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
    images: [
      {
        url: "/images/audify-og.png",
        width: 1200,
        height: 630,
        alt: "Audify — Sound, reimagined by Nyxen × Xpert Melody",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/images/audify-og.png"],
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
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F7F5" },
    { media: "(prefers-color-scheme: dark)", color: "#111016" },
  ],
};

import { cookies } from "next/headers";

const ROOT_JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${siteConfig.url}/#website`,
      url: siteConfig.url,
      name: siteConfig.name,
      description: siteConfig.description,
      publisher: {
        "@id": `${siteConfig.url}/#organization`,
      },
      inLanguage: "en-US",
    },
    {
      "@type": "Organization",
      "@id": `${siteConfig.url}/#organization`,
      name: siteConfig.creators.nyxen.name,
      url: siteConfig.creators.nyxen.website,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/images/nyxen/nyxen-logo.png`,
      },
      sameAs: [
        "https://x.com/buildnyxen",
        "https://instagram.com/buildnyxen",
        "https://youtube.com/@BuildNyxen",
        siteConfig.githubUrl,
      ],
      contactPoint: [
        {
          "@type": "ContactPoint",
          email: siteConfig.emails.general,
          contactType: "General Inquiries",
        },
        {
          "@type": "ContactPoint",
          email: siteConfig.emails.support,
          contactType: "Customer Support",
        },
        {
          "@type": "ContactPoint",
          email: siteConfig.emails.build,
          contactType: "Partnership & Technical",
        },
      ],
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteConfig.url}/#software`,
      name: siteConfig.name,
      applicationCategory: "MultimediaApplication",
      applicationSubCategory: "Audio Processing Workstation",
      operatingSystem: "Web Browser (Chrome, Firefox, Safari, Edge)",
      url: siteConfig.url,
      description: siteConfig.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      featureList: [
        "In-Browser 32-bit Float Web Audio DSP",
        "Zero-Cloud Audio Processing (Zero Audio Uploads)",
        "Look-Ahead Peak Limiter Protection (-0.3 dBFS Ceiling)",
        "Offline Audio Rendering at Up to 50x Playback Speed",
        "Multi-Format Audio Export (WAV, MP3, AIFF)",
      ],
      author: {
        "@id": `${siteConfig.url}/#organization`,
      },
    },
  ],
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const themeCookie = cookieStore.get("audify-theme")?.value;
  // Default to "dark" for DAW native experience unless explicitly saved as "light"
  const initialTheme: "light" | "dark" = themeCookie === "light" ? "light" : "dark";

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sora.variable} ${manrope.variable} ${ibmPlexMono.variable} font-sans h-full antialiased ${initialTheme === "dark" ? "dark" : ""}`}
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ROOT_JSON_LD) }}
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
