import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Cpu, DownloadSimple, Faders } from "@phosphor-icons/react/dist/ssr";
import { HowItSteps } from "@/components/marketing/how-it-works";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "How It Works — Svaraya Audio Processing",
  description:
    "Learn how Svaraya processes audio locally in your browser. From decoding and DSP node graph execution to WAV, MP3, and AIFF multi-format export.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          eyebrow="Architecture & Pipeline"
          title="How Svaraya Works"
          lead="Six straightforward steps between your raw audio file and a polished master — powered entirely by your browser's native Web Audio API."
        />

        <SectionSeam />

        {/* The 6 Core Steps */}
        <section aria-labelledby="steps-heading" className="mt-4">
          <h2 id="steps-heading" className="text-base font-semibold text-fg mb-4">
            The 6-Step Processing Lifecycle
          </h2>
          <HowItSteps />
        </section>

        {/* Detailed Technical Breakdown */}
        <section aria-labelledby="tech-breakdown-heading" className="mt-14 space-y-6">
          <h2 id="tech-breakdown-heading" className="text-xl font-semibold tracking-tight text-fg">
            Under the Hood
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                <Cpu className="h-5 w-5" weight="duotone" />
              </div>
              <h3 className="text-sm font-semibold text-fg">In-Memory Audio Decoding</h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                When you drag or choose an audio file (up to 10 MB), your browser&apos;s native
                <code className="text-violet font-mono ml-1">AudioContext.decodeAudioData()</code>
                decompresses the compressed stream into raw 32-bit floating point audio sample buffers.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                <Faders className="h-5 w-5" weight="duotone" />
              </div>
              <h3 className="text-sm font-semibold text-fg">OfflineAudioContext DSP</h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                When you trigger processing, an <code className="text-violet font-mono">OfflineAudioContext</code>
                builds a modular audio graph: BiquadFilterNodes for sub-bass and presence, ConvolverNodes with synthetic impulse responses for room wash, and automated LFO panning for 8D audio.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                <DownloadSimple className="h-5 w-5" weight="duotone" />
              </div>
              <h3 className="text-sm font-semibold text-fg">Multi-Format Encoding</h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                After offline rendering finishes, choose between standard WAV (16-bit, 24-bit, 32-bit float), MP3 (128–320 kbps CBR), or AIFF. All encoded directly in-tab without third-party cloud servers.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-raised text-violet mb-3">
                <ShieldCheck className="h-5 w-5" weight="duotone" />
              </div>
              <h3 className="text-sm font-semibold text-fg">Zero Server Uploads</h3>
              <p className="mt-1.5 text-xs text-muted leading-relaxed">
                Because all computation runs in your local browser sandbox, zero bytes of audio are transmitted over the internet. Your creative audio retains absolute privacy.
              </p>
            </div>
          </div>
        </section>

        {/* Ready to start CTA */}
        <section className="mt-14 rounded-2xl border border-line bg-surface p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-fg">
              Ready to transform your audio?
            </h3>
            <p className="mt-1 text-xs text-muted max-w-md">
              Try Slowed + Reverb, Nightcore, or 8D Audio on your tracks right now in your browser.
            </p>
          </div>

          <Button asChild size="md">
            <Link href="/studio">
              Open Svaraya Studio
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
