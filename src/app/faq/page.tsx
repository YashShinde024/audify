import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { FaqClient } from "./faq-client";
import { FAQ_DATA } from "./faq-data";
import { siteConfig } from "@/config/site";
import { ArrowRight, BookOpen, EnvelopeSimple, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Frequently Asked Questions — Audify",
  description:
    "Find answers about Audify: 100% local browser DSP processing, supported formats, 10 MB limits, 8D audio requirements, lossless WAV and MP3 exports, and zero-telemetry privacy.",
  alternates: {
    canonical: `${siteConfig.url}/faq`,
  },
  openGraph: {
    title: "Frequently Asked Questions — Audify",
    description:
      "Find answers about Audify: 100% local browser DSP processing, supported formats, 10 MB limits, 8D audio requirements, and lossless exports.",
    url: `${siteConfig.url}/faq`,
    siteName: siteConfig.name,
    type: "website",
  },
};

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ_DATA.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answerText,
    },
  })),
};

export default function FAQPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSON_LD) }}
      />
      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Header */}
          <PageHeader
            eyebrow="Help & Documentation"
            title="Questions, answered."
            lead="Direct, verified answers about Audify's in-browser audio engine, audio format support, preset routing, export headroom, and privacy protections."
          />

          <SectionSeam />

          {/* Interactive Search & Filterable Accordion */}
          <section aria-label="Knowledge Base">
            <FaqClient />
          </section>

          {/* Quick Resource Directory */}
          <section className="grid gap-4 sm:grid-cols-3 pt-6 border-t border-line">
            <div className="rounded-xl border border-line bg-surface p-5 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-violet">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Audio Guide</span>
                </div>
                <h3 className="text-sm font-semibold text-fg">Audio Guide & Pipeline</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Understand DSP concepts, pitch calculations, spatial acoustics, and format specs.
                </p>
              </div>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet hover:underline pt-2"
              >
                <span>Read the Audio Guide</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="rounded-xl border border-line bg-surface p-5 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-500">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Privacy & Terms</span>
                </div>
                <h3 className="text-sm font-semibold text-fg">Zero-Telemetry Policy</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Inspect our technical commitment to client-only memory buffers and zero cloud uploads.
                </p>
              </div>
              <div className="flex items-center gap-3 pt-2 text-xs font-medium text-violet">
                <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
                <span className="text-muted/40">•</span>
                <Link href="/terms" className="hover:underline">Terms</Link>
              </div>
            </div>

            <div className="rounded-xl border border-line bg-surface p-5 flex flex-col justify-between gap-3">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-pink-500">
                  <EnvelopeSimple className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-wider">Direct Support</span>
                </div>
                <h3 className="text-sm font-semibold text-fg">Have an edge case?</h3>
                <p className="text-xs text-muted leading-relaxed">
                  Found a corrupted file format or need a specialized preset curve? Reach out to the team.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-violet hover:underline pt-2"
              >
                <span>Send us a message</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
