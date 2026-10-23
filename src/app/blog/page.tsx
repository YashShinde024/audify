import type { Metadata } from "next";
import Link from "next/link";
import { Waveform, BookOpen } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { presetArticleRegistry } from "@/config/blog-registry";
import { siteConfig } from "@/config/site";
import { BlogClient } from "./blog-client";

export const metadata: Metadata = {
  title: "Audio Engineering & Preset Guides — Audify Knowledge Base",
  description:
    "Authoritative deep dives into audio transformation techniques: Slowed + Reverb, 8D Audio binaural panning, Nightcore pitch shifting, 432 Hz tuning, bass boost DSP math, and reverb acoustics — 38 complete guides backed by our actual browser Web Audio pipeline.",
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

const BLOG_COLLECTION_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Audify Audio Engineering & Acoustic Guides",
  description:
    "Authoritative deep dives into audio transformation techniques, DSP formulas, and acoustic theory.",
  url: `${siteConfig.url}/blog`,
  publisher: {
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: presetArticleRegistry.map((article, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: article.title,
      url: `${siteConfig.url}/blog/${article.slug}`,
    })),
  },
};

export default function BlogIndexPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_COLLECTION_JSON_LD) }}
      />
      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <PageHeader
            eyebrow="Editorial & Acoustic Research"
            title="Audio Engineering & Acoustic Guides"
            lead="Deep, authoritative breakdowns of modern audio transformation techniques, acoustic formulas, and sound design theory — one complete guide for every preset in the Studio."
          />

          <SectionSeam />

          {/* Interactive Editorial Blog Client */}
          <section aria-label="Audio Guides Archive">
            <BlogClient articles={presetArticleRegistry} />
          </section>

          {/* Practical Studio Bridge Section */}
          <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5">
              <h3 className="text-base font-semibold text-fg">
                Put acoustic theory into practice
              </h3>
              <p className="text-xs text-muted max-w-lg leading-relaxed">
                Every mathematical concept and DSP routing chain in these articles is available live in the Audify Studio. Load your track to test any preset with zero server latency.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 rounded-xl border border-line bg-canvas px-4 py-2.5 text-xs font-semibold text-fg hover:border-violet transition-colors"
              >
                <BookOpen size={15} />
                <span>Audio Pipeline Guide</span>
              </Link>
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2.5 text-xs font-semibold text-white hover:bg-violet-dark transition-colors shadow-sm"
              >
                <Waveform size={15} weight="bold" />
                <span>Open Audify Studio</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
