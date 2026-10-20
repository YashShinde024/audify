"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Waveform,
  Lock,
  ArrowRight,
  DownloadSimple,
  Play,
  Pause,
  Sliders,
  ShieldCheck,
  CheckCircle,
  Lightning,
  Sparkle,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

interface StepData {
  id: number;
  label: string;
  badge: string;
  headline: string;
  subhead: string;
  url: string;
}

const steps: StepData[] = [
  {
    id: 1,
    label: "1. Ingest & Decode",
    badge: "Native Web Audio API",
    headline: "Zero-Latency Client File Decoding",
    subhead: "Audio files are decoded into raw 32-bit floating-point PCM buffers in your browser tab. Never uploaded to the cloud.",
    url: "audiomorph.nyxen.in/decode",
  },
  {
    id: 2,
    label: "2. Choose Signature DSP",
    badge: "Acoustic Matrix",
    headline: "Instant Sonic Presets & Surgical Knobs",
    subhead: "Select from Slowed + Reverb, 8D Spatial Audio, Nightcore, or Heavy Bass with authentic mathematical routing.",
    url: "audiomorph.nyxen.in/presets/slowed-reverb",
  },
  {
    id: 3,
    label: "3. Real-Time Waveform Morph",
    badge: "Hardware-Accelerated",
    headline: "Live Visual Waveform & Peak Limiting",
    subhead: "Inspect authentic peak tracking and spectrum changes. Look-ahead peak protection guarantees zero digital overs.",
    url: "audiomorph.nyxen.in/dsp-graph",
  },
  {
    id: 4,
    label: "4. Lossless Master Export",
    badge: "Direct Bitstream",
    headline: "Studio-Grade WAV & 320kbps MP3",
    subhead: "Rendered via OfflineAudioContext at up to 16x real-time speed. Download instantly with pristine bit integrity.",
    url: "audiomorph.nyxen.in/export",
  },
];

export function MacProcessWindow() {
  const [activeStep, setActiveStep] = useState(1);
  const [isPlayingDemo, setIsPlayingDemo] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-cycle gently every 10s, pausing when user hovers to reduce animation churn
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % steps.length) + 1);
    }, 10000);

    return () => clearInterval(timer);
  }, [isHovered]);

  const current = steps[activeStep - 1];

  return (
    <section
      aria-labelledby="process-window-heading"
      className="relative py-12 sm:py-20 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary">
            <Sparkle size={13} weight="fill" />
            <span>Interactive Process Engine</span>
          </div>
          <h2 id="process-window-heading" className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight text-fg">
            How AudioMorph Transforms Sound
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-muted">
            Observe the entire journey from raw audio ingestion to multi-threaded DSP rendering inside your browser.
          </p>
        </div>

        {/* Step Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {steps.map((step) => {
            const active = step.id === activeStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveStep(step.id)}
                className={cn(
                  "relative px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer",
                  active
                    ? "bg-accent text-white shadow-[0_4px_16px_rgba(230,0,38,0.35)]"
                    : "border border-line bg-surface hover:bg-surface-raised text-muted hover:text-fg"
                )}
              >
                <span>{step.label}</span>
              </button>
            );
          })}
        </div>

        {/* Realistic macOS Browser Window Frame */}
        <div className="relative mx-auto rounded-2xl border border-line bg-surface/90 dark:bg-surface/95 shadow-lg backdrop-blur-md overflow-hidden">
          {/* macOS Top Bar */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3 bg-raised/40">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57] border border-[#e0443e]" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e] border border-[#d89e24]" />
              <span className="h-3 w-3 rounded-full bg-[#28c840] border border-[#1aab29]" />
            </div>

            {/* URL Bar Capsule */}
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-1 text-[11px] font-mono text-muted max-w-xs sm:max-w-md w-full justify-center shadow-xs">
              <Lock size={11} className="text-emerald-500 shrink-0" weight="fill" />
              <span className="text-fg truncate">https://{current.url}</span>
              <span className="ml-auto text-[9px] text-faint font-sans uppercase">SSL 256-bit</span>
            </div>

            {/* Window Right Action */}
            <div className="flex items-center gap-1.5 text-muted">
              <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-accent font-semibold">
                Web Audio DSP
              </span>
            </div>
          </div>

          {/* Browser Interior Canvas */}
          <div className="p-6 sm:p-10 min-h-[380px] sm:min-h-[420px] flex flex-col justify-between">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid gap-8 lg:grid-cols-2 items-center"
              >
                {/* Left: Stage description & live stats */}
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 rounded-full bg-accent-soft border border-accent/25 px-3 py-1 text-xs font-semibold text-accent">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                    <span>{current.badge}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg text-balance">
                    {current.headline}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted leading-relaxed max-w-lg">
                    {current.subhead}
                  </p>

                  <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-mono">
                    <span className="rounded-lg border border-line bg-surface px-3 py-1 text-fg">
                      Local Client Execution
                    </span>
                    <span className="rounded-lg border border-line bg-surface px-3 py-1 text-accent">
                      32-bit Float PCM
                    </span>
                    <span className="rounded-lg border border-line bg-surface px-3 py-1 text-emerald-500">
                      0 Server Queue
                    </span>
                  </div>

                  <div className="pt-4">
                    <Link
                      href="/studio"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-600 to-rose-600 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:scale-105 active:scale-95 transition-all"
                    >
                      <span>Try in Live Studio</span>
                      <ArrowRight size={13} weight="bold" />
                    </Link>
                  </div>
                </div>

                {/* Right: Dynamic Interactive Simulation Graphic */}
                <div className="relative rounded-2xl border border-line bg-canvas p-5 sm:p-6 shadow-inner">
                  {/* Step 1 Visual: Ingest & Decode */}
                  {activeStep === 1 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-line pb-3">
                        <span className="text-xs font-mono font-semibold text-fg">FILE_INGEST.WAV</span>
                        <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                          <CheckCircle size={12} weight="fill" /> Decoded (44.1 kHz · 2ch)
                        </span>
                      </div>
                      <div className="relative h-28 rounded-xl border border-dashed border-accent/40 bg-accent/5 flex flex-col items-center justify-center gap-2 text-center p-4">
                        <Waveform size={32} className="text-accent animate-bounce" weight="duotone" />
                        <p className="text-xs font-medium text-fg">aurora-midnight-anthem.wav</p>
                        <p className="text-[10px] text-muted font-mono">14.8 MB · Decoded in 42ms directly in browser memory</p>
                      </div>
                      <div className="w-full bg-line rounded-full h-1.5 overflow-hidden">
                        <div className="bg-accent h-full w-full transition-all duration-700" />
                      </div>
                    </div>
                  )}

                  {/* Step 2 Visual: Preset Selection */}
                  {activeStep === 2 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-line pb-2">
                        <span className="text-xs font-mono font-semibold text-fg">PRESET_ROUTING</span>
                        <span className="text-[10px] font-mono text-accent">Active: Slowed + Reverb</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-xl border border-accent bg-accent-soft p-3 text-left">
                          <p className="text-xs font-bold text-fg">Slowed + Reverb</p>
                          <p className="text-[10px] text-muted">0.85x Varispeed · Hall Reverb</p>
                          <span className="mt-2 inline-block text-[9px] font-mono text-accent font-semibold">SELECTED</span>
                        </div>
                        <div className="rounded-xl border border-line bg-surface p-3 text-left opacity-70">
                          <p className="text-xs font-bold text-fg">8D Audio</p>
                          <p className="text-[10px] text-muted">360° Binaural Orbit Panning</p>
                          <span className="mt-2 inline-block text-[9px] font-mono text-muted">READY</span>
                        </div>
                      </div>
                      <div className="rounded-xl border border-line bg-surface p-3 space-y-2">
                        <div className="flex justify-between text-[11px] font-mono">
                          <span className="text-muted">Playback Speed</span>
                          <span className="text-accent font-semibold">82% (Varispeed)</span>
                        </div>
                        <div className="w-full bg-line rounded-full h-1.5">
                          <div className="bg-accent h-full w-[82%]" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3 Visual: DSP Graph & Spectrum */}
                  {activeStep === 3 && (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-line pb-2">
                        <span className="text-xs font-mono font-semibold text-fg">DSP_GRAPH_MONITOR</span>
                        <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                          <ShieldCheck size={13} weight="fill" /> Peak Limiter: −0.3 dBFS
                        </span>
                      </div>
                      {/* Animated Waveform Bars */}
                      <div className="h-28 rounded-xl bg-surface border border-line p-3 flex items-end justify-between gap-1 overflow-hidden">
                        {[40, 65, 85, 50, 70, 95, 80, 60, 90, 100, 75, 55, 88, 92, 45, 68, 84, 98, 70, 52, 65, 80, 90, 72].map((height, i) => (
                          <motion.span
                            key={i}
                            animate={{
                              height: [`${Math.max(15, height * 0.4)}%`, `${height}%`, `${Math.max(20, height * 0.6)}%`],
                            }}
                            transition={{
                              duration: 1.2,
                              repeat: Infinity,
                              delay: i * 0.04,
                              ease: "easeInOut",
                            }}
                            className="w-full rounded-t-sm bg-gradient-to-t from-red-600 via-rose-500 to-red-400"
                          />
                        ))}
                      </div>
                      <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                        <span>Lowpass: 4.2 kHz (Q=0.707)</span>
                        <span>IR Decay: 4.8s</span>
                      </div>
                    </div>
                  )}

                  {/* Step 4 Visual: Master Bitstream Export */}
                  {activeStep === 4 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-line pb-2">
                        <span className="text-xs font-mono font-semibold text-fg">RENDER_COMPLETE</span>
                        <span className="text-[10px] font-mono text-emerald-500 flex items-center gap-1">
                          <CheckCircle size={13} weight="fill" /> 16x Offline Render
                        </span>
                      </div>
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
                          <DownloadSimple size={20} weight="bold" />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-xs font-bold text-fg truncate">audiomorph-slowed-reverb.wav</p>
                          <p className="text-[10px] text-muted font-mono">24-bit 44.1 kHz PCM · Normalized to −0.5 dBFS</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                        <div className="rounded-lg border border-line bg-surface p-2">
                          <p className="text-muted">Dynamic Range</p>
                          <p className="text-fg font-bold">14.2 dB</p>
                        </div>
                        <div className="rounded-lg border border-line bg-surface p-2">
                          <p className="text-muted">True Peak</p>
                          <p className="text-emerald-500 font-bold">−0.3 dBFS</p>
                        </div>
                        <div className="rounded-lg border border-line bg-surface p-2">
                          <p className="text-muted">Processing Time</p>
                          <p className="text-fg font-bold">0.84s</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Window Status Bar */}
            <div className="mt-8 pt-4 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span>Web Audio OfflineAudioContext Pipeline · AudioMorph Engine</span>
              </div>
              <div className="flex items-center gap-4 text-[11px] font-mono">
                <span>Memory Allocation: Isolated Tab</span>
                <span>Bit Depth: 32-bit Float</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
