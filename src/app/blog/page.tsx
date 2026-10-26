import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Waveform } from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Audify Blog",
  description:
    "Audify by Nyxen × Xpert Melody — no articles are published here yet. Explore the audio toolkit or how the DSP pipeline works instead.",
  robots: { index: false, follow: true },
  openGraph: {
    title: "Audify Blog",
    description:
      "Audify by Nyxen × Xpert Melody — no articles are published here yet. Explore the audio toolkit or how the DSP pipeline works instead.",
    url: `${siteConfig.url}/blog`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default function BlogIndexPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          eyebrow="Editorial & Acoustic Research"
          title="Audify Blog"
          lead="No articles have been published yet. In the meantime, the Audify Studio, presets, and DSP pipeline guides cover everything the blog would."
        />

        <SectionSeam />

        {/* Practical Studio Bridge Section */}
        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <h3 className="text-base font-semibold text-fg">
              Explore the product instead
            </h3>
            <p className="text-xs text-muted max-w-lg leading-relaxed">
              Every effect lives in the Audify Studio with zero server latency. Load your track and try any preset right in the browser.
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
              className="btn-gradient-primary btn-sweep-reverse inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-sm"
            >
              <Waveform size={15} weight="bold" />
              <span>Open Audify Studio</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
