import Link from "next/link";
import {
  ArrowRight,
  SlidersHorizontal,
  Scissors,
  ArrowsLeftRight,
  Waveform,
  MicrophoneSlash,
  SpeakerHigh,
  FileAudio,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

interface HighlightedTool {
  id: string;
  name: string;
  badge: string;
  description: string;
  icon: typeof SlidersHorizontal;
  specs: string;
}

const FEATURED_TOOLS: HighlightedTool[] = [
  {
    id: "compressor",
    name: "Dynamic Compressor",
    badge: "Dynamics",
    description:
      "Tame inconsistent volume peaks, glue instrument buses, and increase loudness with full threshold, ratio, attack, release, and makeup gain controls.",
    icon: SlidersHorizontal,
    specs: "Threshold -60 dB · Ratio up to 20:1 · Soft Knee",
  },
  {
    id: "format-converter",
    name: "Audio Converter",
    badge: "Transcoder",
    description:
      "True bitstream transcoding between uncompressed WAV (16/24/32-bit float), broadcast AIFF, and MP3 at custom bitrates up to 320 kbps CBR.",
    icon: FileAudio,
    specs: "WAV, AIFF & MP3 · 44.1 / 48.0 kHz · Zero Server Uploads",
  },
  {
    id: "trimmer-cutter",
    name: "Audio Trimmer & Cutter",
    badge: "Editing",
    description:
      "Sample-accurate start and end time boundary extraction directly in browser memory without generational re-encoding loss.",
    icon: Scissors,
    specs: "Millisecond Precision · Instant Waveform Preview",
  },
  {
    id: "vocal-remover",
    name: "Vocal Remover & Extractor",
    badge: "Isolation",
    description:
      "Mid/Side phase matrix cancellation that removes center-panned vocals while retaining wide stereo instruments and low-frequency bass.",
    icon: MicrophoneSlash,
    specs: "M/S Phase Subtraction · Sub-Bass Crossover Retention",
  },
  {
    id: "dc-offset-remover",
    name: "DC Offset Remover",
    badge: "Restoration",
    description:
      "Measures and eliminates asymmetrical electrical bias across audio channels, recentering waveforms to recover peak headroom.",
    icon: Waveform,
    specs: "Two-Pass Float32 Calibration · Optional 20 Hz Sub-HPF",
  },
  {
    id: "volume-changer",
    name: "Volume Normalizer & Gain",
    badge: "Mastering",
    description:
      "Transparent digital output gain adjustment guarded by a look-ahead sample-peak limiter calibrated strictly to −0.3 dBFS.",
    icon: SpeakerHigh,
    specs: "-24 dB to +24 dB Gain · Brickwall Limiter Protection",
  },
  {
    id: "fade-in-out",
    name: "Fade In & Fade Out",
    badge: "Envelopes",
    description:
      "Smooth acoustic entrance and exit envelopes that prevent harsh digital clicks, DC pops, and abrupt track endings.",
    icon: ChartLineUp,
    specs: "0 to 15s Envelopes · Linear & S-Curve Gain Envelopes",
  },
  {
    id: "downmixer",
    name: "Stereo to Mono Downmixer",
    badge: "Downmixing",
    description:
      "Calculates equal-power -3 dB left and right channel summation with an optional 120 Hz low-shelf mud reduction filter.",
    icon: ArrowsLeftRight,
    specs: "-3 dB Equal Power Law · Phase Summation Monitoring",
  },
];

const TOOL_SLUG_MAP: Record<string, string> = {
  compressor: "audio-compressor",
  "format-converter": "audio-converter",
  "trimmer-cutter": "audio-trimmer",
  "vocal-remover": "vocal-remover",
  "dc-offset-remover": "audio-metadata",
  "volume-changer": "volume-changer",
  "fade-in-out": "audio-fades",
  downmixer: "channel-converter",
};

export function ToolsShowcase() {
  return (
    <div className="space-y-12">
      {/* Section Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
          Expanded Audio Toolbox
        </span>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          Professional processing. Browser simplicity.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Beyond creative presets, Audify equips you with sample-accurate editing, restoration, dynamic leveling, and format conversion utilities that run 100% in local memory.
        </p>
      </div>

      {/* Featured Tools 8-Card Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_TOOLS.map((tool) => {
          const Icon = tool.icon;
          const toolSlug = TOOL_SLUG_MAP[tool.id];
          const targetHref = toolSlug ? `/tools/${toolSlug}` : `/studio?preset=${tool.id}`;

          return (
            <div
              key={tool.id}
              className="group flex flex-col justify-between rounded-2xl border border-line/80 bg-surface/70 p-5 transition-all duration-200 hover:border-line-strong hover:bg-surface hover:shadow-md hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line bg-raised/80 text-primary group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(107,0,245,0.18)] transition-all">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="inline-flex items-center rounded-md border border-line/70 bg-canvas/70 px-2 py-0.5 font-mono text-[10px] font-semibold text-muted uppercase tracking-wider">
                    {tool.badge}
                  </span>
                </div>

                <h3 className="mt-3.5 text-base font-semibold text-fg group-hover:text-primary transition-colors">
                  <Link href={targetHref} className="hover:underline">
                    {tool.name}
                  </Link>
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted line-clamp-3">
                  {tool.description}
                </p>

                <div className="mt-3 pt-2.5 border-t border-line/50 text-[11px] font-mono text-muted/80">
                  {tool.specs}
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-line/60 flex items-center justify-between gap-2">
                <Button
                  asChild
                  size="sm"
                  className="flex-1 h-8 rounded-lg btn-gradient-primary text-white text-xs font-medium group/btn shadow-xs"
                >
                  <Link href={targetHref}>
                    <span>Open Tool</span>
                    <ArrowRight className="ml-1 h-3 w-3 btn-arrow transition-transform duration-200" />
                  </Link>
                </Button>
                <Link
                  href={`/studio?preset=${tool.id}`}
                  className="inline-flex items-center justify-center h-8 px-2.5 rounded-lg border border-line/70 bg-surface hover:bg-raised text-[11px] font-medium text-muted hover:text-fg hover:border-pink/40 shadow-xs transition-all"
                  title="Open in Audify Studio"
                >
                  <span>Studio</span>
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Explore All Tools Banner CTA */}
      <div className="relative overflow-hidden flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-line/80 bg-gradient-to-r from-surface/95 via-raised/70 to-surface/95 p-6 sm:p-8 backdrop-blur-md shadow-sm">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl" aria-hidden="true" />
        <div className="relative z-10">
          <h3 className="text-base font-semibold text-fg">
            Looking for more specialized DSP utilities?
          </h3>
          <p className="mt-1 text-xs text-muted max-w-xl">
            Explore our complete directory of audio tools including parametric EQ, sub rumble cut, bitcrushing, chorus modulation, and BPM detection.
          </p>
        </div>
        <Button asChild size="lg" sweep="offset-a" className="relative z-10 h-10 px-5 rounded-xl btn-gradient-primary text-white text-xs font-medium shrink-0 shadow-glow-wire group">
          <Link href="/tools">
            <span>Browse All Audio Tools</span>
            <ArrowRight className="ml-1.5 h-3.5 w-3.5 btn-arrow transition-transform duration-200" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
