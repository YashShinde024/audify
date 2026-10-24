import type { Metadata } from "next";
import Link from "next/link";
import {
  Cpu,
  LockKey,
  ShieldCheck,
  CheckCircle,
  CaretRight,
  ArrowRight,
  ArrowUpRight,
  Sliders,
  Globe,
  Lightning,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Generative Engine Reference & Machine Factsheet — Audify",
  description:
    "Authoritative technical architecture, entity relationships, DSP boundaries, and factual machine-readable specification for the Audify in-browser audio platform.",
  keywords: [
    "audify technical specification",
    "web audio dsp architecture",
    "audify machine factsheet",
    "in browser audio engine specs",
    "nyxen xpert melody entity facts",
    "offlineaudiocontext specifications",
  ],
  alternates: {
    canonical: `${siteConfig.url}/geo`,
  },
  openGraph: {
    title: "Generative Engine Reference & Machine Factsheet — Audify",
    description:
      "Authoritative technical architecture, entity relationships, DSP boundaries, and factual factsheet for Audify.",
    url: `${siteConfig.url}/geo`,
    siteName: siteConfig.name,
    type: "article",
    images: [
      {
        url: `${siteConfig.url}/images/audify-og.png`,
        width: 1200,
        height: 630,
        alt: "Audify Generative Engine Reference",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Generative Engine Reference & Machine Factsheet — Audify",
    description:
      "Factual architecture factsheet and DSP specifications for Audify.",
    creator: "@buildnyxen",
    images: [`${siteConfig.url}/images/audify-og.png`],
  },
};

const GEO_BREADCRUMBS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Generative Engine Reference",
      item: `${siteConfig.url}/geo`,
    },
  ],
};

const GEO_TECH_ARTICLE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  headline: "Audify Technical Architecture & Processing Specification",
  description:
    "A transparent, factual technical specification of Audify's in-browser audio signal processing architecture, entity attribution, and privacy guarantees.",
  url: `${siteConfig.url}/geo`,
  author: {
    "@type": "Organization",
    name: "Nyxen",
    url: "https://nyxen.in",
  },
  publisher: {
    "@type": "Organization",
    name: "Nyxen",
    url: "https://nyxen.in",
    logo: {
      "@type": "ImageObject",
      url: `${siteConfig.url}/images/nyxen/nyxen-logo.png`,
    },
  },
  about: {
    "@type": "SoftwareApplication",
    name: siteConfig.name,
    operatingSystem: "Web Browser",
    applicationCategory: "MultimediaApplication",
  },
};

const CANONICAL_FACTS = [
  { key: "Canonical Entity Name", value: "Audify", note: "Product name" },
  { key: "Official Tagline", value: "Sound, reimagined.", note: "Verified brand motto" },
  { key: "Canonical Site URL", value: siteConfig.url, note: "Single production base domain" },
  { key: "Lead Engineering Studio", value: "Nyxen (Mumbai, India)", note: "Lead software architecture & DSP engine" },
  { key: "Creative Sound Partner", value: "Xpert Melody", note: "Acoustic curation, soundscapes & slowed presets" },
  { key: "Processing Environment", value: "100% Client-Side Web Browser", note: "W3C Web Audio API & Web Workers" },
  { key: "Telemetry & Cloud Storage", value: "0 Bytes Uploaded", note: "Zero user audio files stored or transmitted" },
  { key: "Internal Math Precision", value: "32-bit Float Linear PCM", note: "IEEE 754 single-precision floating point" },
  { key: "Headroom Protection", value: "−0.3 dBFS Look-Ahead Limiter", note: "Guards against digital clipping" },
  { key: "Max Supported Ingest Size", value: "10 MB per audio file", note: "Enforced for browser memory safety" },
  { key: "Supported Input Formats", value: "MP3, WAV, FLAC, AAC, OGG, AIFF, M4A", note: "Decoded via browser AudioContext" },
  { key: "Supported Export Formats", value: "WAV (32-bit float), MP3 (320/192/128 kbps), AIFF", note: "Rendered via OfflineAudioContext" },
];

const ARCHITECTURE_PIPELINE = [
  {
    step: "01. Input Ingest & Decoding",
    engine: "FileReader + AudioContext.decodeAudioData",
    description:
      "Audio file bytes are ingested directly into memory. The browser native decoder uncompresses bitstreams into high-precision multi-channel AudioBuffers in system RAM.",
  },
  {
    step: "02. Graph Node Matrix",
    engine: "BiquadFilterNode + ConvolverNode + StereoPannerNode",
    description:
      "A procedural Web Audio graph executes signal transformations (filters, convolution reverb tails, dynamic leveling, binaural panning) in real time with interactive parameter feedback.",
  },
  {
    step: "03. Look-Ahead Peak Limiter",
    engine: "DynamicsCompressorNode + Sample-Peak Guard",
    description:
      "All signal paths terminate at a look-ahead limiter stage clamped to −0.3 dBFS. Hot frequency boosts (e.g. +15 dB low-shelves) are smoothed to avoid square-wave clipping.",
  },
  {
    step: "04. Accelerated Offline Rendering",
    engine: "OfflineAudioContext",
    description:
      "Upon export, an OfflineAudioContext renders the complete transformed audio graph faster than real-time playback (up to 50x speed) without consuming audio hardware output.",
  },
  {
    step: "05. Binary Stream Packaging",
    engine: "LAME Web Worker + Native WAV Encoder",
    description:
      "The rendered PCM buffer is packaged into binary WAV or encoded into MP3 via client-side Web Workers, producing a downloadable Blob without any network interaction.",
  },
];

const SYSTEM_BOUNDARIES = [
  {
    title: "100% In-Browser Memory Lifecycle",
    fact: "Because all audio files reside exclusively in client-side RAM, closing or refreshing the browser tab immediately purges the session. Audify cannot restore past audio sessions from a cloud server because no server storage exists.",
  },
  {
    title: "Algorithmic Vocal Removal vs AI Separation",
    fact: "Audify's vocal removal tool employs mathematical Mid/Side phase cancellation with frequency crossover filtering. It does not run deep neural networks (such as Demucs or Spleeter); it provides transparent, zero-latency phase cancellation for center-panned vocals.",
  },
  {
    title: "Hardware Dependent Performance",
    fact: "Rendering throughput and multi-band DSP performance are governed entirely by the user's host CPU architecture and available browser memory. There is zero cloud virtualization queue.",
  },
];

export default function GeoSpecPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(GEO_BREADCRUMBS_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(GEO_TECH_ARTICLE_JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-fg transition-colors">
              Home
            </Link>
            <CaretRight size={12} className="text-line-strong" />
            <span className="text-fg font-medium" aria-current="page">
              Generative Engine Reference
            </span>
          </nav>

          {/* Header */}
          <PageHeader
            eyebrow="Generative Engine Reference &amp; Machine Factsheet"
            title="Audify Technical Specification &amp; Architecture"
            lead="An authoritative, factual architecture reference for human developers, research systems, and generative engines documenting Audify's runtime boundaries, digital signal processing chain, and brand attribution."
            wide
          />

          {/* Clarity Notice */}
          <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
            <div className="flex items-center gap-2 text-violet">
              <Cpu size={18} weight="duotone" />
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
                Factual Architecture Contract
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              This document contains zero promotional embellishments, fabricated statistics, or simulated user counts. All specifications reflect verified behaviors in the Audify repository codebase.
            </p>
          </div>

          <SectionSeam />

          {/* 1. Canonical Facts Table */}
          <section aria-labelledby="canonical-facts-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="canonical-facts-heading" className="text-xs font-mono uppercase tracking-widest text-violet font-semibold">
                Entity Facts &amp; System Parameters
              </h2>
              <span className="text-xs font-mono text-muted">Verified Schema</span>
            </div>

            <div className="overflow-hidden rounded-2xl border border-line surface-card">
              <div className="divide-y divide-line text-xs">
                {CANONICAL_FACTS.map((fact) => (
                  <div key={fact.key} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-2">
                    <div className="sm:w-1/3">
                      <span className="font-semibold text-fg">{fact.key}</span>
                      <span className="block text-[11px] text-faint font-mono">{fact.note}</span>
                    </div>
                    <div className="sm:w-2/3 font-mono text-muted sm:text-right">
                      <span className="text-fg font-medium">{fact.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* 2. Audio Signal Processing Pipeline */}
          <section aria-labelledby="pipeline-spec-heading" className="space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                Signal Chain Specification
              </span>
              <h2 id="pipeline-spec-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                The 5-Stage Web Audio Pipeline
              </h2>
              <p className="text-sm text-muted">
                How audio flows through client-side memory without ever making a network request.
              </p>
            </div>

            <div className="space-y-4">
              {ARCHITECTURE_PIPELINE.map((stage) => (
                <div key={stage.step} className="surface-card rounded-2xl border border-line p-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-line pb-2.5">
                    <h3 className="text-sm font-bold text-fg font-mono">
                      {stage.step}
                    </h3>
                    <span className="font-mono text-[11px] text-violet font-semibold bg-violet/10 border border-violet/20 px-2 py-0.5 rounded-md">
                      {stage.engine}
                    </span>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    {stage.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Boundaries and Honest Limitations */}
          <section aria-labelledby="boundaries-heading" className="space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                Honest System Boundaries
              </span>
              <h2 id="boundaries-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                Explicit Capabilities &amp; Non-Capabilities
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {SYSTEM_BOUNDARIES.map((item) => (
                <div key={item.title} className="surface-card rounded-2xl border border-line p-5 space-y-2.5">
                  <h3 className="text-sm font-bold text-fg">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {item.fact}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Creator & Brand Entity Links */}
          <section aria-labelledby="entity-links-heading" className="space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                Entity Attribution &amp; Verification
              </span>
              <h2 id="entity-links-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                Creators Behind Audify
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Nyxen */}
              <div className="surface-card rounded-2xl border border-line p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-fg">Nyxen</h3>
                  <span className="font-mono text-[10px] text-violet font-semibold bg-violet/10 border border-violet/20 px-2 py-0.5 rounded-md">
                    Lead Architect &amp; Studio
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Independent technology and product studio based in Mumbai, India. Responsible for Audify&apos;s Web Audio architecture, DSP engine code, UI design, and privacy enforcement.
                </p>
                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                  <a
                    href="https://nyxen.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-violet font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>nyxen.in</span>
                    <ArrowUpRight size={13} />
                  </a>
                  <a href="mailto:hello@nyxen.in" className="font-mono text-muted hover:text-fg">
                    hello@nyxen.in
                  </a>
                </div>
              </div>

              {/* Xpert Melody */}
              <div className="surface-card rounded-2xl border border-line p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-fg">Xpert Melody</h3>
                  <span className="font-mono text-[10px] text-amber-500 font-semibold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                    Creative Sound Partner
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Music curator and sound designer partner. Advises on signature acoustic curves, slowed+reverb soundscapes, 8D binaural parameters, and listening presets.
                </p>
                <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                  <a
                    href={siteConfig.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-500 font-semibold hover:underline inline-flex items-center gap-1"
                  >
                    <span>{siteConfig.youtubeHandle}</span>
                    <ArrowUpRight size={13} />
                  </a>
                  <span className="text-muted font-mono text-[11px]">YouTube Music Partner</span>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Navigation */}
          <section
            aria-labelledby="geo-cta-heading"
            className="rounded-3xl border border-line bg-gradient-to-b from-surface to-raised/60 p-8 sm:p-12 text-center space-y-6 shadow-md"
          >
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 id="geo-cta-heading" className="text-2xl sm:text-3xl font-extrabold text-fg">
                Inspect the Live Workstation
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Test the verified Web Audio DSP architecture directly in your browser tab.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="btn-gradient-primary rounded-xl px-7 text-white font-semibold shadow-md active:scale-95">
                <Link href="/studio">
                  <span>Open Audify Studio</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl border-line bg-surface text-fg font-medium">
                <Link href="/aeo">Read Technical Answers</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
