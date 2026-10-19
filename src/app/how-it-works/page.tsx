import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Cpu,
  DownloadSimple,
  Faders,
  Sparkle,
  Waveform,
  GlobeHemisphereWest,
  FileAudio,
} from "@phosphor-icons/react/dist/ssr";
import { HowItSteps } from "@/components/marketing/how-it-works";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works — Local Web Audio DSP Architecture · Svaraya",
  description:
    "Learn how Svaraya processes studio audio 100% inside your browser: memory buffer decoding, OfflineAudioContext DSP graphs, non-realtime rendering, and client-side WAV/MP3 packaging.",
  keywords: [
    "how Svaraya works",
    "browser audio processing architecture",
    "Web Audio API offline audio context",
    "client-side audio DSP",
    "zero server upload audio editor",
  ],
  openGraph: {
    title: "How Svaraya Works: Local Web Audio DSP Architecture",
    description: "Six steps between your raw audio file and a polished master — powered entirely by your browser's native Web Audio API.",
    url: "https://svaraya.example.com/how-it-works",
    siteName: "Svaraya",
    type: "article",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "How Svaraya In-Browser Audio Engine Works",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "HowTo",
      "name": "How to Process Audio with Svaraya Local DSP",
      "description": "Step-by-step guide on how Svaraya decodes, processes, and exports audio directly within your web browser.",
      "step": [
        {
          "@type": "HowToStep",
          "name": "Upload Audio",
          "text": "Drag and drop any MP3, WAV, FLAC, or AAC audio file up to 10 MB into Svaraya Studio.",
        },
        {
          "@type": "HowToStep",
          "name": "Client-Side In-Memory Decoding",
          "text": "Your browser decodes the compressed audio into uncompressed 32-bit floating point PCM sample buffers.",
        },
        {
          "@type": "HowToStep",
          "name": "Select Preset or Sculpt DSP",
          "text": "Pick from presets like Slowed + Reverb, 8D Audio, or 432 Hz tuning, and customize parameters.",
        },
        {
          "@type": "HowToStep",
          "name": "Offline Audio Rendering",
          "text": "OfflineAudioContext renders the DSP graph faster than real-time using local CPU cores.",
        },
        {
          "@type": "HowToStep",
          "name": "Download Master",
          "text": "Directly package and download your master in WAV (16/24/32-bit float), CBR MP3, or AIFF format.",
        },
      ],
    },
  ],
};

export default function HowItWorksPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
          <PageHeader
            eyebrow="Architecture & Pipeline"
            title="How Svaraya Works"
            lead="Six straightforward steps between your raw audio file and a polished master — powered entirely by your browser's native Web Audio API."
          />

          <SectionSeam />

          {/* AEO Quick Summary */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-violet/30 bg-violet/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-violet font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · Architectural Overview</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              Unlike traditional web tools that transfer files across the internet to a server farm, <strong>Svaraya operates 100% client-side</strong>.
              When an audio file is loaded, the browser allocates memory to decode the raw PCM audio data. When you click process, an{" "}
              <code className="text-violet font-mono">OfflineAudioContext</code> runs the DSP graph as fast as your CPU allows, rendering a 4-minute track in approximately 2 to 3 seconds.
              The resulting audio buffer is then converted into WAV, MP3, or AIFF in-memory and downloaded directly.
            </p>
          </section>

          {/* The 6 Core Steps */}
          <section aria-labelledby="steps-heading" className="space-y-4">
            <h2 id="steps-heading" className="text-base font-semibold text-fg">
              The 6-Step Processing Lifecycle
            </h2>
            <HowItSteps />
          </section>

          {/* Detailed Technical Breakdown */}
          <section aria-labelledby="tech-breakdown-heading" className="space-y-6">
            <h2 id="tech-breakdown-heading" className="text-xl font-semibold tracking-tight text-fg">
              Under the Hood: The Four DSP Pillars
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-surface p-5 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                  <Cpu className="h-5 w-5" weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">1. In-Memory Linear PCM Decoding</h3>
                <p className="text-xs text-muted leading-relaxed">
                  When you select a file (up to 10 MB), your browser&apos;s native{" "}
                  <code className="text-violet font-mono">AudioContext.decodeAudioData()</code> decompresses the MP3, FLAC, or AAC container into raw 32-bit floating point audio sample buffers.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface p-5 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                  <Faders className="h-5 w-5" weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">2. OfflineAudioContext Node Graph</h3>
                <p className="text-xs text-muted leading-relaxed">
                  When you trigger processing, an <code className="text-violet font-mono">OfflineAudioContext</code> builds an optimized DSP graph: BiquadFilterNodes, ConvolverNodes with synthetic impulse responses, and automated stereo panners.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface p-5 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                  <DownloadSimple className="h-5 w-5" weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">3. Multi-Format Encoding</h3>
                <p className="text-xs text-muted leading-relaxed">
                  After offline rendering finishes, choose between standard WAV (16-bit, 24-bit, 32-bit float), MP3 (128–320 kbps CBR via LAME), or AIFF. All encoded directly in-tab without third-party cloud servers.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface p-5 space-y-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                  <ShieldCheck className="h-5 w-5" weight="duotone" />
                </div>
                <h3 className="text-sm font-semibold text-fg">4. Zero Server Uploads</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Because all computation runs in your local browser sandbox, zero bytes of audio are transmitted over the internet. Your creative audio retains absolute privacy.
                </p>
              </div>
            </div>
          </section>

          {/* Ready to start CTA */}
          <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-base font-semibold text-fg">
                Ready to transform your audio?
              </h3>
              <p className="mt-1 text-xs text-muted max-w-md">
                Try Slowed + Reverb, Nightcore, or 8D Audio on your tracks right now in your browser.
              </p>
            </div>

            <Button asChild size="md" className="rounded-full">
              <Link href="/studio">
                <span>Open Svaraya Studio</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </section>
        </div>
      </div>
    </>
  );
}
