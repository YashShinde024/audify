import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/marketing/hero";
import { PresetStrip } from "@/components/marketing/preset-strip";
import { PresetSignatures } from "@/components/marketing/preset-signatures";
import { HowItSteps } from "@/components/marketing/how-it-works";
import { ProcessingNote } from "@/components/marketing/processing-note";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { SonicCanvas } from "@/components/marketing/sonic-canvas";
import { WaveField } from "@/components/marketing/wave-field";
import { EditorShell } from "@/components/editor/editor-shell";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Svaraya — Free Browser Audio Processing",
  description:
    "Free, professional browser-based audio processing. Choose presets like Slowed + Reverb, Nightcore, or 8D Audio, shape the DSP sound, and download finished masters.",
};

/**
 * Editorial landing flow:
 *   1. Hero on the Living Sonic Canvas (dark stage)
 *   2. Signal Strip marquee (all preset names)
 *   3. Product demonstration — the real Studio, live, early
 *   4. Signature presets (editorial index)
 *   5. Workflow + honest processing note
 *   6. Privacy & quality facts (verified statements only)
 *   7. FAQ
 *   8. Final Studio CTA band
 */
export default function HomePage() {
  return (
    <>
      {/* 1. Hero */}
      <Hero />

      {/* 2. Signal Strip */}
      <PresetStrip />

      {/* 3. Live product demonstration — the real workspace, early */}
      <section
        id="studio"
        aria-label="Svaraya Studio preview"
        className="studio-theme bg-canvas border-b border-line py-16 sm:py-20"
      >
        <div className="mx-auto mb-6 max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-4 border-b border-line pb-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow text-violet">Workspace</p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                The Audio Processing Studio.
              </h2>
              <p className="mt-1 text-xs text-muted">
                This is the real engine, embedded. Bring a file and turn the faders.
              </p>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href="/studio">
                Open Fullscreen Studio
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>
        <EditorShell />
      </section>

      {/* 4. Signature presets */}
      <section
        aria-labelledby="signatures-heading"
        className="border-b border-line py-16 sm:py-20"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <PresetSignatures />
        </div>
      </section>

      {/* 5. Workflow */}
      <section
        aria-labelledby="workflow-heading"
        className="border-b border-line bg-surface py-16 sm:py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="eyebrow text-violet">Workflow</p>
            <h2
              id="workflow-heading"
              className="display-title mt-2 text-3xl text-fg sm:text-4xl"
            >
              Four steps. Zero servers.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Every transform is computed by your browser&apos;s Web Audio DSP engine.
              No uploads, no waitlists, and no account hurdles.
            </p>
          </div>

          <div className="mt-10">
            <HowItSteps />
          </div>

          <div className="mt-16 border-t border-line pt-12">
            <ProcessingNote />
          </div>
        </div>
      </section>

      {/* 6. Privacy & quality facts — only verified statements */}
      <section
        aria-labelledby="facts-heading"
        className="border-b border-line py-14 sm:py-16"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 id="facts-heading" className="sr-only">
            Privacy and audio quality facts
          </h2>
          <dl className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-3">
            <div className="bg-surface p-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Privacy
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                Audio never leaves your device. Decoding, DSP, rendering, and
                encoding all run in your browser via the Web Audio API — the
                architecture has no upload path.
              </dd>
            </div>
            <div className="bg-surface p-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Quality
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                Resampling uses a 256-phase polyphase filter; lossless WAV and
                AIFF export at 16/24/32-bit, or MP3 at the bitrate you choose.
                Peak protection uses a look-ahead limiter at −0.3 dBFS.
              </dd>
            </div>
            <div className="bg-surface p-6">
              <dt className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                Cost
              </dt>
              <dd className="mt-2 text-sm leading-relaxed text-muted">
                Free, without accounts or feature paywalls. Processing power is
                your own CPU, so there is no cloud bill to pass on to you.
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* 7. FAQ */}
      <section
        aria-labelledby="faq-heading"
        className="border-b border-line py-16 sm:py-20"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <p className="eyebrow text-violet">Questions & Answers</p>
            <h2
              id="faq-heading"
              className="display-title mt-2 text-3xl text-fg sm:text-4xl"
            >
              Frequently asked questions
            </h2>
            <p className="mt-3 text-sm text-muted">
              Clear facts regarding privacy, processing speed, format limits, and downloads.
            </p>
          </div>
          <div className="mt-10">
            <FAQAccordion />
          </div>
        </div>
      </section>

      {/* 8. Final CTA band */}
      <section aria-labelledby="cta-heading" className="studio-theme relative overflow-hidden bg-deep">
        <WaveField className="opacity-70" />
        <SonicCanvas className="opacity-60" />
        <div className="relative mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
          <p className="eyebrow text-violet">Begin</p>
          <h2
            id="cta-heading"
            className="display-title mt-3 text-3xl text-fg sm:text-5xl"
          >
            Your first track is one upload away.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted">
            Drop a file, pick a preset, render, download. Nothing is uploaded,
            nothing is stored, and nothing is asked of you in return.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/studio">
                Open Studio
                <ArrowRight aria-hidden="true" className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/how-it-works">How it works</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
