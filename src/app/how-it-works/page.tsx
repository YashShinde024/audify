import type { Metadata } from "next";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { InteractiveAudioGuide } from "@/components/guide/interactive-guide";
import { AdBanner } from "@/components/advertising/ad-banner";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "How Audify Works — Interactive Web Audio DSP Lab & Guide",
  description:
    "Interactive acoustic laboratory and audio engineering guide: inspect the 32-bit Web Audio signal chain, calculate speed and pitch math, simulate 8D binaural orbits, and explore true-peak export limiting.",
  keywords: [
    "how audify works",
    "web audio api tutorial",
    "interactive audio dsp guide",
    "slowed and reverb math",
    "8D audio binaural simulation",
    "varispeed pitch calculation",
    "browser audio processing",
    "convolver reverb acoustics",
  ],
  alternates: {
    canonical: `${siteConfig.url}/how-it-works`,
  },
  openGraph: {
    title: "How Audify Works — Interactive Web Audio DSP Lab",
    description:
      "Explore the science and signal flow of in-browser audio DSP with interactive calculators, 8D binaural simulators, and real-time pipeline inspections.",
    url: `${siteConfig.url}/how-it-works`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Editorial Page Header */}
        <PageHeader
          eyebrow="Interactive Acoustic Lab"
          title="How Audify Works"
          lead="Explore how raw audio transforms into rich acoustic spaces inside your browser. Inspect the live DSP pipeline, calculate speed and pitch math, simulate 8D binaural orbits, and understand true-peak export limiting."
        />

        {/* Ad Placement 1: Below page header, before interactive lab */}
        <AdBanner id="how-it-works-top" className="mx-auto" />

        <SectionSeam />

        {/* Interactive Lab Experience */}
        <InteractiveAudioGuide />

        {/* Ad Placement 2: Bottom of page, below interactive lab */}
        <div className="pt-8 border-t border-line/60">
          <AdBanner id="how-it-works-bottom" className="mx-auto" />
        </div>
      </div>
    </div>
  );
}
