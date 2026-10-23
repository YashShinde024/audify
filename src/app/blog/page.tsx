import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Waveform } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { presetArticleRegistry } from "@/config/blog-registry";
import { PresetIcon } from "@/components/icons/preset-icons";

import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Audio Engineering & Preset Guides — Audify Knowledge Base",
  description:
    "Authoritative deep dives into audio transformation techniques: Slowed + Reverb, 8D Audio binaural panning, Nightcore pitch shifting, 432 Hz tuning, bass boost DSP math, reverb acoustics, and more — one complete guide for every preset.",
  keywords: [
    "audio editing guide",
    "slowed and reverb tutorial",
    "how to make 8D audio",
    "nightcore pitch calculation",
    "432 hz vs 440 hz scientific truth",
    "bass boost without clipping",
    "lo-fi tape effect DSP",
    "Web Audio API acoustics",
    "reverb decay guide",
    "stereo widening mid side",
  ],
  openGraph: {
    title: "Audio Engineering & Preset Guides — Audify",
    description:
      "Explore the science, DSP formulas, and acoustic secrets behind every audio preset — 38 in-depth guides backed by the actual render pipeline.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function BlogIndexPage() {
  const guides = presetArticleRegistry;

  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          eyebrow="Editorial & Acoustic Research"
          title="Audify Blog & Acoustic Articles"
          lead="Deep, authoritative breakdowns of modern audio transformation techniques, acoustic formulas, and sound design theory — one complete article for every preset in the Studio."
        />

        <SectionSeam />

        {/* Guides Grid — generated from the preset → article registry */}
        <div className="grid gap-6 md:grid-cols-2">
          {guides.map((guide) => {
            const inner = (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-accent">
                      <PresetIcon presetId={guide.presetId ?? ""} size={18} weight="duotone" className="shrink-0" />
                      <span>{guide.categoryLabel}</span>
                    </span>
                    <span className="flex shrink-0 items-center gap-1 text-[11px] font-mono text-faint">
                      <Clock size={12} />
                      <span>{guide.readMinutes} min</span>
                    </span>
                  </div>

                  <h2 className="text-base font-semibold tracking-tight text-fg group-hover:text-accent transition-colors text-balance">
                    {guide.title}
                  </h2>

                  <p className="text-xs text-muted leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-line/60 pt-4 text-xs font-semibold text-accent">
                  <span>Read the guide</span>
                  <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </div>
              </>
            );

            return (
              <article key={guide.slug}>
                <Link
                  href={`/blog/${guide.slug}`}
                  aria-label={guide.title}
                  className="group relative flex h-full flex-col justify-between rounded-2xl border border-line bg-raised p-6 transition hover:border-accent/50 hover:bg-raised/80"
                >
                  {inner}
                </Link>
              </article>
            );
          })}
        </div>

        {/* Studio Link Footer */}
        <section className="rounded-2xl border border-line bg-raised p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-fg">Want to test these effects live?</h3>
            <p className="mt-1 text-xs text-muted max-w-md">
              Load your track into Audify Studio and hear every preset in this library instantly —
              all processing happens locally in your browser.
            </p>
          </div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-white hover:bg-accent-hover transition-colors shrink-0"
          >
            <Waveform size={15} weight="bold" />
            <span>Open Audify Studio</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
