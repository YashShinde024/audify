import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  XLogo,
  InstagramLogo,
  YoutubeLogo,
  Globe,
  EnvelopeSimple,
  Waveform,
  ShieldCheck,
  Cpu,
  Sparkle,
  Lightning,
  MusicNotes,
  LockKey,
  CheckCircle,
  Sliders,
  Heart,
  Headphones,
} from "@phosphor-icons/react/dist/ssr";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { AdBanner } from "@/components/advertising/ad-banner";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Audify & The Nyxen Ecosystem — Independent Digital Studio",
  description:
    "Discover the story behind Audify: engineered by Nyxen in creative partnership with Xpert Melody. Privacy-first, zero-cloud browser audio DSP built for modern creators.",
  alternates: {
    canonical: `${siteConfig.url}/about`,
  },
  openGraph: {
    title: "About Audify & The Nyxen Ecosystem",
    description:
      "Independent by design. Built with purpose. Learn who builds Audify, its music partnership with Xpert Melody, and the wider Nyxen product suite.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    type: "website",
  },
};

interface OtherProduct {
  name: string;
  url: string;
  tagline: string;
  description: string;
  logo: string;
  category: string;
  displayUrl: string;
  badge: string;
}

const NYXEN_PRODUCTS: OtherProduct[] = [
  {
    name: "Rankly",
    url: "https://rankly.nyxen.in/",
    displayUrl: "rankly.nyxen.in",
    category: "Web Intelligence",
    tagline: "Search & generative visibility engine",
    description:
      "Next-generation website intelligence for SEO, answer-engine readiness, and AI search platform citations.",
    logo: "/images/nyxen/rankly-logo.png",
    badge: "AI Search Analytics",
  },
  {
    name: "NyChat",
    url: "https://nychat.nyxen.in/",
    displayUrl: "nychat.nyxen.in",
    category: "Ephemeral Comms",
    tagline: "Private & disposable chat rooms",
    description:
      "Anonymous, end-to-end encrypted ephemeral messaging designed for quick conversations with zero stored logs.",
    logo: "/images/nyxen/nychat-logo.png",
    badge: "Zero-Knowledge Comms",
  },
  {
    name: "Venz AI",
    url: "https://venzai.tech/",
    displayUrl: "venzai.tech",
    category: "AI Productivity",
    tagline: "Prompt engineering workspace",
    description:
      "A developer workspace for prompt refinement, LLM evaluation pipelines, and high-performance agent workflows.",
    logo: "/images/nyxen/venz-logo.png",
    badge: "Prompt Engineering",
  },
];

interface NyxenSocial {
  platform: string;
  handle: string;
  url: string;
  description: string;
  badge: string;
  accentBorder: string;
  type: "x" | "instagram" | "youtube" | "producthunt" | "partner-yt" | "web";
}

const NYXEN_SOCIALS: NyxenSocial[] = [
  {
    platform: "X / Twitter",
    handle: "@buildnyxen",
    url: "https://x.com/buildnyxen",
    description: "Engineering dispatches, software release drops, architectural notes, and building in public.",
    badge: "Official Dispatches",
    accentBorder: "hover:border-fg/40",
    type: "x",
  },
  {
    platform: "Instagram",
    handle: "@buildnyxen",
    url: "https://instagram.com/buildnyxen",
    description: "Visual product previews, studio culture, audio DSP showcases, and modern UI aesthetic design.",
    badge: "Visuals & Studio",
    accentBorder: "hover:border-pink-500/40",
    type: "instagram",
  },
  {
    platform: "YouTube",
    handle: "@BuildNyxen",
    url: "https://youtube.com/@BuildNyxen",
    description: "Product walkthroughs, Web Audio architecture deep-dives, sound demos, and developer guides.",
    badge: "Media & Demos",
    accentBorder: "hover:border-red-500/40",
    type: "youtube",
  },
  {
    platform: "Product Hunt",
    handle: "Discover Audify on Product Hunt",
    url: siteConfig.productHuntUrl,
    description: "Community and product discovery hub. Explore features, share feedback, and join discussion with fellow audio creators.",
    badge: "Community Hub",
    accentBorder: "hover:border-[#FF6154]/50",
    type: "producthunt",
  },
  {
    platform: "Xpert Melody",
    handle: "@xpertmelody",
    url: "https://www.youtube.com/@xpertmelody",
    description: "Creative music curation partner behind Audify's slowed+reverb soundscapes and acoustics.",
    badge: "Creative Partner",
    accentBorder: "hover:border-red-500/40",
    type: "partner-yt",
  },
  {
    platform: "Nyxen Studio HQ",
    handle: "nyxen.in",
    url: "https://nyxen.in",
    description: "Official studio headquarters in Mumbai, India. Partnerships, collaborations, and client software.",
    badge: "Studio HQ",
    accentBorder: "hover:border-violet/40",
    type: "web",
  },
];

const TELEMETRY_BENCHMARKS = [
  {
    value: "100%",
    label: "Client-Side Processing",
    detail: "Zero bytes ever leave your device. All DSP runs locally in browser RAM.",
    icon: LockKey,
  },
  {
    value: "44+",
    label: "Acoustic Presets & Tools",
    detail: "Slowed+reverb, dynamic compressor, vocal remover, 8D audio, bitcrusher, format conversion, and tone shaping.",
    icon: Sliders,
  },
  {
    value: "0.00ms",
    label: "Server Upload Lag",
    detail: "OfflineAudioContext renders at up to 50x playback speed with multi-threaded PCM math.",
    icon: Lightning,
  },
  {
    value: "−0.3 dBFS",
    label: "Peak Limiter Ceiling",
    detail: "Built-in look-ahead peak limiting ensures zero digital distortion or harsh clipping.",
    icon: ShieldCheck,
  },
];

const PRINCIPLES = [
  {
    title: "Zero-Cloud Privacy",
    description:
      "Your audio files, creative stems, and listening material remain 100% on your machine. We never upload, store, or train algorithms on your data.",
    icon: LockKey,
    highlight: "Privacy by Architecture",
  },
  {
    title: "Democratic Acoustics",
    description:
      "High-end acoustic sculpting shouldn't require pricey DAW licenses or heavy installations. We bring studio-grade DSP to anyone with a modern browser.",
    icon: Headphones,
    highlight: "Zero Paywalls",
  },
  {
    title: "Honest Craft & Precision",
    description:
      "Built with precision Web Audio graph compilation, exact sample-rate conversion, and transparent technical boundaries you can trust.",
    icon: Cpu,
    highlight: "Pure Engineering",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-24">
        {/* ========================================================= */}
        {/* TOP BRAND HEADER — LOGO AT TOP, PILL BELOW LOGO           */}
        {/* ========================================================= */}
        <div className="flex flex-col items-start gap-4 pb-8 border-b border-line">
          <Link
            href="/"
            className="inline-flex items-center gap-3 transition-transform hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-violet rounded-xl"
            aria-label="Audify Home"
          >
            <Logo variant="by-nyxen" height={64} priority />
          </Link>

          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-3.5 py-1.5 text-xs text-muted backdrop-blur-sm shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet" />
            </span>
            <span className="font-semibold text-fg">Independent Web Audio Studio</span>
            <span className="text-line-strong" aria-hidden="true">·</span>
            <span className="font-mono text-[11px] text-faint">Nyxen × Xpert Melody</span>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 1: HERO — BOLD EDITORIAL MANIFESTO                */}
        {/* ========================================================= */}
        <section aria-labelledby="about-hero-heading" className="space-y-8">
          {/* Main Title & Subtitle */}
          <div className="space-y-5 max-w-3xl">
            <h1
              id="about-hero-heading"
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-fg text-balance leading-[1.12]"
            >
              Sound engineering liberated from the cloud.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-muted leading-relaxed text-balance">
              Audify is a high-performance, in-browser digital signal processing platform created by{" "}
              <strong className="text-fg font-semibold">Nyxen</strong> in artistic partnership with{" "}
              <strong className="text-fg font-semibold">Xpert Melody</strong>. We craft focused audio tools that give artists, producers, and audiophiles total creative freedom without paywalls, accounts, or tracking.
            </p>
          </div>

          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="btn-gradient-primary btn-sweep-reverse rounded-xl px-6 h-11 text-white font-semibold shadow-md active:scale-95 group"
            >
              <Link href="/studio">
                <span>Launch Audify Studio</span>
                <ArrowRight size={14} weight="bold" className="btn-arrow transition-transform duration-200" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-5 h-11 border-line bg-surface hover:bg-raised text-fg font-medium"
            >
              <a
                href="https://x.com/buildnyxen"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <XLogo size={16} weight="bold" />
                <span>Follow @buildnyxen</span>
              </a>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="rounded-xl px-4 h-11 text-muted hover:text-fg font-medium"
            >
              <a
                href="https://yashshinde.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5"
              >
                <span>Developed by Yash Shinde</span>
                <ArrowUpRight size={13} />
              </a>
            </Button>
          </div>
        </section>

        {/* Ad Placement 1: Below hero action row */}
        <AdBanner id="about-intro-action" className="mx-auto" />

        {/* ========================================================= */}
        {/* SECTION 2: TELEMETRY & CAPABILITIES BENTO STRIP           */}
        {/* ========================================================= */}
        <section aria-labelledby="telemetry-heading" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 id="telemetry-heading" className="text-xs font-mono uppercase tracking-widest text-violet font-semibold">
              Platform Architecture & Metrics
            </h2>
            <span className="text-xs font-mono text-muted">Audify v2.4 Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TELEMETRY_BENCHMARKS.map((bench) => {
              const Icon = bench.icon;
              return (
                <div
                  key={bench.label}
                  className="surface-card relative overflow-hidden rounded-2xl border border-line p-5 transition-all duration-200 hover:border-violet/40 hover:shadow-md"
                >
                  <div className="flex items-center justify-between text-muted mb-3">
                    <Icon size={20} className="text-violet" weight="duotone" />
                    <span className="font-mono text-[10px] text-faint">VERIFIED</span>
                  </div>
                  <div className="font-mono text-3xl font-extrabold text-fg tracking-tight">
                    {bench.value}
                  </div>
                  <div className="mt-1 text-xs font-semibold text-fg">
                    {bench.label}
                  </div>
                  <p className="mt-1.5 text-xs text-muted leading-relaxed">
                    {bench.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 3: THE AUDIFY STORY & ARCHITECTURE BLUEPRINT      */}
        {/* ========================================================= */}
        <section aria-labelledby="story-heading" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Narrative */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6 surface-card rounded-2xl border border-line p-7 sm:p-9">
              <div className="space-y-4">
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-primary">
                  The Story &amp; Philosophy
                </span>
                <h2 id="story-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                  Why we engineered Audify
                </h2>
                <div className="space-y-3 text-sm sm:text-base text-muted leading-relaxed">
                  <p>
                    For years, creative audio effects like <strong className="text-fg font-medium">Slowed + Reverb</strong>, <strong className="text-fg font-medium">8D Audio</strong>, and <strong className="text-fg font-medium">432 Hz pitch shifting</strong> were locked behind cumbersome DAW plugins or shady conversion websites riddled with intrusive ads, server wait queues, and audio recompression.
                  </p>
                  <p>
                    We asked a straightforward engineering question: <em className="text-fg italic">Why send your music across the internet when modern web browsers already contain industrial-grade Web Audio signal processors?</em>
                  </p>
                  <p>
                    Audify was born out of that challenge. By combining low-level audio node graphs, client-side memory decoding, and studio-grade peak normalization, Audify transforms any browser tab into an instant, private audio sculpting workstation.
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-line flex flex-wrap items-center gap-6 text-xs text-muted">
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" weight="fill" />
                  <span>No login required</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" weight="fill" />
                  <span>Zero cloud uploads</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle size={16} className="text-emerald-500" weight="fill" />
                  <span>Lossless 32-bit float</span>
                </div>
              </div>
            </div>

            {/* Right Architecture Console Blueprint */}
            <div className="lg:col-span-5 studio-hardware-dark rounded-2xl border border-line-strong p-6 sm:p-7 flex flex-col justify-between space-y-6 shadow-xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-fg">
                      Local DSP Pipeline
                    </span>
                  </div>
                  <span className="font-mono text-[10px] text-faint">Web Audio API</span>
                </div>

                {/* Pipeline Nodes */}
                <div className="space-y-3 font-mono text-xs">
                  <div className="rounded-xl border border-line bg-canvas p-3 space-y-1">
                    <div className="flex items-center justify-between text-primary font-bold">
                      <span>01. Ingest &amp; Float32 PCM</span>
                      <span className="text-[10px] text-muted">Client RAM</span>
                    </div>
                    <p className="text-[11px] text-muted font-sans leading-normal">
                      Native AudioContext decodes MP3/WAV/FLAC into high-precision multi-channel PCM buffers.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-canvas p-3 space-y-1">
                    <div className="flex items-center justify-between text-violet font-bold">
                      <span>02. Graph Node Matrix</span>
                      <span className="text-[10px] text-muted">Web Audio Graph</span>
                    </div>
                    <p className="text-[11px] text-muted font-sans leading-normal">
                      ConvolverNode, BiquadFilter, DynamicsCompressor, and StereoPanner execute procedural DSP.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-canvas p-3 space-y-1">
                    <div className="flex items-center justify-between text-amber-500 font-bold">
                      <span>03. Limiter &amp; Normalization</span>
                      <span className="text-[10px] text-muted">Safety Ceiling</span>
                    </div>
                    <p className="text-[11px] text-muted font-sans leading-normal">
                      Look-ahead peak limiter strictly clamps hot outputs to −0.3 dBFS to prevent clipping distortion.
                    </p>
                  </div>

                  <div className="rounded-xl border border-line bg-canvas p-3 space-y-1">
                    <div className="flex items-center justify-between text-emerald-500 font-bold">
                      <span>04. Instant Stream Packaging</span>
                      <span className="text-[10px] text-muted">Zero Cloud</span>
                    </div>
                    <p className="text-[11px] text-muted font-sans leading-normal">
                      Pure client-side binary WAV and MP3 encoding ready for immediate offline download.
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-faint font-mono text-center pt-2">
                100% In-Browser Execution · Audify DSP Kernel
              </div>
            </div>
          </div>
        </section>

        {/* Ad Placement 2: Between architecture telemetry and studio story */}
        <AdBanner id="about-principles-tech" className="mx-auto" />

        {/* ========================================================= */}
        {/* SECTION 4: ABOUT NYXEN — INDEPENDENT DIGITAL STUDIO       */}
        {/* ========================================================= */}
        <section aria-labelledby="nyxen-studio-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                The Studio Behind Audify
              </span>
              <h2 id="nyxen-studio-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                About Nyxen
              </h2>
              <p className="text-sm text-muted">
                An independent technology studio engineering privacy-first digital tools from Mumbai, India.
              </p>
            </div>

            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline underline-offset-4 shrink-0"
            >
              <span>Visit nyxen.in</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Card: Nyxen Studio Brand & Logo Card */}
            <div className="lg:col-span-5 surface-card rounded-2xl border border-line p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all duration-200 hover:border-violet/40 hover:shadow-lg">
              <div className="space-y-6">
                {/* Logo Frame */}
                <div className="relative overflow-hidden rounded-2xl border border-line bg-surface/80 p-6 flex flex-col items-center justify-center text-center shadow-xs">
                  <div className="relative w-48 h-32 sm:w-56 sm:h-36 flex items-center justify-center">
                    <Image
                      src="/images/nyxen/nyxen-logo.png"
                      alt="Nyxen Studio Logo"
                      width={240}
                      height={160}
                      className="max-h-28 w-auto object-contain transition-transform duration-300 hover:scale-105"
                      priority
                    />
                  </div>
                  <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[11px] font-mono text-violet font-semibold">
                    <span>Innovate · Build · Empower</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="text-lg font-bold text-fg">
                    Independent Product Engineering
                  </h3>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    Nyxen is a Mumbai-based independent software studio founded to build modern, purposeful tools for creators, developers, and thinkers. Free from venture capital pressures, tracking monetization, and artificial paywalls, Nyxen operates with a simple mandate: engineer software that runs fast, respects privacy, and solves real problems.
                  </p>
                </div>
              </div>

              {/* Studio HQ & Verification */}
              <div className="pt-4 border-t border-line space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Studio Headquarters</span>
                  <span className="font-semibold text-fg">Mumbai, Maharashtra, India</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Studio Model</span>
                  <span className="font-mono text-emerald-500 font-semibold">Self-Funded &amp; Independent</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Primary Focus</span>
                  <span className="text-fg font-medium">Edge &amp; In-Browser DSP Systems</span>
                </div>
              </div>
            </div>

            {/* Right Card: Studio Philosophies & Official Verified Channels */}
            <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
              {/* Studio Ethos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
                  <div className="flex items-center gap-2 text-violet">
                    <LockKey size={18} weight="duotone" />
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
                      Zero Telemetry
                    </h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Heavy compute belongs on user hardware, not remote cloud servers. Audify processes 100% of audio in your browser with zero remote transmission.
                  </p>
                </div>

                <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <Cpu size={18} weight="duotone" />
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
                      First-Principles Code
                    </h4>
                  </div>
                  <p className="text-xs text-muted leading-relaxed">
                    Direct Web Audio graphs, native float32 arrays, and clean TypeScript architectures built for maximum performance and instant feedback.
                  </p>
                </div>
              </div>

              {/* Official Verified Channels Box */}
              <div className="surface-card rounded-2xl border border-line p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-line pb-3">
                  <div className="flex items-center gap-2">
                    <EnvelopeSimple size={18} className="text-violet" weight="duotone" />
                    <h4 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
                      Official Communications &amp; Direct Desks
                    </h4>
                  </div>
                  <span className="rounded bg-violet/10 border border-violet/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-violet">
                    Verified nyxen.in
                  </span>
                </div>

                <p className="text-xs text-muted leading-relaxed">
                  We don&apos;t use anonymous ticketing systems or outsourced support. Reach our engineers directly at our three official desks:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <a
                    href="mailto:hello@nyxen.in"
                    className="group rounded-xl border border-line bg-canvas p-3.5 space-y-1 transition-all hover:border-violet/50 hover:bg-surface"
                  >
                    <div className="text-[11px] font-mono text-muted uppercase font-semibold">
                      General Desk
                    </div>
                    <div className="text-xs font-bold text-fg group-hover:text-violet transition-colors">
                      hello@nyxen.in
                    </div>
                    <p className="text-[10px] text-faint">
                      General inquiries, feedback &amp; press
                    </p>
                  </a>

                  <a
                    href="mailto:support@nyxen.in"
                    className="group rounded-xl border border-line bg-canvas p-3.5 space-y-1 transition-all hover:border-violet/50 hover:bg-surface"
                  >
                    <div className="text-[11px] font-mono text-muted uppercase font-semibold">
                      Customer Support
                    </div>
                    <div className="text-xs font-bold text-fg group-hover:text-violet transition-colors">
                      support@nyxen.in
                    </div>
                    <p className="text-[10px] text-faint">
                      Technical help, issues &amp; user support
                    </p>
                  </a>

                  <a
                    href="mailto:build@nyxen.in"
                    className="group rounded-xl border border-line bg-canvas p-3.5 space-y-1 transition-all hover:border-violet/50 hover:bg-surface"
                  >
                    <div className="text-[11px] font-mono text-muted uppercase font-semibold">
                      Studio Builds
                    </div>
                    <div className="text-xs font-bold text-fg group-hover:text-violet transition-colors">
                      build@nyxen.in
                    </div>
                    <p className="text-[10px] text-faint">
                      Partnerships &amp; custom software builds
                    </p>
                  </a>
                </div>
              </div>

              {/* Studio Dispatch Strip */}
              <div className="rounded-xl border border-line bg-surface/60 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-muted">
                  <Sparkle size={15} className="text-amber-500" weight="fill" />
                  <span>Public Dispatches &amp; Engineering Updates:</span>
                  <a
                    href="https://x.com/buildnyxen"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-fg hover:text-violet underline underline-offset-2"
                  >
                    @buildnyxen
                  </a>
                </div>
                <a
                  href="https://nyxen.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-violet hover:underline flex items-center gap-1"
                >
                  <span>Explore Nyxen HQ</span>
                  <ArrowUpRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 5: CREATIVE SOUND PARTNERSHIP                     */}
        {/* ========================================================= */}
        <section aria-labelledby="partnership-heading" className="space-y-4">
          <AdBanner
            id="about-partnership"
            className="mx-auto"
            note="Audify stays free for creators — placement supported."
          />

          <div className="space-y-1">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
              Creative Sound Partner
            </span>
            <h2 id="partnership-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
              Acoustic Curation &amp; Sound Design
            </h2>
          </div>

          <div className="surface-card rounded-2xl border border-line p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shadow-xs">
                <MusicNotes size={22} weight="duotone" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-fg">Xpert Melody</h3>
                  <span className="rounded bg-raised px-2 py-0.5 text-[10px] font-mono font-medium text-muted border border-line">
                    Creative Sound Partner
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed max-w-xl">
                  Creative curator advising on Audify&apos;s slowed+reverb soundscapes, 8D spatial curves, and acoustic listening presets.
                </p>
              </div>
            </div>

            <a
              href={siteConfig.youtubeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface hover:bg-raised px-4 py-2 text-xs font-semibold text-fg transition-all shrink-0 cursor-pointer shadow-xs"
            >
              <YoutubeLogo size={15} weight="fill" className="text-red-500" />
              <span>@xpertmelody</span>
              <ArrowUpRight size={13} className="text-muted" />
            </a>
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 6: NYXEN STUDIO PRINCIPLES                        */}
        {/* ========================================================= */}
        <section aria-labelledby="principles-heading" className="space-y-6">
          <div className="space-y-1">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
              Guiding Engineering Principles
            </span>
            <h2 id="principles-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
              Built with purpose. Kept independent.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRINCIPLES.map((principle) => {
              const Icon = principle.icon;
              return (
                <div
                  key={principle.title}
                  className="surface-card rounded-2xl border border-line p-6 flex flex-col justify-between space-y-5 transition-all duration-200 hover:border-violet/40 hover:shadow-md"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet/10 border border-violet/20 text-violet shadow-xs">
                        <Icon size={22} weight="duotone" />
                      </div>
                      <span className="font-mono text-[10px] uppercase font-semibold text-violet bg-violet/10 border border-violet/20 px-2 py-0.5 rounded-full">
                        {principle.highlight}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-fg">
                      {principle.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted leading-relaxed">
                      {principle.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-line/60 flex items-center gap-1.5 text-[11px] font-mono text-muted">
                    <CheckCircle size={14} className="text-emerald-500" weight="fill" />
                    <span>Non-negotiable studio standard</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 7: THE NYXEN PRODUCT LINEUP                       */}
        {/* ========================================================= */}
        <section aria-labelledby="ecosystem-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                The Product Lineup
              </span>
              <h2 id="ecosystem-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                The Nyxen Software Ecosystem
              </h2>
              <p className="text-sm text-muted">
                Focused, privacy-conscious tools engineered for specific tasks on the modern web.
              </p>
            </div>

            <a
              href="https://nyxen.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline underline-offset-4 shrink-0"
            >
              <span>Explore all Nyxen tools</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {NYXEN_PRODUCTS.map((product) => (
              <a
                key={product.name}
                href={product.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group surface-card flex flex-col justify-between rounded-2xl border border-line p-6 transition-all duration-200 hover:border-violet/50 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-canvas p-2 shadow-xs group-hover:border-violet/40 transition-colors">
                      <Image
                        src={product.logo}
                        alt={`${product.name} logo`}
                        width={40}
                        height={40}
                        className="h-8 w-auto object-contain rounded-lg"
                      />
                    </div>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider bg-raised border border-line px-2 py-0.5 rounded-md">
                      {product.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-fg group-hover:text-violet transition-colors flex items-center gap-1.5">
                      <span>{product.name}</span>
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <p className="text-xs font-medium text-muted mt-0.5">
                      {product.tagline}
                    </p>
                    <p className="text-xs text-muted mt-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3.5 border-t border-line flex items-center justify-between text-xs font-semibold text-violet">
                  <span>Visit website</span>
                  <span className="font-mono text-[11px] text-muted group-hover:text-violet">
                    {product.displayUrl}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ========================================================= */}
        {/* SECTION 8: OFFICIAL NYXEN SOCIALS & COMMUNITY             */}
        {/* ========================================================= */}
        <section aria-labelledby="socials-heading" className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-violet">
                Connect &amp; Follow
              </span>
              <h2 id="socials-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">
                Official Nyxen Channels
              </h2>
              <p className="text-sm text-muted">
                Follow along with our engineering updates, product launches, sound curation, and studio dispatches.
              </p>
            </div>

            <a
              href="https://nyxen.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-violet hover:underline underline-offset-4 shrink-0"
            >
              <span>Visit nyxen.in</span>
              <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NYXEN_SOCIALS.map((social) => (
              <a
                key={social.platform}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group surface-card flex flex-col justify-between rounded-2xl border border-line p-5 transition-all duration-200 ${social.accentBorder} hover:shadow-md hover:-translate-y-0.5`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-canvas text-fg shadow-2xs group-hover:border-violet/40 transition-colors">
                        {social.type === "x" && <XLogo size={18} weight="bold" />}
                        {social.type === "instagram" && <InstagramLogo size={18} weight="bold" className="text-pink-500" />}
                        {(social.type === "youtube" || social.type === "partner-yt") && (
                          <YoutubeLogo size={18} weight="fill" className="text-red-500" />
                        )}
                        {social.type === "producthunt" && (
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6154] text-white text-[10px] font-black leading-none">
                            P
                          </span>
                        )}
                        {social.type === "web" && <Globe size={18} />}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-fg group-hover:text-violet transition-colors">
                          {social.platform}
                        </h3>
                        <span className="font-mono text-[11px] text-muted">
                          {social.handle}
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono uppercase text-muted tracking-wider bg-raised border border-line px-2 py-0.5 rounded-md">
                      {social.badge}
                    </span>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {social.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs font-semibold text-violet">
                  <span>Open channel</span>
                  <ArrowUpRight size={13} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* Ad Placement 4: Between specifications/channels and final CTA */}
        <AdBanner id="about-specs-cta" className="mx-auto" />

        {/* ========================================================= */}
        {/* SECTION 9: FINAL IMMERSIVE STUDIO INVITATION              */}
        {/* ========================================================= */}
        <section
          aria-labelledby="about-cta-heading"
          className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-surface/80 to-raised/60 p-8 sm:p-12 lg:p-16 text-center space-y-6 shadow-lg"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-3.5 py-1 text-xs font-mono text-violet font-semibold">
            Ready to craft your sound?
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 id="about-cta-heading" className="text-3xl sm:text-4xl font-extrabold tracking-tight text-fg">
              Experience the Audify Workstation.
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              No registration. No wait times. Experience genuine client-side audio DSP right now in your browser.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              asChild
              size="lg"
              className="btn-gradient-primary btn-sweep-offset-a rounded-xl px-7 h-12 text-white font-semibold shadow-md active:scale-95 group"
            >
              <Link href="/studio">
                <span>Open Audify Studio</span>
                <ArrowRight size={14} weight="bold" className="btn-arrow transition-transform duration-200" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-xl px-6 h-12 border-line bg-surface hover:bg-raised text-fg font-medium"
            >
              <Link href="/presets">Browse All 36+ Presets</Link>
            </Button>
          </div>

          <div className="pt-6 border-t border-line/60 flex flex-wrap items-center justify-center gap-1.5 text-xs text-faint font-mono">
            <span>Audify by Nyxen</span>
            <span aria-hidden="true">×</span>
            <span>Xpert Melody</span>
            <span aria-hidden="true">·</span>
            <a
              href="https://yashshinde.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-fg transition-colors"
            >
              <span>Developed by Yash Shinde</span>
              <ArrowUpRight size={11} />
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
