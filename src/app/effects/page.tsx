import { Suspense } from "react";
import type { Metadata } from "next";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { EffectsWorkspace } from "@/components/effects/effects-workspace";
import { AdBanner } from "@/components/advertising/ad-banner";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Audio Effects & DSP Controls — Audify",
  description:
    "Direct parameter control over browser-native Web Audio nodes. Adjust, audition, and process your audio client-side with 32-bit float accuracy.",
  alternates: {
    canonical: `${siteConfig.url}/effects`,
  },
  openGraph: {
    title: "Audio Effects & DSP Controls — Audify",
    description:
      "Control speed, pitch, reverb tails, 3-band EQ, bass boost tiers, and look-ahead limiting with 32-bit float Web Audio DSP.",
    url: `${siteConfig.url}/effects`,
  },
};

export default function EffectsPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-8">
        <PageHeader
          eyebrow="DSP Control Rack"
          title="Audio Effects & Precision Controls"
          lead="Direct parameter control over browser-native Web Audio nodes. Adjust, audition, and process your audio client-side with 32-bit float accuracy."
        />

        {/* Ad Placement 1: Below page header, before effects workspace */}
        <AdBanner id="effects-top" className="mx-auto" />

        <SectionSeam />

        <Suspense fallback={null}>
          <EffectsWorkspace />
        </Suspense>

        {/* Ad Placement 2: Bottom of page, below effects workspace */}
        <div className="pt-8 border-t border-line/60">
          <AdBanner id="effects-bottom" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
