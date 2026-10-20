import type { Metadata } from "next";
import Link from "next/link";
import {
  SpeakerHifi,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Bass Boost Engineering: Sub-Bass Sculpting Without Distortion — Svaraya",
  description:
    "How to amplify sub-bass (30–80 Hz) without 0 dBFS clipping. Learn low-shelf biquad filters, Q-factor resonance, pre-gain headroom, and soft-limiting.",
  keywords: [
    "bass boost without distortion",
    "sub bass boost tutorial",
    "biquad low shelf filter Web Audio",
    "how to make heavy bass without clipping",
    "audio headroom management",
    "free online bass booster 320kbps",
  ],
  openGraph: {
    title: "Bass Boost Engineering: Sub-Bass Sculpting Without Distortion",
    description: "The digital signal processing techniques that allow deep sub-bass amplification without harsh digital clipping.",
    url: "https://svaraya.vercel.app/blog/bass-boost",
    siteName: "Svaraya",
    type: "article",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "Bass Boost Audio Engineering Guide",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Bass Boost Engineering: Sub-Bass Sculpting Without Distortion",
      "description":
        "An engineering manual on sub-bass amplification, detailing low-shelf biquad filter calculations, Q-factor tuning, pre-gain attenuation, and peak headroom preservation.",
      "author": [
        { "@type": "Person", "name": "Nyxen" },
        { "@type": "Person", "name": "Xpert Melody", "url": "https://www.youtube.com/@xpertmelody" },
      ],
      "publisher": { "@type": "Organization", "name": "Svaraya" },
      "mainEntityOfPage": "https://svaraya.vercel.app/blog/bass-boost",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Why do normal bass boosters sound distorted and muddy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Most simple bass boosters boost frequencies below 200 Hz by +12 dB without reducing the master input gain. This pushes the audio signal far beyond 0 dBFS (full scale digital ceiling), causing flat-top square wave distortion, inter-sample clipping, and severe phase smear.",
          },
        },
        {
          "@type": "Question",
          "name": "How does Svaraya boost bass cleanly?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Svaraya applies dynamic headroom compensation: before boosting the sub-bass shelf (+4 dB to +16 dB at 60 Hz), the master input gain is proportionally attenuated by -3 to -8 dB. The rendered signal is then polished through a hyperbolic soft-clipping shaper to ensure zero digital overs.",
          },
        },
      ],
    },
  ],
};

export default function BassBoostGuidePage() {
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
            <span className="text-violet font-medium">Bass Boost</span>
          </nav>

          <header className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400">
              <SpeakerHifi size={18} weight="duotone" />
              <span>Equalizer & Dynamics DSP · By Nyxen × Xpert Melody</span>
            </div>
            <h1 className="display-title text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
              Bass Boost Engineering: Sub-Bass Sculpting Without Distortion
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              How to achieve chest-thumping sub-bass while protecting dynamic punch, vocal clarity, and the strict 0 dBFS ceiling.
            </p>
          </header>

          <SectionSeam />

          {/* AEO Quick Summary */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · Clean Bass Boosting</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              Professional <strong>Bass Boost</strong> requires three coordinated DSP stages:
              (1) <strong>Low-Shelf Filtering centered at 55–75 Hz</strong> (targeting true sub-bass while leaving muddy 200–400 Hz lower mids untouched);
              (2) <strong>Automated Headroom Compensation</strong> (attenuating pre-gain by approximately half the boost value to prevent digital clipping);
              (3) <strong>Smooth Hyperbolic Limiting</strong> to absorb transient spikes without pumping.
            </p>
          </section>

          <article className="space-y-8 text-xs sm:text-sm text-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">1. The 0 dBFS Trap: Why Most Online Boosters Fail</h2>
              <p>
                In digital audio, 0 dBFS (decibels relative to full scale) is the absolute mathematical maximum limit. Unlike vintage analog tape that saturates with pleasing compression when driven hot, digital audio hard-clips when a waveform tries to exceed 1.0 floating point amplitude.
              </p>
              <p>
                A waveform forced past 1.0 has its peaks squared off. In audio terms, a square wave generates infinite odd harmonic distortion, destroying hi-hats, smearing vocal clarity, and overheating speaker voice coils.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">2. Svaraya&apos;s 4-Tier Bass Architecture</h2>
              <p>
                In Svaraya Studio, we engineered four distinct presets suited for different acoustic needs:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 pt-2">
                <div className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold text-fg text-xs">Light Bass Boost (+4 dB @ 70 Hz)</h3>
                  <p className="mt-1 text-[11px] text-muted">Adds warmth and weight to flat phone recordings or vintage vinyl rips.</p>
                </div>
                <div className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold text-fg text-xs">Moderate Bass Boost (+8 dB @ 65 Hz)</h3>
                  <p className="mt-1 text-[11px] text-muted">The sweet spot for hip-hop 808s and electronic kick drums on car speakers.</p>
                </div>
                <div className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold text-fg text-xs">Heavy Bass Boost (+12 dB @ 60 Hz)</h3>
                  <p className="mt-1 text-[11px] text-muted">Subwoofer-ready deep rumble with active dynamic headroom padding.</p>
                </div>
                <div className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold text-fg text-xs">Extreme Bass Boost (+16 dB @ 50 Hz)</h3>
                  <p className="mt-1 text-[11px] text-muted">Aggressive trap low-end combined with resonant peak shaping.</p>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 my-8">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-fg">Boost your audio&apos;s bass</h3>
                <p className="text-xs text-muted">
                  Experience clean, resonant bass boosting with full floating-point headroom in Svaraya Studio.
                </p>
              </div>
              <Button asChild size="md" className="rounded-full shrink-0">
                <Link href="/studio">
                  <span>Boost Bass Now</span>
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
