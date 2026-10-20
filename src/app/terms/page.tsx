import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Sparkle, ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms of Service — 100% Creator Ownership · AudioMorph",
  description:
    "Terms of service governing the usage of AudioMorph browser audio tools: 100% intellectual property retention for creators, fair use, and local client execution. Developed by Nyxen.",
  keywords: [
    "AudioMorph terms of service",
    "audio editor licensing",
    "creator ownership terms",
    "free audio editor commercial rights",
  ],
  openGraph: {
    title: "Terms of Service — AudioMorph Audio Processing",
    description: "Terms governing access to AudioMorph by Nyxen. Clear, creator-first legal conditions.",
    url: `${siteConfig.url}/terms`,
    siteName: siteConfig.name,
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "AudioMorph Terms of Service",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "name": "AudioMorph Terms of Service",
      "description":
        "Legal terms governing the use of AudioMorph client-side Web Audio software and creator intellectual property ownership.",
      "url": `${siteConfig.url}/terms`,
    },
  ],
};

export default function TermsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <PageHeader
            eyebrow="Legal & Terms"
            title="Terms of Service"
            lead="Terms governing your access to and use of AudioMorph by Nyxen. Clear, concise conditions built for creative professionals."
          />

          <SectionSeam />

          {/* Quick Summary Block */}
          <section
            aria-label="Summary overview"
            className="surface-card glass-panel rounded-2xl border-primary/25 bg-primary/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>Core Commitment · 100% Creator Ownership</span>
            </div>
            <p className="text-sm leading-relaxed text-fg/90">
              <strong>You retain 100% ownership, copyright, and commercial distribution rights</strong> over all audio
              files processed or rendered with AudioMorph. We claim zero royalties, zero licensing claims, and zero
              derivatives over your creative output.
            </p>
          </section>

          {/* Detailed Terms Sections */}
          <section className="space-y-6 text-xs sm:text-sm text-muted leading-relaxed">
            <div className="surface-card glass-panel rounded-2xl p-6 space-y-2">
              <h2 className="text-sm font-semibold text-fg">1. Nature of the Software</h2>
              <p>
                AudioMorph is a client-side digital signal processing (DSP) application that runs inside your browser using
                the W3C Web Audio API. Audio processing occurs entirely in client memory on your local CPU.
              </p>
            </div>

            <div className="surface-card glass-panel rounded-2xl p-6 space-y-2">
              <h2 className="text-sm font-semibold text-fg">2. Permitted Commercial & Personal Use</h2>
              <p>
                Files exported from AudioMorph (WAV, MP3, AIFF) may be freely used for personal, commercial, streaming
                (Spotify, Apple Music, YouTube), film, and broadcasting purposes without attribution requirements or fees.
              </p>
            </div>

            <div className="surface-card glass-panel rounded-2xl p-6 space-y-2">
              <h2 className="text-sm font-semibold text-fg">3. Content Responsibility</h2>
              <p>
                You represent and warrant that you hold the legal rights, licenses, or fair-use permissions for any audio
                recordings you import into AudioMorph. The creators and developers of AudioMorph assume no liability
                for copyright infringement committed by users.
              </p>
            </div>

            <div className="surface-card glass-panel rounded-2xl p-6 space-y-2">
              <h2 className="text-sm font-semibold text-fg">4. Software Provided &quot;As Is&quot;</h2>
              <p>
                AudioMorph is provided free of charge on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any
                kind. We optimize the audio graph for performance, but users are advised to verify export quality before
                critical master distribution.
              </p>
            </div>

            <div className="surface-card glass-panel rounded-2xl p-6 space-y-2">
              <h2 className="text-sm font-semibold text-fg">5. Questions & Legal Inquiries</h2>
              <p>
                For questions regarding terms, creator licensing, or enterprise integration, reach out to Nyxen:
              </p>
              <div className="pt-2 flex items-center gap-3 font-mono text-xs">
                <a href="mailto:contact@nyxen.in" className="text-primary hover:underline">
                  contact@nyxen.in
                </a>
                <span>·</span>
                <Link href="/contact" className="hover:text-fg underline font-sans">
                  Contact Form
                </Link>
              </div>
            </div>
          </section>

          <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs text-faint">
            <span>Last revised: October 2026 · AudioMorph</span>
            <Link href="/privacy" className="text-primary hover:underline inline-flex items-center gap-1 font-medium">
              <ShieldCheck size={14} />
              <span>Read Privacy Policy</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
