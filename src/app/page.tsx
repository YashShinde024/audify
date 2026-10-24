import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/marketing/hero";
import { PresetSignatures } from "@/components/marketing/preset-signatures";
import { HowItSteps } from "@/components/marketing/how-it-works";
import { TrustAndSpecs } from "@/components/marketing/trust-and-specs";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { AdPlaceholder } from "@/components/advertising/ad-placeholder";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audify — Sound, reimagined · In-Browser Audio DSP Platform",
  description:
    "Audify by Nyxen × Xpert Melody. Create slowed + reverb, 8D audio, bass-boosted, nightcore, and pitch-shifted audio effects directly in your browser. 100% client-side memory processing.",
};

/**
 * Editorial Landing Page Structure:
 *   Section A & B: Hero on the Living Sonic Canvas with refined Sonic Instrument
 *   Section C: Working macOS Browser Preview — real working Studio workspace, drag-and-drop, synthesized demo beat, live waveform scrubbing, Dry/Wet A/B
 *   Section D: Signature Presets — 6 curated presets with live procedural auditioning & parameter telemetry
 *   Section E: Concise 3-Step Workflow — upload, shape, preview & export
 *   Section F: Trust & Verified Technical Specifications — client privacy, peak limiter (−0.3 dBFS), formats
 *   Section G: Technical FAQ & Final Studio CTA with Xpert Melody partnership attribution
 */
export default function HomePage() {
  return (
    <>
      {/* Hero: Editorial Copy on left, macOS Browser Showcase with working Studio on right */}
      <Hero />

      {/* Signature Presets */}
      <section
        id="presets"
        aria-labelledby="signatures-heading"
        className="relative border-b border-line/70 bg-surface/30 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <PresetSignatures />
        </div>
      </section>

      {/* Section E: 3-Step Workflow */}
      <section
        id="workflow"
        aria-labelledby="workflow-heading"
        className="relative border-b border-line/70 bg-canvas py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
              Three-Step Workflow
            </span>
            <h2
              id="workflow-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl"
            >
              From raw audio to finished master.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Every operation executes within your browser&apos;s Web Audio runtime.
              Zero cloud uploads, zero account logins, zero wait times.
            </p>
          </div>

          <div className="mt-12">
            <HowItSteps />
          </div>
        </div>
      </section>

      {/* Respectful, Layout-Shift-Free Banner Ad Placement */}
      <section
        aria-label="Sponsorship advertisement"
        className="border-b border-line/70 bg-canvas py-8 sm:py-10"
      >
        <AdPlaceholder
          size="banner"
          note="Audify remains completely free with no paywalls or user tracking thanks to unobtrusive sponsor support."
        />
      </section>

      {/* Section F: Trust and Technical Specifications */}
      <section
        id="specifications"
        aria-labelledby="specs-heading"
        className="relative border-b border-line/70 bg-surface/40 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-accent-crimson">
              Verified Technical Facts
            </span>
            <h2
              id="specs-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl"
            >
              Engineered with transparent boundaries.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              Precise engineering specifications and audio guarantees so you know exactly what to expect.
            </p>
          </div>

          <TrustAndSpecs />
        </div>
      </section>

      {/* Section G: FAQ & Final CTA */}
      <section
        id="faq"
        aria-labelledby="faq-heading"
        className="relative border-b border-line/70 bg-canvas py-16 sm:py-24"
      >
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-xl text-center">
            <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
              Questions &amp; Answers
            </span>
            <h2
              id="faq-heading"
              className="mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl"
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

      {/* Final Studio CTA Band with Xpert Melody Partnership */}
      <section
        aria-labelledby="final-cta-heading"
        className="relative overflow-hidden bg-gradient-to-b from-raised/30 to-raised/60 py-20 sm:py-28"
      >
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-raised/80 px-3 py-1 font-mono text-[11px] font-medium text-fg">
            Audify Studio v2.4
          </span>
          <h2
            id="final-cta-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-5xl"
          >
            Start sculpting your sound now.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-muted">
            Drop your track into Audify Studio. Experiment with slowed + reverb, 8D spatial motion, and bass boosts in real time.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-7 rounded-xl font-medium"
            >
              <Link href="/studio">
                Open Audify Studio
                <ArrowRight aria-hidden="true" className="ml-1.5 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 rounded-xl font-medium"
            >
              <Link href="#presets">Explore Presets</Link>
            </Button>
          </div>

          {/* Genuine Partnership Attribution */}
          <div className="mt-12 pt-8 border-t border-line/50 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-mono text-faint">
            <span>Audify by Nyxen</span>
            <span className="hidden sm:inline" aria-hidden="true">×</span>
            <span>In Music Partnership with Xpert Melody</span>
          </div>
        </div>
      </section>
    </>
  );
}
