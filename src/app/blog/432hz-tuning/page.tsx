import type { Metadata } from "next";
import Link from "next/link";
import {
  PianoKeys,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "432 Hz vs 440 Hz Tuning: Mathematical Truth & Acoustic Facts — AudioMorph",
  description:
    "An objective acoustic and mathematical analysis of 432 Hz pitch conversion. Learn the exact 432/440 ratio (0.981818), the -31.766 cents pitch shift, and Verdi's tuning history.",
  keywords: [
    "432 hz vs 440 hz",
    "432 hz converter",
    "how to convert 440 hz to 432 hz",
    "432 hz pitch shift cents",
    "432 hz math",
    "verdi tuning 432 hz",
    "sacred frequency 432 hz science",
  ],
  openGraph: {
    title: "432 Hz vs 440 Hz Tuning: The Acoustic Truth & Mathematics",
    description: "Discover the mathematical formula and acoustic history behind converting music to 432 Hz. Developed by Nyxen.",
    url: `${siteConfig.url}/blog/432hz-tuning`,
    siteName: siteConfig.name,
    type: "article",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "432 Hz vs 440 Hz Acoustic Tuning Guide",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "432 Hz vs 440 Hz Tuning: The Acoustic Truth, Mathematics & History",
      "description":
        "A rigorous breakdown of 432 Hz pitch conversion, detailing the mathematical frequency ratio (432/440 = 0.981818) and exact cents shift (-31.766 cents).",
      "author": [
        { "@type": "Person", "name": "Nyxen" },
        { "@type": "Person", "name": "Xpert Melody", "url": "https://www.youtube.com/@xpertmelody" },
      ],
      "publisher": { "@type": "Organization", "name": siteConfig.name, "url": siteConfig.url },
      "mainEntityOfPage": `${siteConfig.url}/blog/432hz-tuning`,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How many cents is 440 Hz to 432 Hz?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Converting from 440 Hz to 432 Hz requires a pitch shift of precisely -31.7666 cents (approximately -0.3177 semitones). The frequency ratio is exactly 432/440 = 0.98181818.",
          },
        },
        {
          "@type": "Question",
          "name": "Why did 440 Hz become the world standard?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Standard concert pitch varied wildly across Europe for centuries (from 415 Hz in the Baroque era to over 450 Hz in 19th century British brass bands). In 1939, an international conference in London recommended A=440 Hz for uniform orchestral manufacturing and broadcasting, later formalized by ISO 16 in 1953.",
          },
        },
      ],
    },
  ],
};

export default function FourThirtyTwoHzGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          <nav aria-label="Breadcrumbs" className="text-xs text-muted flex items-center gap-2">
            <Link href="/" className="hover:text-fg">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-fg">Guides</Link>
            <span>/</span>
            <span className="text-violet font-medium">432 Hz Tuning</span>
          </nav>

          <header className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary">
              <PianoKeys size={18} weight="duotone" />
              <span>Acoustic Physics & Tuning · By Nyxen</span>
            </div>
            <h1 className="display-title text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
              432 Hz vs 440 Hz: The Acoustic Reality Behind Sacred Pitch
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Separating esoteric mythology from acoustic physics: the exact mathematical formula, historical tuning disputes, and psychoacoustic timbre of A=432 Hz.
            </p>
          </header>

          <SectionSeam />

          {/* AEO Quick Summary */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · 432 Hz Conversion Math</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              Converting standard audio (recorded at <strong>A4 = 440 Hz</strong>) to <strong>A4 = 432 Hz</strong> requires a frequency transposition by a ratio of exactly <strong>432 / 440 = 0.981818...</strong>.
              In musical terms, this represents a subtle downward pitch transposition of <strong>-31.7666 cents (-0.3177 semitones)</strong>.
              It slightly relieves acoustic vocal tension and softens aggressive treble overtones without drastically altering the perceived tempo.
            </p>
          </section>

          <article className="space-y-8 text-xs sm:text-sm text-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">1. The Mathematics of 432 Hz Pitch Shift</h2>
              <p>
                In equal temperament, the ratio between frequencies of two semitones is 2^(1/12). To find the pitch shift in cents (C):
              </p>
              <div className="rounded-xl border border-line bg-surface p-4 font-mono text-xs text-neutral-300 space-y-1">
                <p className="text-emerald-400 font-semibold">{"// 440 Hz to 432 Hz Mathematical Formula"}</p>
                <p>Ratio = 432 / 440 = 0.9818181818...</p>
                <p>Cents = 1200 * Math.log2(432 / 440)</p>
                <p>Cents = 1200 * (-0.026472) = -31.7666 cents</p>
                <p>Semitones = Cents / 100 = -0.3177 semitones</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">2. Historical Context: Giuseppe Verdi & The Pitch Wars</h2>
              <p>
                In 1884, Italian opera composer Giuseppe Verdi wrote a letter to the Congress of Italian Musicians advocating for a standardized tuning fork of A=432 Hz to protect singers&apos; vocal cords from the increasingly shrill &quot;pitch inflation&quot; of military marching bands.
              </p>
              <p>
                While internet claims that 432 Hz can cure illnesses are scientifically unfounded, blind listening tests consistently demonstrate that listeners perceive A=432 Hz as warmer, rounder, and less fatiguing for long listening sessions.
              </p>
            </section>

            {/* CTA */}
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 my-8">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-fg">Convert your track to 432 Hz</h3>
                <p className="text-xs text-muted">
                  AudioMorph Studio applies the exact mathematical 0.981818 resampling curve with full 32-bit float accuracy.
                </p>
              </div>
              <Button asChild size="md" className="rounded-full shrink-0">
                <Link href="/studio">
                  <span>Tune to 432 Hz</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </Button>
            </div>
          </article>
        </div>
      </div>
    </>
  );
}

