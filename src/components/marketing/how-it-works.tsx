import React from "react";
import {
  UploadSimple,
  Faders,
  DownloadSimple,
  ShieldCheck,
  Waveform,
  SlidersHorizontal,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { IconWeight } from "@phosphor-icons/react";

interface Step {
  num: string;
  icon: React.ComponentType<{ size?: number | string; weight?: IconWeight; className?: string }>;
  title: string;
  tagline: string;
  body: string;
  specDetails: { label: string; value: string }[];
}

const steps: Step[] = [
  {
    num: "01",
    icon: UploadSimple,
    title: "Upload your audio",
    tagline: "100% client-side memory decode",
    body: "Drag in any audio file up to 10 MB. Audify uses browser-native AudioContext to decode your sample directly into client RAM—never transferring data to external servers.",
    specDetails: [
      { label: "Limit", value: "10 MB per file" },
      { label: "Inputs", value: "WAV, MP3, FLAC, OGG, AAC" },
    ],
  },
  {
    num: "02",
    icon: Faders,
    title: "Shape with presets & controls",
    tagline: "Fine-grained parameter DSP",
    body: "Dial in calibrated presets or manually adjust varispeed pitch, convolution impulse responses, dynamic stereo panning, and low-frequency shelving filters.",
    specDetails: [
      { label: "Algorithms", value: "Binaural 8D, Varispeed, Reverb" },
      { label: "Controls", value: "Dry/Wet, Rate, Depth, Low Cut" },
    ],
  },
  {
    num: "03",
    icon: DownloadSimple,
    title: "Preview & export the result",
    tagline: "Peak-protected master render",
    body: "Audition seamlessly with real-time waveform scrubbing, compare against dry original audio, and export clean files protected by a look-ahead sample-peak limiter.",
    specDetails: [
      { label: "Protection", value: "Look-Ahead Peak Limiter (−0.3 dBFS)" },
      { label: "Outputs", value: "WAV (16/24/32-bit), AIFF, MP3" },
    ],
  },
];

export function HowItSteps({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-3", className)}>
      {steps.map((step) => (
        <div
          key={step.num}
          className="group relative flex flex-col justify-between rounded-2xl border border-line/60 bg-raised/40 p-6 md:p-7 backdrop-blur-sm transition-all duration-300 hover:border-line hover:bg-raised/70"
        >
          {/* Subtle top indicator bar */}
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line/80 bg-raised text-primary transition-transform duration-300 group-hover:scale-105">
                <step.icon aria-hidden="true" size={22} weight="duotone" />
              </span>
              <span className="font-mono text-xs font-semibold tracking-wider text-faint">
                STEP {step.num}
              </span>
            </div>

            <div className="mt-5">
              <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-accent-crimson">
                {step.tagline}
              </span>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-fg">
                {step.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-line/40 pt-4">
            <dl className="grid grid-cols-2 gap-2 text-[11px]">
              {step.specDetails.map((spec) => (
                <div key={spec.label} className="flex flex-col">
                  <dt className="text-faint">{spec.label}</dt>
                  <dd className="font-mono font-medium text-fg truncate">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
}





