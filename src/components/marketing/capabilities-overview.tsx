import Link from "next/link";
import {
  Sparkle,
  Sliders,
  Wrench,
  ArrowRight,
  Waveform,
  Headphones,
  FileAudio,
  SpeakerHigh,
  Equalizer,
  ArrowsClockwise,
  Scissors,
  ChartLineUp,
} from "@phosphor-icons/react/dist/ssr";
import { Button } from "@/components/ui/button";

interface CapabilityItem {
  name: string;
  href: string;
  tag: string;
  description: string;
}

interface CapabilityGroup {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  icon: typeof Sparkle;
  accentClass: string;
  items: CapabilityItem[];
}

const CAPABILITY_GROUPS: CapabilityGroup[] = [
  {
    id: "creative-effects",
    eyebrow: "Creative Effects & Aesthetics",
    title: "Viral Aesthetics & Sound Design",
    description:
      "Transform recordings with iconic time-stretching, acoustic room spaces, analog lo-fi coloration, and orbital spatial pans.",
    icon: Sparkle,
    accentClass: "text-[#a81dfc]",
    items: [
      {
        name: "Slowed & Reverb",
        href: "/studio?preset=slowed-reverb",
        tag: "Varispeed + Decay",
        description: "Classic late-night aesthetic with varispeed pitch descent and lush convolution hall decay.",
      },
      {
        name: "Nightcore & Daycore",
        href: "/studio?preset=nightcore",
        tag: "Pitch + Tempo",
        description: "High-octane accelerated transpositions or downtempo pitched grooves with high-shelf clarity.",
      },
      {
        name: "8D Audio & Haas Spatializer",
        href: "/studio?preset=8d-audio",
        tag: "Binaural Motion",
        description: "Sinusoidal orbital panning and interaural time difference widening for immersive headphone listening.",
      },
      {
        name: "Vintage Lo-Fi & Bitcrusher",
        href: "/studio?preset=lofi-tape",
        tag: "Analog & 8-Bit",
        description: "Cubic soft-knee tape saturation, analog warmth curves, and linear step digital sample decimation.",
      },
      {
        name: "Acoustic Spaces & Plate Reverb",
        href: "/studio?preset=cathedral-reverb",
        tag: "Convolver IR",
        description: "Simulate small rooms, vocal plates, cavernous cathedrals, and reflective echo chambers.",
      },
      {
        name: "Chorus & Flanger Modulation",
        href: "/studio?preset=chorus-flanger",
        tag: "Modulated Delay",
        description: "Shimmering stereo thickness and vintage jet-sweep movement via sinusoidal LFO delay modulation.",
      },
    ],
  },
  {
    id: "audio-enhancement",
    eyebrow: "Audio Enhancement & Dynamics",
    title: "Dynamics, EQ & Output Safety",
    description:
      "Sculpt frequency balances, level erratic vocals, glue full mix buses, and ensure inter-sample peak protection.",
    icon: Sliders,
    accentClass: "text-[#ff2a5f]",
    items: [
      {
        name: "Dynamic Compression",
        href: "/studio?preset=compressor",
        tag: "Dynamics Control",
        description: "Configurable threshold, ratio, attack, release, and makeup gain with soft knee leveling.",
      },
      {
        name: "Gentle Bus Glue & Leveling",
        href: "/studio?preset=gentle-compression",
        tag: "Mix Bus",
        description: "Transparent 2.5:1 dynamic leveling designed to smooth inconsistent speech and song dynamics.",
      },
      {
        name: "3-Band Parametric Equalizer",
        href: "/studio?preset=equalizer",
        tag: "Frequency Sculpting",
        description: "Low-shelf bass (120 Hz), peaking presence mid (2.4 kHz), and high-shelf air (9.0 kHz) tone controls.",
      },
      {
        name: "Lookahead Peak Limiter",
        href: "/how-it-works#mastering-limiting",
        tag: "Headroom Protection",
        description: "Automated -0.3 dBFS brickwall peak ceiling preventing harsh digital clipping and inter-sample overs.",
      },
      {
        name: "DC Offset Removal & Rumble Cut",
        href: "/studio?preset=dc-offset-remover",
        tag: "Signal Calibration",
        description: "Float32 channel baseline calibration nullifying asymmetrical voltage bias alongside sub-35 Hz rumble cuts.",
      },
      {
        name: "Dynamic Noise Gate & De-Hiss",
        href: "/studio?preset=noise-reducer",
        tag: "Spectral Cleanup",
        description: "Spectral threshold gate attenuating quiet background noise and continuous high-frequency tape hiss.",
      },
    ],
  },
  {
    id: "audio-utilities",
    eyebrow: "Practical Audio Utilities",
    title: "Precision Editing & Transcoding",
    description:
      "Execute essential day-to-day audio engineering operations locally in memory without uploading files to remote servers.",
    icon: Wrench,
    accentClass: "text-[#6b00f5]",
    items: [
      {
        name: "Multi-Format Audio Converter",
        href: "/tools/audio-converter",
        tag: "Bitstream Transcoding",
        description: "Convert between 16/24/32-bit float WAV, broadcast AIFF, and MP3 at selectable bitrates up to 320 kbps.",
      },
      {
        name: "Precision Audio Trimmer & Cutter",
        href: "/tools/audio-trimmer",
        tag: "Sample Trimming",
        description: "Millisecond-accurate start and end region extraction with interactive waveform scrubbing.",
      },
      {
        name: "Vocal Remover & Center Extractor",
        href: "/tools/vocal-remover",
        tag: "Mid/Side Phase",
        description: "Phase-subtractive center channel elimination with low-frequency crossover sub-bass retention.",
      },
      {
        name: "Fade In & Fade Out Envelopes",
        href: "/tools/audio-fades",
        tag: "Gain Transitions",
        description: "Linear and S-curve duration-controlled entrance and exit volume ramps preventing clicks and pops.",
      },
      {
        name: "Stereo to Mono Downmixer",
        href: "/tools/channel-converter",
        tag: "Channel Summation",
        description: "Equal-power -3 dB left/right acoustic summation with optional 120 Hz low-shelf mud reduction.",
      },
      {
        name: "Reverse Audio Sample Order",
        href: "/tools/reverse-audio",
        tag: "Timeline Inversion",
        description: "Mathematically inverts sample index arrays across all channels for reverse swell and build-up effects.",
      },
    ],
  },
];

export function CapabilitiesOverview() {
  return (
    <div className="space-y-16">
      {/* Section Header */}
      <div className="mx-auto max-w-2xl text-center">
        <span className="font-mono text-[11px] font-semibold uppercase tracking-widest text-primary">
          Comprehensive Capabilities
        </span>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
          One unified toolkit for creative and technical audio.
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          From viral aesthetic treatments to mission-critical dynamics control and file conversion, Audify brings professional Web Audio DSP into a cohesive, zero-upload workspace.
        </p>
      </div>

      {/* 3 Pillar Groups */}
      <div className="space-y-12">
        {CAPABILITY_GROUPS.map((group) => {
          const GroupIcon = group.icon;
          const targetHref =
            group.id === "creative-effects"
              ? "/presets"
              : group.id === "audio-enhancement"
              ? "/effects"
              : "/tools";
          const buttonLabel =
            group.id === "creative-effects"
              ? "View Presets"
              : group.id === "audio-enhancement"
              ? "View Effects"
              : "View Tools";

          const groupGradients =
            group.id === "creative-effects"
              ? "bg-gradient-to-br from-surface/70 via-surface/40 to-[#a81dfc]/[0.04] border-[#a81dfc]/20 hover:border-[#a81dfc]/35"
              : group.id === "audio-enhancement"
              ? "bg-gradient-to-br from-surface/70 via-surface/40 to-[#ff2a5f]/[0.04] border-[#ff2a5f]/20 hover:border-[#ff2a5f]/35"
              : "bg-gradient-to-br from-surface/70 via-surface/40 to-[#6b00f5]/[0.04] border-[#6b00f5]/20 hover:border-[#6b00f5]/35";

          return (
            <div
              key={group.id}
              className={`rounded-3xl border p-6 sm:p-8 lg:p-10 transition-all duration-300 shadow-xs ${groupGradients}`}
            >
              {/* Group Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line/60 pb-6">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <GroupIcon className={`h-4 w-4 ${group.accentClass}`} />
                    <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-muted">
                      {group.eyebrow}
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
                    {group.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted max-w-2xl">
                    {group.description}
                  </p>
                </div>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="self-start sm:self-center h-8 px-3.5 rounded-lg border border-line-strong bg-surface hover:bg-raised text-xs font-medium hover:border-pink/40 shadow-xs transition-all"
                >
                  <Link href={targetHref}>
                    <span>{buttonLabel}</span>
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>

              {/* Group Items Grid */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((item) => {
                  const actionText = item.href.startsWith("/tools/")
                    ? "Open Tool"
                    : item.href.startsWith("/effects")
                    ? "Customize Effect"
                    : "Open in Studio";

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="group flex flex-col justify-between rounded-xl border border-line/70 bg-surface/90 p-4 transition-all duration-200 hover:border-line-strong hover:bg-surface hover:shadow-md hover:-translate-y-0.5"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-semibold text-fg group-hover:text-primary transition-colors">
                            {item.name}
                          </span>
                          <span className="rounded-md border border-line/60 bg-raised/70 px-1.5 py-0.5 font-mono text-[9px] font-medium text-muted">
                            {item.tag}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs text-muted leading-relaxed line-clamp-2">
                          {item.description}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center gap-1 text-[11px] font-medium text-primary">
                        <span>{actionText}</span>
                        <ArrowRight className="h-3 w-3 translate-x-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
