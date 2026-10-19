import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Hero } from "@/components/marketing/hero";
import { PresetSignatures } from "@/components/marketing/preset-signatures";
import { HowItSteps } from "@/components/marketing/how-it-works";
import { ProcessingNote } from "@/components/marketing/processing-note";
import { FAQAccordion } from "@/components/marketing/faq-accordion";
import { EditorShell } from "@/components/editor/editor-shell";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Svaraya — Free Browser Audio Processing",
  description:
    "Free, professional browser-based audio processing. Choose presets like Slowed + Reverb, Nightcore, or 8D Audio, shape the DSP sound, and download finished masters.",
};

export default function HomePage() {
  return (
    <>
      {/* 1. Hero & primary action */}
      <Hero />

      {/* 2. Selected presets for common sound transformations */}
      <section aria-labelledby="signatures-heading" className="py-16 sm:py-20 border-b border-line">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <PresetSignatures />
        </div>
      </section>

      {/* 3. Preview of the actual file-processing workspace */}
      <section id="studio" aria-label="Svaraya Studio Preview" className="studio-theme bg-canvas border-b border-line py-16 sm:py-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="eyebrow text-violet">Workspace</p>
              <h2 className="text-xl sm:text-2xl font-semibold text-fg tracking-tight mt-1">
                The Audio Processing Studio
              </h2>
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

      {/* 4. A concise explanation of the workflow */}
      <section aria-labelledby="workflow-heading" className="py-16 sm:py-20 border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="eyebrow text-violet">Workflow</p>
            <h2 id="workflow-heading" className="display-title text-3xl sm:text-4xl mt-2 text-fg">
              Four steps. Zero servers.
            </h2>
            <p className="mt-3 text-sm text-muted leading-relaxed">
              Every transform is computed by your browser&apos;s Web Audio DSP engine.
              No uploads, no waitlists, and no account hurdles.
            </p>
          </div>

          <div className="mt-10">
            <HowItSteps />
          </div>

          <div className="mt-16 pt-12 border-t border-line">
            <ProcessingNote />
          </div>
        </div>
      </section>

      {/* 5. A small FAQ section */}
      <section aria-labelledby="faq-heading" className="py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto">
            <p className="eyebrow text-violet">Questions & Answers</p>
            <h2 id="faq-heading" className="display-title text-3xl sm:text-4xl mt-2 text-fg">
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
    </>
  );
}
