import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkle,
  Cpu,
  ShieldCheck,
  Waveform,
  MicrophoneStage,
  ArrowsLeftRight,
  ArrowRight,
  GlobeHemisphereWest,
  Code,
  MusicNotes,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { YouTubeIcon } from "@/components/icons/preset-icons";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Svaraya — Free Audio DSP Studio by Nyxen × Xpert Melody",
  description:
    "Discover Svaraya: the free, privacy-first, browser-native audio processing studio crafted by Nyxen and Xpert Melody. Local 32-bit float Web Audio DSP, no cloud uploads.",
  keywords: [
    "Svaraya audio",
    "About Svaraya",
    "Nyxen",
    "Xpert Melody",
    "browser audio effects",
    "Web Audio API DSP",
    "client-side audio processing",
    "slowed and reverb creator",
    "8D audio producer",
    "free audio editor",
  ],
  openGraph: {
    title: "About Svaraya — By Nyxen × Xpert Melody",
    description:
      "The story, philosophy, and engineering behind Svaraya. Built for creators who care about pristine sound and absolute privacy.",
    url: "https://svaraya.example.com/about",
    siteName: "Svaraya",
    type: "profile",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "About Svaraya Audio Processing Studio",
    "DC.creator": "Nyxen & Xpert Melody",
  },
};

const JSON_LD_ABOUT = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "AboutPage",
      "@id": "https://svaraya.example.com/about",
      "url": "https://svaraya.example.com/about",
      "name": "About Svaraya Audio Processing",
      "description":
        "Overview of Svaraya, its creators Nyxen and Xpert Melody, and its client-side Web Audio DSP architecture.",
      "about": {
        "@type": "SoftwareApplication",
        "name": "Svaraya",
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
      "@id": "https://svaraya.example.com/#nyxen",
      "name": "Nyxen",
      "jobTitle": "Lead Audio DSP Architect & Software Engineer",
      "description":
        "Creator and developer of Svaraya. Specializes in Web Audio API DSP graphs, offline audio rendering, and local-first software architecture.",
    },
    {
      "@type": "Person",
      "@id": "https://svaraya.example.com/#xpertmelody",
      "name": "Xpert Melody",
      "jobTitle": "Music Producer & Sound Designer",
      "url": "https://www.youtube.com/@xpertmelody",
      "sameAs": ["https://www.youtube.com/@xpertmelody"],
      "description":
        "Music producer and sound designer behind Xpert Melody YouTube channel. Co-creator of Svaraya, curating acoustic presets, spatial panning curves, and aesthetic balance.",
    },
  ],
};

export default function AboutPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD_ABOUT) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <PageHeader
            eyebrow="Vision & Creators"
            title="Sound, Reimagined."
            lead="Svaraya was born from a simple belief: high-fidelity audio transformation should be free, instantly accessible, and strictly respectful of creator privacy."
          />

          <SectionSeam />

          {/* AEO Key Facts Definition Block for Answer Engines */}
          <section
            aria-label="Summary overview"
            className="rounded-2xl border border-violet/30 bg-violet/5 p-6 sm:p-7 space-y-3"
          >
            <div className="flex items-center gap-2 text-violet font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>Executive Summary · What is Svaraya?</span>
            </div>
            <p className="text-sm leading-relaxed text-fg/90">
              <strong>Svaraya</strong> is a client-side audio DSP studio co-created by <strong>Nyxen</strong> and{" "}
              <strong>Xpert Melody</strong>. Unlike legacy cloud converters that upload creative stems to external servers,
              Svaraya executes 100% of its audio filtering, spatial panning, pitch transposition, and file encoding locally
              inside your web browser via the native Web Audio API. Zero audio telemetry, zero server queues, and zero fees.
            </p>
          </section>

          {/* Creators Section: Nyxen × Xpert Melody */}
          <section aria-labelledby="creators-heading" className="space-y-6">
            <div>
              <p className="eyebrow text-violet">The Duo Behind Svaraya</p>
              <h2 id="creators-heading" className="display-title text-2xl sm:text-3xl text-fg mt-1">
                Engineered by Nyxen × Voiced by Xpert Melody
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {/* Nyxen Profile */}
              <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet/10 border border-violet/20 text-violet">
                    <Code size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg">Nyxen</h3>
                    <p className="text-xs font-mono text-violet">Lead DSP Architect & Core Developer</p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    Nyxen architects the browser-native DSP pipelines powering Svaraya. With deep expertise in the
                    W3C Web Audio API, OfflineAudioContext rendering, and audio format encoding (PCM WAV, LAME MP3, AIFF),
                    Nyxen engineered Svaraya&apos;s modular node graph to process studio-grade 32-bit floating point audio
                    without server reliance.
                  </p>
                </div>
                <div className="pt-3 border-t border-line text-[11px] text-faint flex items-center gap-1.5">
                  <Cpu size={14} weight="duotone" />
                  <span>Architecture: Client-side DSP, Offline Rendering, Zero Latency</span>
                </div>
              </div>

              {/* Xpert Melody Profile */}
              <div className="rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500">
                    <MicrophoneStage size={24} weight="duotone" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-fg">Xpert Melody</h3>
                    <p className="text-xs font-mono text-red-500">Music Producer & Acoustic Curator</p>
                  </div>
                  <p className="text-xs sm:text-sm text-muted leading-relaxed">
                    Xpert Melody is an acclaimed music creator and sound curator whose YouTube channel has inspired
                    thousands with viral slowed+reverb edits, 8D audio experiences, and emotional acoustic arrangements.
                    At Svaraya, Xpert Melody designs the signature presets, fine-tuning filter Q-factors, spatial reverb envelopes,
                    and harmonic pitch curves for maximum emotional impact.
                  </p>
                </div>
                <div className="pt-3 border-t border-line flex items-center justify-between">
                  <a
                    href={siteConfig.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-400 transition-colors"
                  >
                    <YouTubeIcon size={16} />
                    <span>Visit YouTube Channel</span>
                    <ArrowRight size={12} weight="bold" />
                  </a>
                  <span className="text-[11px] text-faint">@xpertmelody</span>
                </div>
              </div>
            </div>
          </section>

          {/* Philosophy & Architecture */}
          <section aria-labelledby="philosophy-heading" className="space-y-6">
            <div>
              <p className="eyebrow text-violet">Core Philosophy</p>
              <h2 id="philosophy-heading" className="display-title text-xl sm:text-2xl text-fg mt-1">
                Why Client-Side Audio Processing Matters
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-line bg-surface p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-raised text-violet mb-2">
                  <ShieldCheck size={20} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">Absolute Privacy</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Your creative audio never leaves your machine. No uploads to foreign cloud buckets, no logging,
                  and no training datasets. Your art stays yours.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-raised text-violet mb-2">
                  <Waveform size={20} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">32-Bit Float DSP</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Audio math is rendered using full 32-bit floating-point precision, ensuring generous headroom, zero
                  quantization noise, and pristine dynamic range.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface p-5 space-y-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-raised text-violet mb-2">
                  <GlobeHemisphereWest size={20} weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">Zero Paywalls</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Every preset, every equalizer band, and every export format is 100% free. No artificial limits,
                  no subscription paywalls, and no watermarks.
                </p>
              </div>
            </div>
          </section>

          {/* Technical Pipeline Overview */}
          <section aria-labelledby="pipeline-heading" className="rounded-2xl border border-line bg-surface p-6 sm:p-8 space-y-4">
            <h2 id="pipeline-heading" className="text-base font-semibold text-fg">
              The Engineering Behind The Sound
            </h2>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              When an audio file is dragged into Svaraya, our engine utilizes the browser&apos;s native hardware acceleration:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-xs sm:text-sm text-muted pl-1">
              <li>
                <strong className="text-fg">In-Memory Decoding:</strong> Raw compressed audio (MP3, WAV, FLAC, AAC, OGG)
                is decoded directly into interleaved linear PCM sample buffers.
              </li>
              <li>
                <strong className="text-fg">Modular Graph Compilation:</strong> Depending on the active preset or customized
                sliders, an <code className="font-mono text-violet">OfflineAudioContext</code> dynamically chains BiquadFilterNodes,
                ConvolverNodes with synthetic room impulse responses, and sinusoidal StereoPannerNodes.
              </li>
              <li>
                <strong className="text-fg">Offline Fast-Than-Realtime Rendering:</strong> The DSP graph computes at maximum
                CPU speed, typically finishing a 4-minute track in under 3 seconds.
              </li>
              <li>
                <strong className="text-fg">Direct Client-Side Packaging:</strong> Output PCM buffers are encoded into standard
                WAV (16, 24, or 32-bit float), CBR MP3, or AIFF and pushed directly to your browser&apos;s download manager.
              </li>
            </ol>
          </section>

          {/* Call to Action */}
          <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-fg">Ready to shape your sound?</h3>
              <p className="mt-1 text-xs text-muted max-w-md">
                Experience the magic of Slowed + Reverb, 8D Audio, and 432 Hz Sacred Pitch Tuning in Svaraya Studio today.
              </p>
            </div>
            <Button asChild size="md" className="rounded-full">
              <Link href="/studio">
                Launch Svaraya Studio
                <ArrowRight size={14} weight="bold" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
