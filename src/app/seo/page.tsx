import type { Metadata } from "next";
import Link from "next/link";
import {
  MagnifyingGlass,
  Sliders,
  Waveform,
  ArrowRight,
  ArrowUpRight,
  LockKey,
  ShieldCheck,
  Cpu,
  FileAudio,
  CheckCircle,
  CaretRight,
  Lightning,
  Headphones,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { TOOLS_REGISTRY } from "@/config/tools-registry";
import { presets } from "@/config/presets";

export const metadata: Metadata = {
  title: "Audio Processing Directory & Tool Search Index — Audify",
  description:
    "Explore Audify's indexed directory of in-browser audio signal processing tools, acoustic presets, format conversions, and zero-cloud Web Audio capabilities.",
  keywords: [
    "in-browser audio tools",
    "web audio dsp",
    "online slowed and reverb",
    "8d audio generator",
    "browser bass booster",
    "audio format converter",
    "client-side audio editing",
    "vocal remover web audio",
    "lossless audio effects",
    "audify audio tools",
  ],
  alternates: {
    canonical: `${siteConfig.url}/seo`,
  },
  openGraph: {
    title: "Audio Processing Directory & Tool Search Index — Audify",
    description:
      "A complete, search-indexed directory of Audify's in-browser audio DSP capabilities, presets, format conversion options, and acoustic workflows.",
    url: `${siteConfig.url}/seo`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/images/audify-og.png`,
        width: 1200,
        height: 630,
        alt: "Audify Audio Processing & Tool Index",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Audio Processing Directory & Tool Search Index — Audify",
    description:
      "Indexed directory of Audify's browser-based audio DSP tools, acoustic presets, and zero-cloud processing.",
    creator: "@buildnyxen",
    images: [`${siteConfig.url}/images/audify-og.png`],
  },
};

const SEO_BREADCRUMBS_JSON_LD = {
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
      name: "Audio Tool Index",
      item: `${siteConfig.url}/seo`,
    },
  ],
};

const SEO_PAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  name: "Audify Audio Processing & Effects Directory",
  description:
    "An indexed directory of Audify's in-browser audio signal processing capabilities, acoustic presets, and dedicated workstation tools.",
  url: `${siteConfig.url}/seo`,
  publisher: {
    "@type": "Organization",
    name: "Nyxen",
    url: "https://nyxen.in",
  },
  mainEntity: {
    "@type": "ItemList",
    itemListElement: TOOLS_REGISTRY.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      description: tool.description,
      url: `${siteConfig.url}/tools/${tool.slug}`,
    })),
  },
};

const SUPPORTED_INPUT_FORMATS = [
  { ext: "MP3", desc: "MPEG-1 Audio Layer III (All bitrates up to 320 kbps)" },
  { ext: "WAV", desc: "Uncompressed PCM (16-bit, 24-bit, 32-bit Float)" },
  { ext: "FLAC", desc: "Free Lossless Audio Codec (Sample rates up to 96 kHz)" },
  { ext: "AAC", desc: "Advanced Audio Coding (M4A / MP4 container)" },
  { ext: "OGG", desc: "Ogg Vorbis Compressed Audio Container" },
  { ext: "AIFF", desc: "Audio Interchange File Format (Apple PCM)" },
];

const SUPPORTED_EXPORT_FORMATS = [
  { name: "WAV 32-bit Float", desc: "Maximum digital resolution with zero quantization loss. Ideal for DAW re-import." },
  { name: "MP3 (320 kbps)", desc: "Studio-grade psychoacoustic MP3 encoding with LAME VBR/CBR algorithms." },
  { name: "MP3 (192 kbps)", desc: "Balanced file size for web streaming and social media exports." },
  { name: "MP3 (128 kbps)", desc: "Compact footprint for rapid sharing and previews." },
];

const SEO_FAQ = [
  {
    q: "How does Audify process audio without server uploads?",
    a: "Audify utilizes the W3C Web Audio API built into your browser. When you select an audio file, it is decoded into client-side RAM (as an AudioBuffer) on your local CPU. Effects are applied through local Web Audio nodes, and output files are rendered via an OfflineAudioContext. Not a single sample of your audio is ever sent to a remote server.",
  },
  {
    q: "Does Audify offer website search engine optimization services?",
    a: "No. Audify is exclusively an in-browser audio transformation workstation and acoustic DSP platform. This index page catalogs our audio processing tools, acoustic presets, and file capabilities so creators can discover and understand our audio features through web search.",
  },
  {
    q: "What is the maximum audio file size supported?",
    a: "Audify supports audio files up to 10 MB per session. Because all processing happens inside browser memory, this limit guarantees lightning-fast loading, immediate waveform rendering, and stable exports without browser tab crashes.",
  },
  {
    q: "Are the effects destructive or non-destructive?",
    a: "Completely non-destructive. Your original audio file remains untouched on your disk. You can tweak parameters, swap presets in real time, compare wet and dry mixes, and only export when satisfied.",
  },
  {
    q: "What ensures audio doesn't distort when stacking heavy bass and reverb?",
    a: "Audify features a built-in look-ahead peak limiter and normalization stage clamped at −0.3 dBFS. Even with +15 dB bass shelves or high-feedback reverb convolutions, hot digital peaks are smoothly guarded against harsh digital clipping.",
  },
];

export default function SeoDirectoryPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SEO_BREADCRUMBS_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SEO_PAGE_JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-fg transition-colors">
              Home
            </Link>
            <CaretRight size={12} className="text-line-strong" />
            <span className="text-fg font-medium" aria-current="page">
              Audio Tool Search &amp; Directory
            </span>
          </nav>

          {/* Page Header */}
          <PageHeader
            eyebrow="Search &amp; Capabilities Index"
            title="Audio Processing Directory &amp; Feature Index"
            lead="An indexed reference of Audify's in-browser audio signal processing capabilities, acoustic presets, supported file formats, and zero-cloud Web Audio architecture."
            wide
          />

          {/* Clarity Disclaimer Banner */}
          <div className="rounded-2xl border border-line bg-surface/70 p-4 sm:p-5 flex items-start gap-3.5 text-xs text-muted leading-relaxed">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-violet border border-violet/20">
              <MagnifyingGlass size={18} weight="bold" />
            </div>
            <div className="space-y-1">
              <strong className="text-fg font-semibold block">About This Directory Page</strong>
              <p>
                This page catalogs Audify&apos;s audio-processing tools and acoustic capabilities for users searching the web for free in-browser audio effects. Audify is an audio creation platform engineered by{" "}
                <a href="https://nyxen.in" target="_blank" rel="noopener noreferrer" className="text-fg underline hover:text-violet">
                  Nyxen
                </a>{" "}
                and{" "}
                <a href={siteConfig.youtubeUrl} target="_blank" rel="noopener noreferrer" className="text-fg underline hover:text-violet">
                  Xpert Melody
                </a>
                ; we do not provide website SEO services.
              </p>
            </div>
          </div>

          <SectionSeam />

          {/* 1. Core Architecture Bento Strip */}
          <section aria-labelledby="core-capabilities-heading" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 id="core-capabilities-heading" className="text-xs font-mono uppercase tracking-widest text-violet font-semibold">
                Core Signal Specifications
              </h2>
              <span className="text-xs font-mono text-muted">Audify Engine v2.4</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
                <div className="flex items-center justify-between text-violet">
                  <LockKey size={20} weight="duotone" />
                  <span className="font-mono text-[10px] text-faint">CLIENT-SIDE</span>
                </div>
                <div className="font-mono text-2xl font-bold text-fg">100% In-Browser</div>
                <p className="text-xs text-muted leading-relaxed">
                  Decoded, filtered, and exported in local RAM. Zero audio data ever touches external servers.
                </p>
              </div>

              <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
                <div className="flex items-center justify-between text-primary">
                  <Cpu size={20} weight="duotone" />
                  <span className="font-mono text-[10px] text-faint">IEEE 754</span>
                </div>
                <div className="font-mono text-2xl font-bold text-fg">32-bit Float</div>
                <p className="text-xs text-muted leading-relaxed">
                  Internal calculations execute in 32-bit floating-point linear PCM to prevent mathematical quantization distortion.
                </p>
              </div>

              <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
                <div className="flex items-center justify-between text-amber-500">
                  <ShieldCheck size={20} weight="duotone" />
                  <span className="font-mono text-[10px] text-faint">SAFETY</span>
                </div>
                <div className="font-mono text-2xl font-bold text-fg">−0.3 dBFS</div>
                <p className="text-xs text-muted leading-relaxed">
                  Look-ahead peak limiter protects your speakers and headphones by enforcing headroom against clipping.
                </p>
              </div>

              <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
                <div className="flex items-center justify-between text-emerald-500">
                  <Lightning size={20} weight="duotone" />
                  <span className="font-mono text-[10px] text-faint">OFFLINE CONTEXT</span>
                </div>
                <div className="font-mono text-2xl font-bold text-fg">Up to 50× Speed</div>
                <p className="text-xs text-muted leading-relaxed">
                  OfflineAudioContext renders finished audio at accelerated rates using multi-threaded browser workers.
                </p>
              </div>
            </div>
          </section>

          {/* 2. Tool Directory Catalog */}
          <section aria-labelledby="tools-catalog-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                  Indexed Tool Directory
                </span>
                <h2 id="tools-catalog-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                  Dedicated In-Browser Audio Tools
                </h2>
                <p className="text-sm text-muted">
                  Each tool runs standalone in your browser tab with targeted parameters and instant previews.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
                <Link href="/tools" className="flex items-center gap-1.5">
                  <span>Explore Tools Hub</span>
                  <ArrowRight size={13} />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {TOOLS_REGISTRY.map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.slug}`}
                  className="group surface-card rounded-2xl border border-line p-5 flex flex-col justify-between space-y-4 transition-all duration-200 hover:border-violet/40 hover:shadow-md hover:-translate-y-0.5"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] uppercase font-semibold text-muted bg-raised border border-line px-2 py-0.5 rounded-md">
                        {tool.category}
                      </span>
                      <span className="font-mono text-[10px] text-violet font-semibold">
                        {tool.badge}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-fg group-hover:text-violet transition-colors flex items-center justify-between">
                      <span>{tool.name}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs text-muted leading-relaxed line-clamp-2">
                      {tool.tagline}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs text-muted">
                    <span className="font-mono text-[11px]">Web Audio DSP</span>
                    <span className="text-violet font-semibold group-hover:underline">Launch Tool →</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          {/* 3. Audio Presets Overview */}
          <section aria-labelledby="presets-overview-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-1">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                  Curated Acoustic Presets
                </span>
                <h2 id="presets-overview-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                  36+ Acoustic Sculpting Presets
                </h2>
                <p className="text-sm text-muted">
                  Hand-crafted DSP chains curated in partnership with Xpert Melody.
                </p>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-xl border-line text-xs font-semibold">
                <Link href="/presets" className="flex items-center gap-1.5">
                  <span>Browse All Presets</span>
                  <ArrowRight size={13} />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {presets.slice(0, 12).map((preset) => (
                <Link
                  key={preset.id}
                  href={`/presets?preset=${preset.id}`}
                  className="surface-card rounded-xl border border-line p-3.5 space-y-1 transition-all hover:border-violet/40 hover:bg-surface group"
                >
                  <div className="text-xs font-bold text-fg group-hover:text-violet transition-colors truncate">
                    {preset.name}
                  </div>
                  <p className="text-[11px] text-muted truncate">
                    {preset.category}
                  </p>
                </Link>
              ))}
            </div>
          </section>

          {/* 4. Supported Audio Formats Matrix */}
          <section aria-labelledby="formats-heading" className="space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                Format Specifications
              </span>
              <h2 id="formats-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                Supported Audio Containers &amp; Bitrates
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ingest Formats */}
              <div className="surface-card rounded-2xl border border-line p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <FileAudio size={18} className="text-primary" weight="duotone" />
                  <h3 className="text-sm font-mono uppercase font-bold text-fg">
                    Supported Import Formats (Up to 10 MB)
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs text-muted">
                  {SUPPORTED_INPUT_FORMATS.map((item) => (
                    <li key={item.ext} className="flex items-start gap-2.5">
                      <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" weight="fill" />
                      <div>
                        <strong className="text-fg font-semibold font-mono">{item.ext}:</strong>{" "}
                        <span>{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Export Formats */}
              <div className="surface-card rounded-2xl border border-line p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <Sliders size={18} className="text-violet" weight="duotone" />
                  <h3 className="text-sm font-mono uppercase font-bold text-fg">
                    Supported Export Options
                  </h3>
                </div>
                <ul className="space-y-2.5 text-xs text-muted">
                  {SUPPORTED_EXPORT_FORMATS.map((item) => (
                    <li key={item.name} className="flex items-start gap-2.5">
                      <CheckCircle size={15} className="text-emerald-500 shrink-0 mt-0.5" weight="fill" />
                      <div>
                        <strong className="text-fg font-semibold font-mono">{item.name}:</strong>{" "}
                        <span>{item.desc}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5. How Effects Are Applied Step-by-Step */}
          <section aria-labelledby="pipeline-heading" className="space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                Processing Workflow
              </span>
              <h2 id="pipeline-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                How Audify Processes Audio in Your Browser
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="surface-card rounded-2xl border border-line p-5 space-y-3">
                <div className="font-mono text-xs font-bold text-primary">01. INGEST &amp; DECODE</div>
                <h3 className="text-sm font-bold text-fg">Local Memory Buffer</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Audio file bytes are read directly into browser RAM via FileReader and decoded into multi-channel 32-bit float PCM buffers.
                </p>
              </div>

              <div className="surface-card rounded-2xl border border-line p-5 space-y-3">
                <div className="font-mono text-xs font-bold text-violet">02. DSP NODE GRAPH</div>
                <h3 className="text-sm font-bold text-fg">Hardware Audio Graph</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Web Audio nodes (convolvers, biquad filters, dynamics compressors, and stereo panners) execute mathematical filtering in real time.
                </p>
              </div>

              <div className="surface-card rounded-2xl border border-line p-5 space-y-3">
                <div className="font-mono text-xs font-bold text-amber-500">03. PEAK LIMITING</div>
                <h3 className="text-sm font-bold text-fg">Safety Normalization</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Look-ahead peak limiter analyzes amplitude excursions and clamps peak ceiling to −0.3 dBFS to prevent harsh digital clipping.
                </p>
              </div>

              <div className="surface-card rounded-2xl border border-line p-5 space-y-3">
                <div className="font-mono text-xs font-bold text-emerald-500">04. LOCAL EXPORT</div>
                <h3 className="text-sm font-bold text-fg">Fast File Packaging</h3>
                <p className="text-xs text-muted leading-relaxed">
                  OfflineAudioContext renders the finished stream at up to 50x playback speed and packages binary WAV/MP3 files for instant download.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Real Product FAQ */}
          <section aria-labelledby="faq-heading" className="space-y-6">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                Frequently Asked Questions
              </span>
              <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                Questions About Audify&apos;s Audio Capabilities
              </h2>
            </div>

            <div className="space-y-3">
              {SEO_FAQ.map((faq, idx) => (
                <div key={idx} className="surface-card rounded-2xl border border-line p-5 space-y-2">
                  <h3 className="text-sm font-bold text-fg flex items-center gap-2">
                    <span className="text-violet font-mono text-xs font-semibold">Q:</span>
                    <span>{faq.q}</span>
                  </h3>
                  <p className="text-xs text-muted leading-relaxed pl-5">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* 7. Conversion CTA */}
          <section
            aria-labelledby="cta-heading"
            className="rounded-3xl border border-line bg-gradient-to-b from-surface to-raised/60 p-8 sm:p-12 text-center space-y-6 shadow-md"
          >
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 id="cta-heading" className="text-2xl sm:text-3xl font-extrabold text-fg">
                Ready to transform your audio?
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Experience zero-cloud digital signal processing directly in your browser tab. No login, no server wait queues, 100% private.
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
                <Link href="/presets">Browse 36+ Presets</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
