import type { Metadata } from "next";
import { PresetExplorer } from "@/components/editor/preset-explorer";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";

export const metadata: Metadata = {
  title: "Presets & Audio Tools Directory — Svaraya",
  description:
    "Explore Svaraya's complete audio suite: 8D Audio, Slowed + Reverb, 432 Hz Pitch Conversion, Bass Boosters, Room Reverbs, Trimmer, Equalizer, and Audio Utilities.",
};

export default function PresetsPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Tools & Presets Catalog"
          title="Audio Effects & Utilities Directory"
          lead="From viral slowed-reverbs and 8D orbital pans to dedicated audio tools like 432 Hz conversion, multi-band EQ, and precise audio trimming."
        />

        <SectionSeam />

        <PresetExplorer />
      </div>
    </div>
  );
}
