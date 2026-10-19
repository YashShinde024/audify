import type { Metadata } from "next";
import Link from "next/link";
import {
  Sparkle,
  MoonStars,
  Planet,
  TrendUp,
  PianoKeys,
  SpeakerHifi,
  CassetteTape,
  ArrowRight,
  BookOpenText,
  Clock,
  Waveform,
} from "@phosphor-icons/react/dist/ssr";
import { PageHeader, SectionSeam } from "@/components/marketing/page-header";

export const metadata: Metadata = {
  title: "Audio Engineering & Preset Guides — Svaraya Knowledge Base",
  description:
    "Authoritative deep dives into audio transformation techniques: Slowed + Reverb, 8D Audio binaural panning, Nightcore pitch shifting, 432 Hz tuning, and bass boost DSP math.",
  keywords: [
    "audio editing guide",
    "slowed and reverb tutorial",
    "how to make 8D audio",
    "nightcore pitch calculation",
    "432 hz vs 440 hz scientific truth",
    "bass boost without clipping",
    "lo-fi tape effect DSP",
    "Web Audio API acoustics",
  ],
  openGraph: {
    title: "Audio Engineering & Preset Guides — Svaraya",
    description:
      "Explore the science, DSP formulas, and acoustic secrets behind modern viral audio edits.",
    url: "https://svaraya.example.com/blog",
    siteName: "Svaraya",
  },
  other: {
    "geo.region": "GLOBAL",
    "geo.placename": "Worldwide",
    "DC.title": "Svaraya Audio Engineering Knowledge Base",
  },
};

interface GuidePost {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  icon: React.ComponentType<{ size?: number; className?: string; weight?: any }>;
  accentColor: string;
  summary: string;
  keyTopics: string[];
}

const GUIDES: GuidePost[] = [
  {
    slug: "slowed-reverb",
    title: "The Science & Culture of Slowed + Reverb",
    subtitle: "Acoustic space, biquad lowpass damping, and psychological warmth",
    category: "Viral Aesthetics",
    readTime: "6 min read",
    icon: MoonStars,
    accentColor: "text-violet",
    summary:
      "Why does decelerating audio by 12–20% and draping it in algorithmic reverb produce an immediate nostalgic trance? We examine the acoustic DSP chain, formant shifting, and psychoacoustic perception.",
    keyTopics: ["Playback Rate 0.82–0.88x", "Biquad Lowpass at 4.2 kHz", "Impulse Response Convolvers", "Stereo Widening"],
  },
  {
    slug: "8d-audio",
    title: "8D Audio Demystified: Binaural Panning & Headphone Acoustics",
    subtitle: "How sinusoidal azimuth panning and ITD create virtual 360° surround",
    category: "Spatial Audio",
    readTime: "7 min read",
    icon: Planet,
    accentColor: "text-blue-400",
    summary:
      "8D audio is not 8 physical dimensions — it is dynamic psychoacoustic manipulation using Interaural Time Difference (ITD) and Interaural Level Difference (ILD) panning across the stereo soundstage.",
    keyTopics: ["Sinusoidal LFO Panner", "Azimuth Phase Curves", "HRTF & Headphone Separation", "Headroom Management"],
  },
  {
    slug: "nightcore-daycore",
    title: "Nightcore vs Daycore: The Math of Pitch & Tempo Transposition",
    subtitle: "Understanding speed ratios, semitone calculation, and vocal frequency shift",
    category: "Pitch & Tempo",
    readTime: "5 min read",
    icon: TrendUp,
    accentColor: "text-amber-400",
    summary:
      "Born in Norwegian electronic culture, Nightcore accelerates tempo by 20–30% with linear pitch transposition. Learn the mathematical formula connecting speed ratios to exact semitone pitch shifts.",
    keyTopics: ["1.20–1.28x Speed Ratio", "+3.1 to +4.3 Semitones", "Formant Brightening", "Resampling Algorithms"],
  },
  {
    slug: "432hz-tuning",
    title: "432 Hz vs 440 Hz: The Acoustic Reality Behind Sacred Pitch",
    subtitle: "Tuning frequency mathematics, the 0.9818 ratio, and harmonic resonance",
    category: "Acoustic Tuning",
    readTime: "8 min read",
    icon: PianoKeys,
    accentColor: "text-emerald-400",
    summary:
      "Explore the mathematical reality of shifting standard Concert Pitch (A=440 Hz) to Verdi's pitch (A=432 Hz). We detail the exact ratio (432/440 = 0.981818) and cents transposition required for pure acoustic conversion.",
    keyTopics: ["Exact 432/440 Ratio", "-31.766 Cents Shift", "Pythagorean Harmonics", "Equal Temperament vs Just Intonation"],
  },
  {
    slug: "bass-boost",
    title: "Bass Boost Engineering: Sub-Bass Sculpting Without Distortion",
    subtitle: "How to amplify 30–90 Hz frequencies while maintaining 0 dBFS headroom",
    category: "Equalizer & Dynamics",
    readTime: "6 min read",
    icon: SpeakerHifi,
    accentColor: "text-indigo-400",
    summary:
      "Crude bass boosts often result in ugly inter-sample clipping and phase smear. Discover how professional audio DSP uses resonant low-shelf biquads and soft-knee hyperbolic limiting to keep bass heavy yet punchy.",
    keyTopics: ["60 Hz Low-Shelf Filter", "Sub-Bass Resonance (Q Factor)", "Pre-Gain Attenuation", "Soft-Knee Peak Limiting"],
  },
  {
    slug: "lofi-tape",
    title: "Crafting The Lo-Fi Tape Aesthetic: Saturation, Flutter & Bandwidth",
    subtitle: "Emulating the physical warmth of reel-to-reel and cassette tape heads",
    category: "Creative Effects",
    readTime: "7 min read",
    icon: CassetteTape,
    accentColor: "text-amber-500",
    summary:
      "The warm nostalgia of lo-fi music comes from the physical imperfections of magnetic tape: high-frequency roll-off, subtle harmonic saturation, and subtle wow-and-flutter frequency modulations.",
    keyTopics: ["Bandpass 350 Hz – 4.5 kHz", "Wow & Flutter LFOs", "Asymmetric Wave Shaper", "Noise Floor Texture"],
  },
];

export default function BlogIndexPage() {
  return (
    <div className="min-h-full bg-canvas py-10 sm:py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <PageHeader
          eyebrow="Knowledge & Audio Science"
          title="Audio Engineering & Preset Guides"
          lead="Deep, authoritative breakdowns of modern audio transformation techniques. Understand the digital signal processing, acoustic math, and psychoacoustics behind your favorite sound edits."
        />

        <SectionSeam />

        {/* Guides Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {GUIDES.map((guide) => {
            const Icon = guide.icon;
            return (
              <article
                key={guide.slug}
                className="group relative flex flex-col justify-between rounded-2xl border border-line bg-surface p-6 sm:p-7 transition-all duration-200 hover:border-violet/50 hover:bg-raised/70 shadow-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-violet">
                      <Icon size={18} weight="duotone" className={guide.accentColor} />
                      <span>{guide.category}</span>
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-mono text-faint">
                      <Clock size={12} />
                      <span>{guide.readTime}</span>
                    </span>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold tracking-tight text-fg group-hover:text-violet transition-colors">
                      <Link href={`/blog/${guide.slug}`}>
                        <span className="absolute inset-0 rounded-2xl" aria-hidden="true" />
                        {guide.title}
                      </Link>
                    </h2>
                    <p className="mt-1 text-xs text-muted leading-relaxed font-medium">
                      {guide.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-muted leading-relaxed">
                    {guide.summary}
                  </p>

                  {/* Topic Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {guide.keyTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-md border border-line bg-surface px-2 py-0.5 text-[10px] font-mono text-neutral-400"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-line/60 pt-4 text-xs font-semibold text-violet">
                  <span>Read Full Technical Guide</span>
                  <ArrowRight size={14} weight="bold" className="transition-transform group-hover:translate-x-1" />
                </div>
              </article>
            );
          })}
        </div>

        {/* Studio Link Footer */}
        <section className="rounded-2xl border border-line bg-surface p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-fg">Want to test these acoustic effects live?</h3>
            <p className="mt-1 text-xs text-muted max-w-md">
              Load your audio track into Svaraya Studio and hear Slowed + Reverb, 8D Audio, and 432 Hz tuning instantly in your browser.
            </p>
          </div>
          <Link
            href="/studio"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-violet-500 transition-colors shrink-0"
          >
            <Waveform size={15} weight="bold" />
            <span>Open Svaraya Studio</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
