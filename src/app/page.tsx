import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/marketing/hero";
import { ToolsShowcase } from "@/components/marketing/tools-showcase";
import { CapabilitiesOverview } from "@/components/marketing/capabilities-overview";
import { PresetSignatures } from "@/components/marketing/preset-signatures";
import { HowItSteps } from "@/components/marketing/how-it-works";
import { TrustAndSpecs } from "@/components/marketing/trust-and-specs";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { AdBanner } from "@/components/advertising/ad-banner";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import { siteConfig, homeMetadata } from "@/config/site";
import { FAQ_DATA } from "@/app/faq/faq-data";

export const metadata: Metadata = homeMetadata;

/**
 * Editorial Landing Page Structure:
 *   Section A & B: Hero on the Living Sonic Canvas with refined Sonic Instrument
 *   Section C: Expanded Audio Toolbox Showcase — 8 real working audio utilities
 *   Section D: Comprehensive Capabilities Overview — Creative Effects, Audio Enhancement, Audio Utilities
 *   Section E: Working macOS Browser Preview & Signature Presets with live parameter telemetry
 *   Section F: 4-Step Workflow — upload, choose preset/tool, fine-tune, preview & export
 *   Section G: Trust & Verified Technical Specifications — client privacy, peak limiter (−0.3 dBFS), formats
 *   Section H: Technical FAQ & Final Studio CTA with Xpert Melody partnership attribution
 */
export default function HomePage() {
  return (
    <>
      {/* Hero: Editorial Copy on left, macOS Browser Showcase with working Studio on right */}
      <Hero />

      {/* Ad Placement 1: Below hero, above toolbox */}
      <section
        aria-label="Sponsorship advertisement"
        className="border-b border-line/70 bg-canvas py-6 sm:py-8"
      >
        <AdBanner
          className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"
          note="Audify remains completely free, supported by sponsor banners. Your audio never leaves your browser."
        />
      </section>

      {/* Section C: Expanded Audio Toolbox Showcase */}
      <section
        id="toolbox"
        aria-labelledby="toolbox-heading"
        className="relative border-b border-line/70 bg-canvas py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <ToolsShowcase />
        </div>
      </section>

      {/* Section D: Comprehensive Capabilities Overview */}
      <section
        id="capabilities"
        aria-labelledby="capabilities-heading"
        className="relative border-b border-line/70 bg-surface/30 py-16 sm:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <CapabilitiesOverview />
        </div>
      </section>

      {/* Signature Presets */}
      <section
        id="presets"
        aria-labelledby="signatures-heading"
        className="relative border-b border-line/70 bg-canvas py-16 sm:py-24"
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
              Four-Step Workflow
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

      {/* Ad Placement 2: Between workflow steps and trust specs */}
      <section
        aria-label="Sponsorship advertisement"
        className="border-b border-line/70 bg-canvas py-6 sm:py-8"
      >
        <AdBanner className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8" />
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
            <FAQAccordion
              items={FAQ_DATA.map(({ question, answerNode }) => ({
                question,
                answer: answerNode,
              }))}
            />
          </div>
        </div>
      </section>

      {/* Final Studio CTA Band with Xpert Melody Partnership */}
      <section
        aria-labelledby="final-cta-heading"
        className="relative overflow-hidden bg-gradient-to-b from-raised/40 via-surface/30 to-raised/70 py-20 sm:py-28"
      >
        {/* Ethereal Sonic Atmosphere Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[320px] bg-gradient-to-r from-primary/20 via-[#ff2a5f]/15 to-primary/15 blur-[90px] rounded-full"
        />

        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-line/80 bg-surface/80 px-3.5 py-1 font-mono text-[11px] font-semibold text-fg backdrop-blur-md shadow-xs">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            Audify Studio v2.4
          </span>
          <h2
            id="final-cta-heading"
            className="mt-4 text-3xl font-bold tracking-tight text-fg sm:text-5xl"
          >
            Start sculpting your sound now.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm sm:text-base leading-relaxed text-muted">
            Drop your track into Audify Studio. Experiment with creative presets or process your audio with precision utilities — all in client-side memory.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 px-7 rounded-xl btn-gradient-primary text-white font-medium shadow-glow-wire group"
            >
              <Link href="/studio">
                <span>Open Audify Studio</span>
                <ArrowRight aria-hidden="true" className="ml-1.5 h-4 w-4 btn-arrow transition-transform duration-200" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-6 rounded-xl border border-line-strong bg-surface/80 hover:bg-surface text-fg font-medium shadow-xs hover:border-pink/40 hover:shadow-glow-wire transition-all duration-200"
            >
              <Link href="/tools">Browse Audio Tools</Link>
            </Button>
          </div>

          {/* Genuine Partnership Attribution */}
          <div className="mt-12 pt-8 border-t border-line/50 flex flex-col sm:flex-row items-center justify-center gap-2 text-xs font-mono text-faint">
            <span className="text-fg/80 font-medium">Audify by Nyxen</span>
            <span className="hidden sm:inline text-primary" aria-hidden="true">×</span>
            <span>In Music Partnership with Xpert Melody</span>
          </div>
        </div>
      </section>
    </>
  );
}
