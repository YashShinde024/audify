import type { Metadata } from "next";
import Link from "next/link";
import {
  Planet,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "8D Audio Explained: Binaural Panning, ITD, ILD & Psychoacoustics — Svaraya",
  description:
    "How 8D audio actually works: Interaural Time Difference (ITD), sinusoidal azimuth panning, Head-Related Transfer Functions (HRTF), and reverb psychoacoustics.",
  keywords: [
    "what is 8D audio",
    "how to make 8D audio",
    "8D audio science",
    "binaural panning",
    "interaural time difference ITD",
    "interaural level difference ILD",
    "8D audio converter free online",
  ],
  openGraph: {
    title: "8D Audio Explained: Binaural Panning & Headphone Acoustics",
    description:
      "The physics and digital signal processing behind 8D music that moves around your head in headphones.",
    url: "https://svaraya.vercel.app/blog/8d-audio",
    siteName: "Svaraya",
    type: "article",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "8D Audio Digital Signal Processing & Psychoacoustics Guide",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "8D Audio Explained: Binaural Panning, ITD, ILD & Psychoacoustics",
      "description":
        "An engineering analysis of 8D audio, exploring how sinusoidal stereo panning, subtle delay offsets, and room reverberation create the illusion of 360-degree spatial sound in headphones.",
      "author": [
        { "@type": "Person", "name": "Nyxen" },
        { "@type": "Person", "name": "Xpert Melody", "url": "https://www.youtube.com/@xpertmelody" },
      ],
      "publisher": { "@type": "Organization", "name": "Svaraya" },
      "mainEntityOfPage": "https://svaraya.vercel.app/blog/8d-audio",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "Are there really 8 dimensions in 8D audio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "No. The term '8D audio' is an aesthetic marketing label popularized on YouTube and TikTok. Scientifically, audio in headphones operates across 2 physical stereo channels (Left and Right). The 3D illusion is created psychoacoustically via dynamic stereo panning, micro-delays (ITD), volume differences (ILD), and room reverberation.",
          },
        },
        {
          "@type": "Question",
          "name": "Why do you have to wear headphones to hear 8D audio?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Headphones completely isolate acoustic signals entering your left and right ears, preventing acoustic crosstalk. On loudspeaker monitors, sound from the left speaker bleeds into the right ear, collapsing the perceived 360-degree rotational illusion.",
          },
        },
      ],
    },
  ],
};

export default function EightDAudioGuidePage() {
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
            <span className="text-violet font-medium">8D Audio</span>
          </nav>

          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-400">
              <Planet size={18} weight="duotone" />
              <span>Spatial Acoustics & Psychoacoustics · By Nyxen × Xpert Melody</span>
            </div>
            <h1 className="display-title text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
              8D Audio Demystified: Binaural Panning & Headphone Acoustics
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Why does sound seem to physically revolve in an orbit around your skull when wearing headphones? Discover the digital signal processing behind the sensation.
            </p>
          </header>

          <SectionSeam />

          {/* AEO Quick Summary */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-blue-500/30 bg-blue-500/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · What is 8D Audio?</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              <strong>8D Audio</strong> is a headphone-exclusive psychoacoustic listening format created by applying:
              (1) <strong>Automated Sinusoidal Panning (0.08–0.15 Hz LFO frequency)</strong> that smoothly transitions the stereo signal between the left and right ear channels;
              (2) <strong>Interaural Time & Level Differences (ITD/ILD)</strong> mimicking the biological cues human brains use to localize sounds in space; and
              (3) <strong>Convolver Acoustic Diffusion (25–35% wet room reverb)</strong> which pushes the audio source outside of the direct in-head cranial plane.
            </p>
          </section>

          {/* Content */}
          <article className="space-y-8 text-xs sm:text-sm text-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">1. The Myth vs The Reality: What Does 8D Actually Mean?</h2>
              <p>
                Physics dictates that spatial dimensions exist in 3 spatial coordinates ($x$, $y$, $z$) plus time ($t$). There is no eighth physical dimension in acoustic physics.
              </p>
              <p>
                The label &quot;8D&quot; was coined by internet music creators to express a subjective sensory effect: instead of listening to a static stereo track anchored to the front or inside your brain, the music feels as if it were orbiting around you in an expansive sphere.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">2. The Biological Mechanism: ITD and ILD</h2>
              <p>
                The human brain determines where a sound comes from through two fundamental psychoacoustic mechanisms:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-1">
                <li>
                  <strong className="text-fg">Interaural Time Difference (ITD):</strong> Sound reaches the closer ear approximately 0.6 milliseconds (600 microseconds) faster than the distant ear due to the physical width of the human head (~18–22 cm).
                </li>
                <li>
                  <strong className="text-fg">Interaural Level Difference (ILD):</strong> The human head acts as an acoustic shadow for high frequencies (&gt;1,500 Hz), attenuating the sound by 6 to 20 dB at the far ear.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">3. How Svaraya Computes 8D Audio In-Tab</h2>
              <p>
                Inside Svaraya&apos;s Web Audio DSP engine, 8D audio is computed using real-time parameter automation:
              </p>
              <div className="rounded-xl border border-line bg-surface p-4 font-mono text-xs text-neutral-300 space-y-1">
                <p className="text-blue-400 font-semibold">{"// Svaraya 8D Panning Automation"}</p>
                <p>const panner = offlineContext.createStereoPanner();</p>
                <p>const orbitPeriod = 8.5; // seconds per 360° circle</p>
                <p>for (let t = 0; t &lt; duration; t += 0.05) &#123;</p>
                <p className="pl-4">panner.pan.setValueAtTime(Math.sin((2 * Math.PI * t) / orbitPeriod), t);</p>
                <p>&#125;</p>
              </div>
            </section>

            {/* CTA */}
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 my-8">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-fg">Convert any song to 8D Audio</h3>
                <p className="text-xs text-muted">
                  Put on your headphones, open Svaraya Studio, and experience real-time 8D audio rendering with zero server latency.
                </p>
              </div>
              <Button asChild size="md" className="rounded-full shrink-0">
                <Link href="/studio">
                  <span>Create 8D Audio</span>
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

