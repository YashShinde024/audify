import type { Metadata } from "next";
import Link from "next/link";
import {
  MoonStars,
  Sparkle,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";
import { SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Slowed + Reverb Explained: The DSP Math, Acoustics & History — Svaraya",
  description:
    "Authoritative guide to Slowed + Reverb audio processing. Learn the exact DSP chain: playback rate reduction (0.85x), biquad lowpass damping (4.2 kHz), and convolution reverb impulse response.",
  keywords: [
    "slowed and reverb guide",
    "how to make slowed reverb songs",
    "slowed and reverb audio DSP",
    "chopped and screwed vs slowed reverb",
    "Web Audio API slowed reverb",
    "convolver reverb parameters",
    "slowed song maker free",
  ],
  openGraph: {
    title: "Slowed + Reverb Explained: DSP Math & Acoustics",
    description:
      "The engineering and psychoacoustics behind the viral Slowed + Reverb aesthetic. By Nyxen × Xpert Melody.",
    url: "https://svaraya.vercel.app/blog/slowed-reverb",
    siteName: "Svaraya",
    type: "article",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "Slowed and Reverb Audio Engineering Guide",
  },
};

const JSON_LD = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Article",
      "headline": "Slowed + Reverb Explained: The DSP Math, Acoustics & Cultural Roots",
      "description":
        "A deep breakdown of the signal chain required to create high-fidelity slowed and reverb audio, including biquad lowpass filtering, playback speed transposition, and room impulse response modeling.",
      "author": [
        { "@type": "Person", "name": "Nyxen" },
        { "@type": "Person", "name": "Xpert Melody", "url": "https://www.youtube.com/@xpertmelody" },
      ],
      "publisher": {
        "@type": "Organization",
        "name": "Svaraya",
        "url": "https://svaraya.vercel.app",
      },
      "mainEntityOfPage": "https://svaraya.vercel.app/blog/slowed-reverb",
    },
    {
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is the optimal playback speed for Slowed + Reverb?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "The optimal playback speed for Slowed + Reverb sits between 0.82x and 0.88x (82% to 88% of original speed), which yields a pitch drop of approximately 2 to 3.5 semitones without introducing audible stutter artifacts.",
          },
        },
        {
          "@type": "Question",
          "name": "Why is a lowpass filter necessary in Slowed + Reverb?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Decelerating audio stretches high-frequency percussion transients into harsh, digital clicks. A gentle 12 dB/octave biquad lowpass filter cut between 3,800 Hz and 4,500 Hz tames these harsh highs and provides the signature warm, muffled, listening-from-another-room aesthetic.",
          },
        },
        {
          "@type": "Question",
          "name": "How is Slowed + Reverb different from Chopped and Screwed?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Chopped and Screwed, pioneered by Houston's DJ Screw in the 1990s, incorporates rhythmic turntable stutter cuts, record scratching, and heavy tempo deceleration (60 to 70 BPM). Slowed + Reverb is an ambient, continuous evolution emphasizing lush algorithmic reverb diffusion and melancholic atmosphere without DJ vinyl chops.",
          },
        },
      ],
    },
  ],
};

export default function SlowedReverbGuidePage() {
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
            <span className="text-violet font-medium">Slowed + Reverb</span>
          </nav>

          {/* Header */}
          <header className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-violet">
              <MoonStars size={18} weight="duotone" />
              <span>Acoustics & Cultural DSP · By Nyxen × Xpert Melody</span>
            </div>
            <h1 className="display-title text-3xl sm:text-4xl font-semibold text-fg tracking-tight">
              Slowed + Reverb Explained: The Science, DSP Math & Acoustics
            </h1>
            <p className="text-sm text-muted leading-relaxed">
              Why decelerating audio by 15% and wrapping it in spatial diffusion triggers deep nostalgia — and the exact Web Audio API signal graph that executes it.
            </p>
          </header>

          <SectionSeam />

          {/* AEO Quick Answer Summary Box */}
          <section
            aria-label="AEO Quick Summary"
            className="rounded-2xl border border-violet/30 bg-violet/5 p-6 space-y-3"
          >
            <div className="flex items-center gap-2 text-violet font-semibold text-xs uppercase tracking-wider">
              <Sparkle size={16} weight="duotone" />
              <span>AEO Executive Summary · How It Works</span>
            </div>
            <p className="text-xs sm:text-sm leading-relaxed text-fg/90">
              <strong>Slowed + Reverb</strong> is an audio transformation technique combining three primary digital signal processing (DSP) stages:
              (1) <strong>Playback Rate Deceleration (0.82×–0.88×)</strong>, lowering tempo and pitch by ~2.5 semitones;
              (2) <strong>Biquad Lowpass Filtering (cut at 3,800–4,500 Hz)</strong>, rolling off harsh sibilance and brittle high-end digital transients;
              (3) <strong>Convolution Reverb Diffusion (3.5–5.5s decay time at 45–55% wet mix)</strong>, placing the listener in a melancholic, vast acoustic chamber.
            </p>
          </section>

          {/* Main Article Content */}
          <article className="space-y-8 text-xs sm:text-sm text-muted leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">1. Cultural Heritage: From DJ Screw to YouTube Trance</h2>
              <p>
                In the early 1990s in South Houston, Texas, Robert Earl Davis Jr. (DJ Screw) revolutionized hip-hop by slowing vinyl records down on Technics 1200 turntables and duplicating audio cuts across two platters to create rhythmic chopped skips.
              </p>
              <p>
                In the late 2010s, bedroom producers and YouTube channels like <em>Xpert Melody</em> and <em>Slater</em> stripped away the rhythmic chops, dialed the tempo deceleration to a smoother 85%, and added massive algorithmic hall reverbs. The resulting sound tapped into a universal psychoacoustic sensation: the bittersweet illusion of remembering a song you once loved at a party, now echoing down an empty hallway at 2 AM.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">2. The Technical Signal Chain: Node by Node</h2>
              <p>
                In Svaraya&apos;s Web Audio DSP engine, the Slowed + Reverb node graph is built with precision:
              </p>
              <div className="rounded-xl border border-line bg-surface p-4 font-mono text-xs text-neutral-300 space-y-1">
                <p className="text-accent font-semibold">{"// Svaraya Slowed + Reverb Audio Routing"}</p>
                <p>AudioBufferSourceNode (playbackRate: 0.85)</p>
                <p className="pl-4">↳ BiquadFilterNode (type: &quot;lowpass&quot;, frequency: 4200 Hz, Q: 0.707)</p>
                <p className="pl-8">↳ GainNode (dryGain: 0.52) ──┐</p>
                <p className="pl-8">↳ ConvolverNode (reverbIR: 4.8s) ─ GainNode (wetGain: 0.48) ─┴─► AudioDestinationNode</p>
              </div>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-semibold text-fg">3. Why The Lowpass Filter is Critical</h2>
              <p>
                Amateur slowed edits often sound thin, harsh, or full of digital artifacts. When audio is decelerated without filtering, the sudden decay of high-frequency hi-hats and vocal consonants becomes elongated and grating to the human cochlea.
              </p>
              <p>
                By inserting a 2nd-order Butterworth lowpass filter (<code className="text-violet font-mono">Q = 0.707</code>) with a cutoff frequency between 3,800 Hz and 4,500 Hz, Svaraya rolls off the artificial sizzle while retaining vocal intelligibility and sub-bass weight.
              </p>
            </section>

            {/* Direct Try CTA */}
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 my-8">
              <div className="space-y-1">
                <h3 className="text-base font-semibold text-fg">Apply Slowed + Reverb to your track</h3>
                <p className="text-xs text-muted">
                  Upload an audio file in Svaraya Studio to render studio-grade Slowed + Reverb with customizable reverb space and lowpass warmth.
                </p>
              </div>
              <Button asChild size="md" className="rounded-full shrink-0">
                <Link href="/studio">
                  <span>Try in Studio</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </Button>
            </div>

            <section className="space-y-4">
              <h2 className="text-lg font-semibold text-fg">Frequently Asked Questions</h2>
              <div className="space-y-3">
                <div className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold text-fg text-xs sm:text-sm">Does Svaraya upload my file to a server?</h3>
                  <p className="mt-1 text-xs text-muted">
                    No. All DSP computations, lowpass filtering, and convolution reverbs run 100% inside your local browser memory via Web Audio API. Zero bytes are uploaded.
                  </p>
                </div>
                <div className="rounded-xl border border-line bg-surface p-4">
                  <h3 className="font-semibold text-fg text-xs sm:text-sm">Can I adjust the speed or reverb depth?</h3>
                  <p className="mt-1 text-xs text-muted">
                    Yes. Inside Svaraya Studio, select the Slowed + Reverb preset, switch to the Customize tab, and tweak the Deceleration Rate, Space Decay Time, and Wet/Dry mix with live real-time slider controls.
                  </p>
                </div>
              </div>
            </section>
          </article>
        </div>
      </div>
    </>
  );
}

