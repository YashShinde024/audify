import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Cpu,
  FileCode,
  Gauge,
  Browsers,
  ArrowRight,
  SpeakerHigh,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";

const specItems = [
  {
    icon: ShieldCheck,
    title: "100% Client-Side Privacy",
    value: "Zero Audio Uploads",
    detail:
      "All audio decoding, processing, and encoding occurs directly inside your browser heap via Web Audio API. Your tracks never leave your local machine.",
  },
  {
    icon: Gauge,
    title: "Memory & Ingest Boundaries",
    value: "10 MB • 10 Min Max",
    detail:
      "Strict memory caps protect mobile and low-RAM devices against allocation panics. Tracks up to 10 minutes in duration can be processed reliably.",
  },
  {
    icon: FileCode,
    title: "Verified Format Matrix",
    value: "WAV • AIFF • MP3",
    detail:
      "Imports WAV, MP3, FLAC, OGG, and AAC via browser decoders. Exports uncompressed WAV (16/24/32-bit float), AIFF, and MP3 (up to 320 kbps).",
  },
  {
    icon: SpeakerHigh,
    title: "True Peak Limiter Protection",
    value: "−0.3 dBFS Ceiling",
    detail:
      "Resonant bass boosts and reverberant spaces are automatically monitored and contained by our look-ahead sample-peak limiter to prevent digital overs.",
  },
  {
    icon: Browsers,
    title: "Browser Compatibility",
    value: "Evergreen Standards",
    detail:
      "Supported on Chrome 80+, Edge 80+, Firefox 76+, and Safari 14.1+. Mobile Safari and Chrome for Android are fully supported within memory limits.",
  },
  {
    icon: Cpu,
    title: "OfflineAudioContext DSP",
    value: "Faster Than Realtime",
    detail:
      "Renders operate in headless multi-channel OfflineAudioContext, utilizing available CPU threads for accelerated render without audio stutter.",
  },
];

export function TrustAndSpecs({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-8", className)}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {specItems.map((spec) => (
          <div
            key={spec.title}
            className="group relative flex flex-col justify-between rounded-2xl border border-line/70 bg-surface/70 p-5.5 transition-all duration-300 hover:border-line-strong hover:bg-surface hover:shadow-md hover:-translate-y-0.5"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-raised text-primary transition-all group-hover:border-primary/40 group-hover:text-accent-crimson group-hover:shadow-[0_0_10px_rgba(255,42,95,0.2)]">
                  <spec.icon aria-hidden="true" size={18} weight="duotone" />
                </span>
                <span className="inline-flex items-center rounded-md border border-line/70 bg-raised/70 px-2 py-0.5 font-mono text-[11px] font-semibold text-accent-crimson">
                  {spec.value}
                </span>
              </div>
              <h3 className="mt-3.5 text-sm font-semibold text-fg tracking-tight group-hover:text-primary transition-colors">
                {spec.title}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">
                {spec.detail}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between rounded-2xl border border-line/70 bg-surface/80 px-6 py-4.5 gap-4 text-xs backdrop-blur-md shadow-xs">
        <p className="text-muted text-center sm:text-left">
          Have deeper technical questions about our DSP pipeline, sinc resampling, or stereo algorithms?
        </p>
        <Link
          href="/how-it-works"
          className="inline-flex items-center gap-1.5 rounded-lg border border-line-strong bg-surface hover:bg-raised px-3.5 py-1.5 font-medium text-fg hover:text-primary hover:border-primary/40 transition-all shadow-xs whitespace-nowrap"
        >
          <span>Read Audio Guide &amp; DSP pipeline</span>
          <ArrowRight size={13} aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
