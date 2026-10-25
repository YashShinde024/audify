import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import {
  getToolBySlug,
  getAllToolSlugs,
  TOOLS_REGISTRY,
} from "@/config/tools-registry";
import { ToolWorkspace } from "@/components/tools/tool-workspace";
import {
  ArrowLeft,
  SlidersHorizontal,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { AdBanner } from "@/components/advertising/ad-banner";
import { siteConfig } from "@/config/site";

interface ToolPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return getAllToolSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return {};

  const canonicalUrl = `${siteConfig.url}/tools/${tool.slug}`;

  return {
    title: tool.seo.title,
    description: tool.seo.description,
    keywords: tool.seo.keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: tool.seo.title,
      description: tool.seo.description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: `${siteConfig.url}/images/audify-og.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} — Free In-Browser Audio Tool · Audify`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: tool.seo.title,
      description: tool.seo.description,
      creator: "@buildnyxen",
      images: [`${siteConfig.url}/images/audify-og.png`],
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);

  if (!tool) {
    notFound();
  }

  // Related tools from the same or complementary categories
  const relatedTools = TOOLS_REGISTRY.filter(
    (t) => t.slug !== tool.slug && (t.category === tool.category || t.badge === tool.badge)
  ).slice(0, 3);

  // Fallback to any other tools if fewer than 3
  if (relatedTools.length < 3) {
    const others = TOOLS_REGISTRY.filter(
      (t) => t.slug !== tool.slug && !relatedTools.some((r) => r.slug === t.slug)
    ).slice(0, 3 - relatedTools.length);
    relatedTools.push(...others);
  }

  // Schema.org WebApplication Structured Data
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    headline: tool.tagline,
    description: tool.description,
    applicationCategory: "AudioApplication",
    operatingSystem: "Web Browser (Chrome, Firefox, Safari, Edge)",
    url: `${siteConfig.url}/tools/${tool.slug}`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    browserRequirements: "Requires Web Audio API support. No server uploads or plugins needed.",
  };

  return (
    <div className="min-h-screen py-10 sm:py-16">
      {/* JSON-LD Script */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-muted">
          <Link href="/" className="hover:text-fg transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-fg transition-colors">
            Audio Tools
          </Link>
          <span>/</span>
          <span className="text-fg font-medium">{tool.name}</span>
        </div>

        {/* Hero & Tool Header */}
        <header className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-primary/25 bg-primary/10 text-primary text-xs font-semibold">
            <span>{tool.categoryLabel}</span>
            <span>·</span>
            <span>{tool.badge}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-fg">
            {tool.name}
          </h1>

          <p className="text-base sm:text-lg text-muted leading-relaxed">
            {tool.tagline}
          </p>

          <div className="inline-flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-muted">
            <span className="px-2.5 py-1 rounded-md bg-raised border border-line font-mono">
              {tool.specs}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-success/10 border border-success/20 text-success inline-flex items-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% In-Browser Privacy
            </span>
          </div>
        </header>

        {/* Ad Placement: Between header and interactive workspace */}
        <AdBanner className="mx-auto max-w-4xl" />

        {/* Primary Interactive Workspace */}
        <section aria-label={`${tool.name} interactive workspace`}>
          <ToolWorkspace tool={tool} />
        </section>

        {/* Educational Content & Instructions */}
        <section className="max-w-4xl mx-auto pt-10 border-t border-line space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl border border-line bg-surface/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple/10 border border-purple/20 flex items-center justify-center text-purple font-bold text-sm">
                1
              </div>
              <h3 className="text-base font-semibold text-fg">Upload Audio File</h3>
              <p className="text-xs text-muted leading-relaxed">
                Drag and drop your audio track. Supports {tool.supportedInputs.join(", ")}. Decoded strictly in browser memory without sending bytes over the internet.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-line bg-surface/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-pink/10 border border-pink/20 flex items-center justify-center text-pink font-bold text-sm">
                2
              </div>
              <h3 className="text-base font-semibold text-fg">Fine-Tune Parameters</h3>
              <p className="text-xs text-muted leading-relaxed">
                Configure your target parameters or keep our calibrated studio defaults. All adjustments calculate deterministically via 32-bit float Web Audio DSP.
              </p>
            </div>

            <div className="p-6 rounded-2xl border border-line bg-surface/60 space-y-2">
              <div className="w-9 h-9 rounded-xl bg-orange/10 border border-orange/20 flex items-center justify-center text-orange font-bold text-sm">
                3
              </div>
              <h3 className="text-base font-semibold text-fg">Preview & Download</h3>
              <p className="text-xs text-muted leading-relaxed">
                Listen to the high-fidelity preview directly on the page, check output file specs, and download your export immediately with zero wait-walls.
              </p>
            </div>
          </div>

          {/* Deep Dive & Studio Link */}
          <div className="p-6 sm:p-8 rounded-2xl border border-line bg-surface/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div className="space-y-1.5 max-w-xl">
              <h3 className="text-lg font-bold text-fg flex items-center gap-2">
                <Sparkle className="w-5 h-5 text-primary" />
                <span>Need Advanced Multi-Track Stacking or Custom Presets?</span>
              </h3>
              <p className="text-xs sm:text-sm text-muted">
                Audify Studio lets you stack 30+ effects simultaneously, sculpt parametric EQ curves, visualize live spectrums, and chain reverb, echo, and spatializers.
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
              <Link
                href={tool.presetId ? `/studio?preset=${tool.presetId}` : "/studio"}
                className="btn-gradient-primary px-5 py-2.5 rounded-xl text-white text-xs font-semibold inline-flex items-center gap-2 shadow-md"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Launch in Studio</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Ad Placement: After educational content, before related tools */}
        <AdBanner className="mx-auto max-w-4xl pt-8" />

        {/* Related Tools Directory Section */}
        <section className="max-w-4xl mx-auto pt-8 border-t border-line space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-fg">More Audio Utilities</h3>
            <Link
              href="/tools"
              className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1 transition-colors"
            >
              <span>Explore All 15 Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {relatedTools.map((rel) => (
              <Link
                key={rel.slug}
                href={`/tools/${rel.slug}`}
                className="group p-5 rounded-xl border border-line hover:border-primary/50 bg-surface/60 hover:bg-raised transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-primary">
                    {rel.badge}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
                <h4 className="text-sm font-bold text-fg group-hover:text-primary transition-colors">
                  {rel.name}
                </h4>
                <p className="text-xs text-muted line-clamp-2">
                  {rel.tagline}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
