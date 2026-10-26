import type { Metadata } from "next";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { ToolsClient } from "./tools-client";
import { AdBanner } from "@/components/advertising/ad-banner";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Audio Tools & Processing Utilities — Audify",
  description:
    "Explore Audify's in-browser audio toolkit: dynamic compressor, precision audio trimmer, vocal remover, multi-format audio converter, stereo to mono downmixer, DC offset remover, and parametric EQ.",
  keywords: [
    "audio tools online",
    "in-browser audio editor",
    "audio compressor online",
    "vocal remover web audio",
    "audio converter wav mp3 aiff",
    "audio trimmer cutter",
    "dc offset remover",
    "stereo to mono converter",
    "reverse audio online",
    "audio peak limiter",
  ],
  alternates: {
    canonical: `${siteConfig.url}/tools`,
  },
  openGraph: {
    title: "Audio Tools & Processing Utilities — Audify",
    description:
      "Comprehensive browser-native audio utilities. Compress, trim, convert, isolate vocals, and remove DC offset in client-side memory without cloud uploads.",
    url: `${siteConfig.url}/tools`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const TOOLS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Audify Audio Tools & Utilities",
  description:
    "Suite of browser-native audio processing tools including dynamic compression, format conversion, trimming, vocal removal, and DC offset correction.",
  url: `${siteConfig.url}/tools`,
  publisher: {
    "@type": "Organization",
    name: "Nyxen",
    url: "https://nyxen.in/",
  },
};

export default function ToolsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(TOOLS_JSON_LD) }}
      />
      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
          <PageHeader
            eyebrow="Comprehensive Audio Toolkit"
            title="Audio Tools & Utilities"
            lead="Edit, enhance, convert, and master audio tracks directly in your browser. Every tool runs 100% client-side in 32-bit float memory with instant preview and lossless export."
          />

          {/* Ad Placement: Below page header, above tools grid */}
          <AdBanner id="tools-top" className="mx-auto" />

          <SectionSeam />

          <ToolsClient />

          {/* Ad Placement: Below tools grid, at page bottom */}
          <div className="pt-4 border-t border-line/50">
            <AdBanner id="tools-bottom" className="mx-auto" />
          </div>
        </div>
      </div>
    </>
  );
}
