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
    title: "Upload audio",
    tagline: "Client-side memory decode",
    body: "Drag in any audio track up to 10 MB. Audify uses browser-native Web Audio to decode samples directly into client RAM—never uploading bytes to external servers.",
    specDetails: [
      { label: "Max Size", value: "10 MB per file" },
      { label: "Inputs", value: "WAV, MP3, FLAC, OGG, AAC, M4A" },
    ],
  },
  {
    num: "02",
    icon: Faders,
    title: "Choose preset or tool",
    tagline: "Creative or utilitarian",
    body: "Select a creative sound aesthetic (Slowed + Reverb, Nightcore, 8D Audio) or launch a precision utility (Compressor, Vocal Remover, Trimmer, Audio Converter).",
    specDetails: [
      { label: "Aesthetics", value: "30+ Curated Presets" },
      { label: "Utilities", value: "15+ Precision DSP Tools" },
    ],
  },
  {
    num: "03",
    icon: SlidersHorizontal,
    title: "Fine-tune controls",
    tagline: "Transparent parameters",
    body: "Customize every algorithm with interactive sliders: threshold, compression ratio, EQ bands, reverb room size, stereo width, and fade envelopes.",
    specDetails: [
      { label: "Controls", value: "100% Parameter Freedom" },
      { label: "Engine", value: "32-bit Float Processing" },
    ],
  },
  {
    num: "04",
    icon: DownloadSimple,
    title: "Preview & export",
    tagline: "Peak-protected render",
    body: "Audition seamlessly with real-time waveform scrubbing, compare against dry original audio, and export clean masters guarded by our −0.3 dBFS peak limiter.",
    specDetails: [
      { label: "Protection", value: "Peak Limiter (−0.3 dBFS)" },
      { label: "Outputs", value: "WAV, AIFF & MP3" },
    ],
  },
];

export function HowItSteps({ className }: { className?: string }) {
  return (
    <div className={cn("grid gap-5 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {steps.map((step) => (
        <div
          key={step.num}
          className="group relative flex flex-col justify-between rounded-2xl border border-line/70 bg-surface/70 p-6 md:p-7 backdrop-blur-md transition-all duration-300 hover:border-line-strong hover:bg-surface hover:shadow-md hover:-translate-y-1"
        >
          {/* Subtle top indicator bar */}
          <div className="absolute inset-x-6 top-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          <div>
            <div className="flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-raised text-primary transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:shadow-[0_0_12px_rgba(107,0,245,0.2)]">
                <step.icon aria-hidden="true" size={22} weight="duotone" />
              </span>
              <span className="rounded-full border border-line/80 bg-canvas/80 px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-primary to-[#ff2a5f]">
                STEP {step.num}
              </span>
            </div>

            <div className="mt-5">
              <span className="text-[11px] font-mono font-medium tracking-wide uppercase text-accent-crimson">
                {step.tagline}
              </span>
              <h3 className="mt-1 text-lg font-semibold tracking-tight text-fg group-hover:text-primary transition-colors">
                {step.title}
              </h3>
              <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-muted">
                {step.body}
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-line/50 pt-4">
            <dl className="grid grid-cols-2 gap-2 text-[11px] rounded-xl border border-line/50 bg-raised/50 p-2.5">
              {step.specDetails.map((spec) => (
                <div key={spec.label} className="flex flex-col min-w-0">
                  <dt className="text-faint text-[10px] uppercase font-mono">{spec.label}</dt>
                  <dd className="font-mono font-semibold text-fg text-[11px] truncate">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      ))}
    </div>
  );
}





