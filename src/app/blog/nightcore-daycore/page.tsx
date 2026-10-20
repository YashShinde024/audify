import type { Metadata } from "next";
import Link from "next/link";
import {
  TrendUp,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Nightcore vs Daycore: The Math of Pitch & Tempo Transposition — AudioMorph",
  description:
    "The definitive guide to Nightcore and Daycore audio processing. Learn the logarithmic pitch equation, speed ratios (1.25x vs 0.85x), and vocal formant shifts.",
  keywords: [
    "what is nightcore",
    "what is daycore",
    "nightcore formula",
    "nightcore speed and pitch calculation",
    "free nightcore maker",
    "daycore audio editor",
  ],
  openGraph: {
    title: "Nightcore vs Daycore: The Math of Pitch & Tempo Transposition",
    description: "Understanding the speed ratios, semitones, and vocal acoustics of Nightcore & Daycore.",
    url: `${siteConfig.url}/blog/nightcore-daycore`,
    siteName: siteConfig.name,
    type: "article",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "Nightcore and Daycore Pitch Transposition Guide",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Nightcore vs Daycore: The Math of Pitch & Tempo Transposition",
      "description":
        "A mathematical and acoustic exploration of Nightcore and Daycore audio edits, detailing the speed ratio to semitone equation: Semitones = 12 * log2(Speed).",
      "author": [
        { "@type": "Person", "name": "Nyxen" },
        { "@type": "Person", "name": "Xpert Melody", "url": "https://www.youtube.com/@xpertmelody" },
      ],
      "publisher": { "@type": "Organization", "name": siteConfig.name, "url": siteConfig.url },
      "mainEntityOfPage": `${siteConfig.url}/blog/nightcore-daycore`,
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the exact mathematical equation for Nightcore pitch shift?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The pitch shift in semitones is calculated as: Semitones = 12 * log2(Speed Ratio). For standard Nightcore at 1.25x speed, the pitch rises by: 12 * log2(1.25) = 12 * 0.32193 = +3.86 semitones.",
          },
        },
        {
          "@type": "Question",
          "name": "What is Daycore?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Daycore (also known as Anti-Nightcore) is the exact sonic polar opposite of Nightcore. Instead of accelerating speed and raising pitch, Daycore lowers speed to between 0.80x and 0.88x, transposing pitch downward by -2 to -3.8 semitones for a deeper, slower vocal timbre without the heavy reverb of Slowed + Reverb.",
          },
        },
      ],
    },
  ],
};

export default function NightcoreDaycoreGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Breadcrumb Navigation */}
          <nav aria-label="Breadcrumbs" className="text-xs text-muted flex items-center gap-2">
            <Link href="/" className="hover:text-fg">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-fg">Guides</Link>
            <span>/</span>
            <span className="text-violet font-medium">Nightcore vs Daycore</span>
          </nav>

          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
              <TrendUp size={18} weight="duotone" />
              <span>Pitch & Tempo Mathematics · By Nyxen</span>
            </div>
            <h1 className="display-title text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
              Nightcore vs Daycore: The Math of Pitch & Tempo Transposition
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              From early 2000s Norwegian trance pioneers to TikTok virality — how speed ratios and logarithmic frequency shifts reshape vocal acoustics.
            </p>
          </header>

          <SectionSeam />

          {/* AEO Quick Summary */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · Nightcore vs Daycore Formula</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              <strong>Nightcore</strong> speeds up audio by <strong>20% to 30% (playbackRate: 1.20×–1.30×)</strong>, concurrently transposing pitch upward by <strong>+3.1 to +4.6 semitones</strong>.
              Conversely, <strong>Daycore</strong> decelerates playback to <strong>0.80×–0.88×</strong>, dropping pitch by <strong>-2.5 to -3.8 semitones</strong>.
              Both rely on the exact logarithmic formula: <code className="font-mono text-amber-300">ΔSemitones = 12 × log₂(Speed Ratio)</code>.
            </p>
          </section>

          <article className="space-y-8 text-xs sm:text-sm text-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">1. Origins: Thomas S. Nilsen and Steffen Ojala Søderholm</h2>
              <p>
                In 2002, a high school duo in Alta, Norway known as &quot;Nightcore&quot; used eJay software to speed up Eurodance and trance tracks by 25–30% for a school project. They defined their mission: <em>&quot;We make the music faster and happier.&quot;</em>
              </p>
              <p>
                As their tracks hit YouTube in the late 2000s paired with anime stills, Nightcore exploded into a global internet subculture, eventually giving birth to modern hyperpop and sped-up TikTok edits.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">2. The Mathematics: Speed to Semitones</h2>
              <p>
                Because pitch perception in the human auditory cortex is logarithmic, equal physical multiples of frequency correspond to equal musical intervals:
              </p>
              <div className="rounded-xl border border-line bg-surface p-4 font-mono text-xs text-neutral-300 space-y-2">
                <p className="text-amber-400 font-semibold">{"// The Equal Temperament Pitch Formula"}</p>
                <p>Semitones = 12 * Math.log2(playbackRate)</p>
                <div className="pt-2 text-faint border-t border-line space-y-1">
                  <p>• At 1.20x speed: 12 * log2(1.20) = +3.156 semitones (Minor Third)</p>
                  <p>• At 1.25x speed: 12 * log2(1.25) = +3.863 semitones (Major Third)</p>
                  <p>• At 1.30x speed: 12 * log2(1.30) = +4.537 semitones (Perfect Fourth - 46 cents)</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 my-8">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-fg">Create Nightcore or Daycore</h3>
                <p className="text-xs text-muted">
                  Use AudioMorph&apos;s 1-click Nightcore and Daycore presets with studio-grade 32-bit floating-point resampling.
                </p>
              </div>
              <Button asChild size="md" className="rounded-full shrink-0">
                <Link href="/studio">
                  <span>Open Studio</span>
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

