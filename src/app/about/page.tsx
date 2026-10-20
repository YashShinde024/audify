import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkle,
  ShieldCheck,
  Waveform,
  MicrophoneStage,
  ArrowRight,
  GlobeHemisphereWest,
  Code,
  EnvelopeSimple,
  ChatCircleDots,
  ChartLineUp,
  TerminalWindow,
  Sliders,
  Cpu,
  Package,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { YouTubeIcon } from "@/components/icons/preset-icons";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About AudioMorph — Developed by Nyxen · Music Expertise by Xpert Melody",
  description:
    "Discover AudioMorph: the browser-native, privacy-first audio DSP studio developed by Nyxen with sound design and music expertise by Xpert Melody. Explore the Nyxen product ecosystem.",
  keywords: [
    "AudioMorph",
    "About AudioMorph",
    "Nyxen",
    "nyxen.in",
    "Xpert Melody",
    "xpertmelody",
    "Nyxen ecosystem",
    "Nychat",
    "Rankly",
    "Venz",
    "browser audio effects",
    "Web Audio API DSP",
    "client-side audio processing",
  ],
  openGraph: {
    title: "About AudioMorph — Developed by Nyxen · Music Expertise by Xpert Melody",
    description:
      "The engineering, acoustic artistry, and sibling product ecosystem behind AudioMorph. Co-built for creators who demand pristine sound and absolute client-side privacy.",
    url: `${siteConfig.url}/about`,
    siteName: siteConfig.name,
    type: "profile",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "About AudioMorph Audio Processing Studio",
    "DC.creator": siteConfig.attribution,
  },
};

const JSON_LD_ABOUT = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": `${siteConfig.url}/about`,
      "url": `${siteConfig.url}/about`,
      "name": "About AudioMorph Audio Processing",
      "description":
        "Overview of AudioMorph, lead engineer Nyxen (nyxen.in), sound designer Xpert Melody, and its client-side Web Audio DSP architecture.",
      "about": {
        "@type": "SoftwareApplication",
        "name": "AudioMorph",
        "applicationCategory": "MultimediaApplication",
        "operatingSystem": "All modern web browsers",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
      },
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#nyxen`,
      "name": "Nyxen",
      "url": "https://nyxen.in",
      "jobTitle": "Lead Software Architect & DSP Engineer",
      "email": "contact@nyxen.in",
      "description":
        "Lead developer and architect of AudioMorph and founder of nyxen.in. Creator of Nychat, Rankly, and Venz.",
    },
    {
      "@type": "Person",
      "@id": `${siteConfig.url}/#xpertmelody`,
      "name": "Xpert Melody",
      "jobTitle": "Music Producer & Sound Designer",
      "url": "https://www.youtube.com/@xpertmelody",
      "sameAs": ["https://www.youtube.com/@xpertmelody"],
      "description":
        "Music producer and sound designer behind Xpert Melody YouTube channel. Co-creator of AudioMorph signature acoustic presets and spatial panning curves.",
    },
  ],
};

const SIBLING_PRODUCTS = [
  {
    name: "AudioMorph",
    tagline: "Sound, reimagined.",
    badge: "Current Product",
    desc: "100% in-browser Web Audio DSP workstation. Sculpt slowed+reverb, 8D audio, and heavy bass with zero cloud uploads.",
    creator: "Developed by Nyxen · Sound by Xpert Melody",
    link: "/studio",
    isInternal: true,
    icon: Waveform,
    color: "text-accent",
    bg: "bg-accent/10 border-accent/25",
  },
  {
    name: "Nychat",
    tagline: "Next-gen intelligent conversation",
    badge: "AI Ecosystem",
    desc: "Autonomous conversational AI workspace and multi-agent assistant built for developers, creators, and power teams.",
    creator: "By Nyxen",
    link: "https://nyxen.in",
    isInternal: false,
    icon: ChatCircleDots,
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/25",
  },
  {
    name: "Rankly",
    tagline: "Autonomous Generative Engine Optimization",
    badge: "Intelligence",
    desc: "AEO and GEO intelligence platform tracking and scaling visibility across modern AI answer engines like ChatGPT and Claude.",
    creator: "By Nyxen",
    link: "https://nyxen.in",
    isInternal: false,
    icon: ChartLineUp,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/25",
  },
  {
    name: "Venz",
    tagline: "Developer Infrastructure & Tooling",
    badge: "DevOps & Cloud",
    desc: "Lightweight, ultra-fast cloud developer toolkit for microservice provisioning, continuous deployment, and telemetry.",
    creator: "By Nyxen",
    link: "https://nyxen.in",
    isInternal: false,
    icon: TerminalWindow,
    color: "text-violet-500",
    bg: "bg-violet-500/10 border-violet-500/25",
  },
  {
    name: "Xpert Melody IR Vault",
    tagline: "Acoustic Impulse & Space Matrix",
    badge: "Sound Design",
    desc: "Curated impulse response collection modeling iconic acoustic spaces, lush cathedral decays, and warm vintage plates.",
    creator: "By Xpert Melody",
    link: siteConfig.youtubeUrl,
    isInternal: false,
    icon: Sliders,
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/25",
  },
  {
    name: "Xpert Melody Sonic Academy",
    tagline: "Music Production & Sound Education",
    badge: "Community & Video",
    desc: "Comprehensive mixing breakdowns, 8D audio spatial arrangement guides, and slowed+reverb production masterclasses on YouTube.",
    creator: "By Xpert Melody",
    link: siteConfig.youtubeUrl,
    isInternal: false,
    icon: MicrophoneStage,
    color: "text-red-500",
    bg: "bg-red-500/10 border-red-500/25",
  },
];

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ABOUT) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <PageHeader
            eyebrow="Vision & Creators"
            title="Sound, Reimagined."
            lead="AudioMorph is an ultra-fast, local-first audio DSP studio. Developed by Nyxen with signature acoustic sound design by Xpert Melody."
          />

          <SectionSeam />

          {/* Executive Summary Block */}
          <section
            aria-label="Summary overview"
            className="surface-card glass-panel rounded-2xl border-primary/25 bg-primary/5 p-6 sm:p-7 space-y-3"
          >
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>Executive Overview</span>
            </div>
            <p className="text-sm leading-relaxed text-fg/90">
              <strong>AudioMorph</strong> is an in-browser audio DSP platform engineered by <strong>Nyxen</strong> with
              sound curation by music producer <strong>Xpert Melody</strong>. Unlike cloud services that ingest and store
              creative stems on remote server clusters, AudioMorph executes 100% of its filtering, harmonic pitch transposition,
              binaural 8D orbits, and file encoding locally in client tab memory. Zero data harvesting, zero server wait queues,
              and 100% free.
            </p>
          </section>

          {/* Sibling Products & Ecosystem Section */}
          <section aria-labelledby="ecosystem-heading" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <p className="eyebrow text-primary">Ecosystem & Portfolio</p>
                <h2 id="ecosystem-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg mt-1">
                  Products by Nyxen &amp; Xpert Melody
                </h2>
              </div>
              <a
                href="https://nyxen.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline font-mono"
              >
                <span>Explore all nyxen.in products</span>
                <ArrowRight size={12} weight="bold" />
              </a>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {SIBLING_PRODUCTS.map((prod) => {
                const Icon = prod.icon;
                return (
                  <div
                    key={prod.name}
                    className="surface-card glass-panel rounded-2xl p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl border", prod.bg, prod.color)}>
                          <Icon size={20} weight="duotone" />
                        </div>
                        <span className="rounded-full bg-surface border border-line px-2.5 py-0.5 text-[10px] font-mono font-medium text-muted">
                          {prod.badge}
                        </span>
                      </div>

                      <h3 className="text-sm font-bold text-fg flex items-center gap-1.5">
                        {prod.name}
                      </h3>
                      <p className="text-[11px] font-medium text-accent mt-0.5">{prod.tagline}</p>
                      <p className="text-xs text-muted leading-relaxed mt-2">{prod.desc}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-faint">{prod.creator}</span>
                      {prod.isInternal ? (
                        <Link
                          href={prod.link}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>Open Studio</span>
                          <ArrowRight size={11} weight="bold" />
                        </Link>
                      ) : (
                        <a
                          href={prod.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                        >
                          <span>Learn more ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Creators Deep Dive: Nyxen & Xpert Melody */}
          <section aria-labelledby="creators-heading" className="space-y-6">
            <div>
              <p className="eyebrow text-primary">The Creative Partnership</p>
              <h2 id="creators-heading" className="text-2xl sm:text-3xl font-bold tracking-tight text-fg mt-1">
                Developed by Nyxen · Music by Xpert Melody
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Nyxen Profile */}
              <div className="surface-card glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-primary/40 transition-colors">
                <div className="space-y-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 border border-primary/25 text-primary">
                    <Code size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg">Nyxen</h3>
                    <p className="text-xs font-mono text-primary">Lead Software Architect &amp; Systems Engineer</p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    Nyxen architects the browser-native DSP pipelines and client-side systems powering AudioMorph.
                    Specializing in the W3C Web Audio API, high-throughput OfflineAudioContext graphs, and in-memory
                    PCM encoding (WAV, LAME MP3, AIFF), Nyxen engineered AudioMorph to deliver studio fidelity
                    without third-party cloud exposure.
                  </p>
                </div>

                <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                  <a
                    href="https://nyxen.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors font-mono"
                  >
                    <span>nyxen.in Portal ↗</span>
                    <ArrowRight size={12} weight="bold" />
                  </a>
                  <a
                    href="mailto:contact@nyxen.in"
                    className="text-[11px] text-faint hover:text-fg font-mono inline-flex items-center gap-1"
                    title="Direct email: contact@nyxen.in"
                  >
                    <EnvelopeSimple size={12} />
                    <span>contact@nyxen.in</span>
                  </a>
                </div>
              </div>

              {/* Xpert Melody Profile */}
              <div className="surface-card glass-panel rounded-2xl p-6 flex flex-col justify-between space-y-5 hover:border-red-500/40 transition-colors">
                <div className="space-y-3.5">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                    <MicrophoneStage size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg">Xpert Melody</h3>
                    <p className="text-xs font-mono text-red-500">Music Producer &amp; Acoustic Curator</p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    Xpert Melody is an acclaimed music producer and sound designer whose YouTube channel has inspired
                    millions across the music community with viral slowed+reverb edits, 8D audio spatial orbits,
                    and acoustic transformations. At AudioMorph, Xpert Melody curates and fine-tunes all signature presets,
                    EQ curves, and reverberant room impulses for optimal emotional and sonic resonance.
                  </p>
                </div>

                <div className="pt-3 border-t border-line/60 flex items-center justify-between">
                  <a
                    href={siteConfig.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
                  >
                    <YouTubeIcon size={16} />
                    <span>Xpert Melody Channel</span>
                    <ArrowRight size={12} weight="bold" />
                  </a>
                  <span className="text-[11px] text-faint font-mono">@xpertmelody</span>
                </div>
              </div>
            </div>
          </section>

          {/* Philosophy & Architecture */}
          <section aria-labelledby="philosophy-heading" className="space-y-6">
            <div>
              <p className="eyebrow text-primary">Core Engineering Philosophy</p>
              <h2 id="philosophy-heading" className="text-xl sm:text-2xl font-bold tracking-tight text-fg mt-1">
                Why Local In-Browser Audio DSP Matters
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="surface-card glass-panel rounded-2xl p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-raised text-primary mb-2">
                  <ShieldCheck size={20} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">Zero-Upload Privacy</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Your raw music tracks never leave your computer. Audio is decoded into RAM, rendered by your CPU,
                  and exported without remote servers ever observing a single byte.
                </p>
              </div>

              <div className="surface-card glass-panel rounded-2xl p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-raised text-primary mb-2">
                  <Waveform size={20} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">32-Bit Float Dynamic Range</h3>
                <p className="text-xs text-muted leading-relaxed">
                  All signal processing occurs in IEEE 754 32-bit floating point, providing virtually unlimited internal
                  headroom before our lookahead peak limiter safely catches clipping.
                </p>
              </div>

              <div className="surface-card glass-panel rounded-2xl p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-raised text-primary mb-2">
                  <GlobeHemisphereWest size={20} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">Unrestricted Access</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Every preset, filter slider, and audio exporter format is completely unlocked. No subscription fees,
                  no ads covering the controls, and no watermarks on your music.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="surface-card glass-panel rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-fg">Ready to shape your sound?</h3>
              <p className="mt-1 text-xs text-muted max-w-md">
                Experience Slowed + Reverb, 8D Audio, Nightcore, and Sacred Pitch Tuning in AudioMorph Studio today.
              </p>
            </div>
            <Button asChild size="md" className="rounded-full shadow-glow-wire bg-primary hover:bg-primary-hover text-white">
              <Link href="/studio">
                <span>Launch AudioMorph Studio</span>
                <ArrowRight size={14} weight="bold" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
