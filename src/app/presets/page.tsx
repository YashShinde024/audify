import type { Metadata } from "next";
import { PresetExplorer } from "@/components/editor/preset-explorer";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Audio Presets & DSP Tools Matrix — AudioMorph",
  description:
    "Explore AudioMorph's full acoustic matrix: 8D Audio, Slowed + Reverb, 432 Hz Sacred Pitch Tuning, Bass Boosters, Room Reverbs, Trimmer, Equalizer, and Audio Utilities engineered by Nyxen.",
  openGraph: {
    title: "Audio Presets & DSP Tools Matrix — AudioMorph",
    description:
      "Instant client-side audio transformations engineered by Nyxen with 32-bit float Web Audio DSP.",
    url: `${siteConfig.url}/presets`,
  },
};

export default function PresetsPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-10">
        <PageHeader
          eyebrow="Acoustic Catalog & DSP Matrix"
          title="Audio Effects & Presets Directory"
          lead="Engineered by Nyxen: 36+ browser-native audio modules spanning spatial 8D orbits, atmospheric slowed+reverbs, psychoacoustic bass boosters, and studio utilities."
        />

        <SectionSeam />

        <PresetExplorer />
      </div>
    </div>
  );
}
