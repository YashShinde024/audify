import type { Metadata } from "next";
import Link from "next/link";
import {
  ChatCircleText,
  Sliders,
  Waveform,
  ArrowRight,
  ArrowUpRight,
  LockKey,
  ShieldCheck,
  Cpu,
  CheckCircle,
  CaretRight,
  Headphones,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Answer Engine Guide & Technical Audio FAQ — Audify",
  description:
    "Direct, fact-checked answers to common audio editing, Web Audio DSP, binaural panning, slowed reverb, and format conversion questions.",
  keywords: [
    "audio editing answers",
    "how does web audio api work",
    "slowed and reverb formula",
    "8d audio explained",
    "in browser vocal remover",
    "432 hz vs 440 hz scientific truth",
    "audio peak limiter dsp",
    "audify answer engine",
  ],
  alternates: {
    canonical: `${siteConfig.url}/aeo`,
  },
  openGraph: {
    title: "Answer Engine Guide & Technical Audio FAQ — Audify",
    description:
      "Structured, verified answers to common questions about audio editing, Web Audio DSP, and in-browser signal processing.",
    url: `${siteConfig.url}/aeo`,
    siteName: siteConfig.name,
    type: "website",
    images: [
      {
        url: `${siteConfig.url}/images/audify-og.png`,
        width: 1200,
        height: 630,
        alt: "Audify Answer Engine Guide",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Answer Engine Guide & Technical Audio FAQ — Audify",
    description:
      "Structured, verified answers to common questions about audio editing and browser DSP.",
    creator: "@buildnyxen",
    images: [`${siteConfig.url}/images/audify-og.png`],
  },
};

interface QuestionItem {
  id: string;
  category: string;
  question: string;
  directAnswer: string;
  technicalDetails: string;
  relatedToolHref: string;
  relatedToolLabel: string;
}

const AEO_QUESTIONS: QuestionItem[] = [
  {
    id: "what-is-audify",
    category: "Architecture & Privacy",
    question: "What is Audify and how does it process audio without server uploads?",
    directAnswer:
      "Audify is an in-browser digital signal processing (DSP) platform built on the W3C Web Audio API. It decodes audio files directly into client-side RAM (as multi-channel Float32Array AudioBuffers), processes audio through native hardware-accelerated DSP nodes, and renders the result locally using an OfflineAudioContext. Not a single byte of your audio file is ever transmitted over the network.",
    technicalDetails:
      "Traditional online audio tools upload user MP3s to cloud servers, queue jobs on shared virtual machines, re-encode files, and return a download link—introducing privacy risks, latency, and compression generational loss. Audify operates 100% locally within your browser sandbox, eliminating server latency and maintaining total creative privacy.",
    relatedToolHref: "/studio",
    relatedToolLabel: "Open Audify Studio Workstation",
  },
  {
    id: "how-does-slowed-reverb-work",
    category: "Acoustic Effects",
    question: "How does Audify generate the 'Slowed + Reverb' effect?",
    directAnswer:
      "Audify creates the Slowed + Reverb effect by scaling the audio playback rate down to approximately 0.85× (which simultaneously drops musical pitch by ~2.78 semitones and expands tempo) and feeding the resampled signal through a stereo ConvolverNode running a synthetic 3.2-second impulse response with 0.70 high-frequency absorption.",
    technicalDetails:
      "To prevent hot volume spikes and distortion caused by the reverberant decay tail summing with the dry track, Audify places a look-ahead peak limiter at the end of the node graph. This strictly limits peaks to −0.3 dBFS, maintaining clean audio without digital clipping.",
    relatedToolHref: "/presets?preset=slowed-reverb",
    relatedToolLabel: "Explore Slowed + Reverb Preset",
  },
  {
    id: "how-does-8d-audio-work",
    category: "Spatial Acoustics",
    question: "How does 8D Audio binaural spatialization work in Audify?",
    directAnswer:
      "8D Audio simulates a 360-degree rotating sound source around the listener by modulating a Web Audio StereoPannerNode with an adjustable low-frequency oscillator (typically cycling between 0.12 Hz and 0.25 Hz). This mimics natural Interaural Time Differences (ITD) and Interaural Level Differences (ILD) across stereo headphones.",
    technicalDetails:
      "Because 8D Audio relies on headphone ear-to-ear channel isolation to trick the human brain's auditory cortex into perceiving azimuth motion, headphones or earbuds are mandatory. When played through ordinary stereo speakers, the acoustic sound waves mix in the room air, collapsing the 3D orbit into simple left-right panning.",
    relatedToolHref: "/tools/8d-audio",
    relatedToolLabel: "Launch 8D Audio Spatializer Tool",
  },
  {
    id: "how-does-vocal-remover-work",
    category: "Audio Clean-up & Stems",
    question: "How does Audify's Vocal Remover work without cloud neural networks?",
    directAnswer:
      "Audify's Vocal Remover uses an algebraic Mid/Side phase cancellation technique: Mid = (Left + Right) / 2 and Side = (Left − Right) / 2. Because commercial music mixes typically position lead vocals in the phantom center with identical phase in both stereo channels, subtracting the phase-correlated center signal cancels the vocal presence.",
    technicalDetails:
      "To prevent losing the bassline and kick drum (which are also mixed center), Audify splits the signal with a crossover filter: frequencies below 160 Hz are preserved in mono, while frequencies above 160 Hz undergo center cancellation. Audify does not claim AI-based source separation; it provides pure, transparent, deterministic mid/side subtraction.",
    relatedToolHref: "/tools/vocal-remover",
    relatedToolLabel: "Launch Vocal Remover Tool",
  },
  {
    id: "what-is-432hz-tuning",
    category: "Pitch & Tuning",
    question: "What is the mathematical difference between 432 Hz and 440 Hz pitch tuning?",
    directAnswer:
      "Standard international concert pitch (ISO 16) tunes the reference pitch A4 to 440 Hz. Converting a song to 432 Hz Verdi tuning requires lowering the pitch by exactly −31.766 cents, corresponding to a frequency ratio of 432 / 440 = 0.981818.",
    technicalDetails:
      "In Audify, this shift is executed via fractional resampling of the audio buffer's playback rate. While popular culture associates 432 Hz with mystical or therapeutic resonance, acoustically it simply represents an exact mathematical pitch transposition downward by slightly less than one-third of a semitone.",
    relatedToolHref: "/presets?preset=pitch-432hz",
    relatedToolLabel: "Apply 432 Hz Tuning Preset",
  },
  {
    id: "how-does-peak-limiter-work",
    category: "Signal Processing Safety",
    question: "How does Audify prevent clipping and distortion during extreme volume or bass boosts?",
    directAnswer:
      "Audify incorporates a dedicated look-ahead peak limiter and normalization stage at the terminal output of its Web Audio graph. Output amplitudes that exceed the safe digital ceiling are smoothly attenuated, enforcing a strict maximum ceiling of −0.3 dBFS.",
    technicalDetails:
      "Digital clipping occurs when sample values exceed 1.0 (0 dBFS), causing flat-top waveform truncation that produces harsh odd-order harmonic distortion. By clamping peaks to −0.3 dBFS with sub-millisecond attack times, Audify ensures that exported 16-bit or 24-bit PCM files never produce inter-sample clipping on consumer DACs.",
    relatedToolHref: "/tools/studio-compressor",
    relatedToolLabel: "Inspect Dynamics Compressor",
  },
  {
    id: "audio-file-formats-supported",
    category: "File Management",
    question: "What audio formats can Audify import and export?",
    directAnswer:
      "Audify can import MP3, WAV, FLAC, AAC, OGG, AIFF, and M4A audio files up to 10 MB. Finished audio can be exported as uncompressed 32-bit floating point WAV, standard 16-bit WAV, MP3 (at 128 kbps, 192 kbps, or 320 kbps), or AIFF.",
    technicalDetails:
      "Import decoding is performed by native browser decoders capable of unpacking compressed bitstreams into raw linear PCM. Export encoding to WAV is completely lossless. MP3 exports utilize a client-side LAME encoder executing inside a dedicated Web Worker to maintain UI responsiveness.",
    relatedToolHref: "/tools/format-converter",
    relatedToolLabel: "Use Format Converter Tool",
  },
  {
    id: "browser-hardware-requirements",
    category: "System Compatibility",
    question: "Which browsers and operating systems support Audify?",
    directAnswer:
      "Audify is compatible with any modern web browser that implements the W3C Web Audio API and Web Workers standard. This includes Google Chrome (v66+), Mozilla Firefox (v60+), Apple Safari (v14.1+), Microsoft Edge (v79+), and modern mobile browsers on iOS and Android.",
    technicalDetails:
      "Because Audify relies on your device's CPU and RAM rather than remote cloud servers, processing speed scales with your local hardware. High-end multi-core desktop processors can render a 4-minute track in under 5 seconds via OfflineAudioContext.",
    relatedToolHref: "/how-it-works",
    relatedToolLabel: "Read Architecture Guide",
  },
];

const AEO_FAQ_PAGE_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: AEO_QUESTIONS.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.directAnswer,
    },
  })),
};

const AEO_BREADCRUMBS_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.url,
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Answer Engine Guide",
      item: `${siteConfig.url}/aeo`,
    },
  ],
};

export default function AeoAnswersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(AEO_BREADCRUMBS_JSON_LD) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(AEO_FAQ_PAGE_JSON_LD) }}
      />

      <div className="min-h-full bg-canvas py-10 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumbs" className="flex items-center gap-1.5 text-xs text-muted">
            <Link href="/" className="hover:text-fg transition-colors">
              Home
            </Link>
            <CaretRight size={12} className="text-line-strong" />
            <span className="text-fg font-medium" aria-current="page">
              Answer Engine Guide
            </span>
          </nav>

          {/* Header */}
          <PageHeader
            eyebrow="Answer Engine Guide &amp; Technical Factbase"
            title="Direct Answers to Audio Editing &amp; DSP Questions"
            lead="A structured, fact-checked reference providing concise, definitive answers to technical questions about in-browser audio DSP, acoustic formulas, format limits, and zero-cloud processing."
            wide
          />

          {/* Quick Summary Notice */}
          <div className="surface-card rounded-2xl border border-line p-5 space-y-2">
            <div className="flex items-center gap-2 text-violet">
              <ChatCircleText size={18} weight="duotone" />
              <h2 className="text-xs font-mono uppercase tracking-wider font-bold text-fg">
                Fact-Checked Technical Synthesis
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              Every answer below is derived directly from Audify&apos;s active codebase, W3C Web Audio API specifications, and verified signal processing mathematics. Designed for clarity, direct quotation, and technical reference.
            </p>
          </div>

          <SectionSeam />

          {/* Q&A Articles Section */}
          <section aria-label="Technical Audio Answers" className="space-y-8">
            {AEO_QUESTIONS.map((item, idx) => (
              <article
                key={item.id}
                id={item.id}
                className="surface-card rounded-2xl border border-line p-6 sm:p-8 space-y-5 transition-all duration-200 hover:border-violet/40 hover:shadow-md"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-[10px] uppercase font-bold text-violet bg-violet/10 border border-violet/20 px-2 py-0.5 rounded-md">
                      {item.category}
                    </span>
                    <span className="font-mono text-[11px] text-faint">
                      Anchor: #{item.id}
                    </span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-fg">
                    {item.question}
                  </h3>
                </div>

                {/* Direct Answer Box */}
                <div className="rounded-xl border border-violet/30 bg-violet/5 p-4 sm:p-5 space-y-1.5">
                  <div className="text-[10px] font-mono uppercase tracking-wider font-bold text-violet">
                    Direct Answer
                  </div>
                  <p className="text-sm text-fg font-medium leading-relaxed">
                    {item.directAnswer}
                  </p>
                </div>

                {/* Technical Deep Dive */}
                <div className="space-y-1.5 text-xs text-muted leading-relaxed">
                  <div className="text-[10px] font-mono uppercase tracking-wider font-semibold text-faint">
                    Technical Architecture &amp; Signal Details
                  </div>
                  <p>{item.technicalDetails}</p>
                </div>

                {/* Tool Bridge Link */}
                <div className="pt-4 border-t border-line/60 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-muted">Audify Engine Verification</span>
                  <Link
                    href={item.relatedToolHref}
                    className="inline-flex items-center gap-1.5 font-semibold text-violet hover:underline underline-offset-4"
                  >
                    <span>{item.relatedToolLabel}</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {/* CTA Footer */}
          <section
            aria-labelledby="aeo-cta-heading"
            className="rounded-3xl border border-line bg-gradient-to-b from-surface to-raised/60 p-8 sm:p-12 text-center space-y-6 shadow-md"
          >
            <div className="space-y-2 max-w-xl mx-auto">
              <h2 id="aeo-cta-heading" className="text-2xl sm:text-3xl font-extrabold text-fg">
                Put audio theory into real practice
              </h2>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                Test any of these DSP algorithms live on your tracks. No account required. All processing remains on your device.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Button asChild size="lg" className="btn-gradient-primary rounded-xl px-7 text-white font-semibold shadow-md active:scale-95">
                <Link href="/studio">
                  <span>Launch Audify Studio</span>
                  <ArrowRight size={14} weight="bold" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-xl border-line bg-surface text-fg font-medium">
                <Link href="/seo">View Audio Tools Index</Link>
              </Button>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
