"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";
import { PresetIcon } from "@/components/icons/preset-icons";
import { cn } from "@/lib/utils";

interface FeaturedPresetData {
  id: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  specs: { label: string; value: string }[];
  audioConfig: {
    speed: number;
    reverbDecay: number;
    bassGainDb: number;
    filterFreq?: number;
    filterType?: BiquadFilterType;
    panRate?: number;
  };
}

const FEATURED_PRESETS: FeaturedPresetData[] = [
  {
    id: "slowed-reverb",
    name: "Slowed + Reverb",
    category: "Atmosphere",
    tagline: "Late-night acoustic warmth",
    description:
      "Drops playback speed to 0.80x using polyphase varispeed while immersing the track in a lush, reverberant acoustic space.",
    specs: [
      { label: "Tempo", value: "0.80x" },
      { label: "Decay", value: "3.2s" },
      { label: "Mix", value: "45% Wet" },
    ],
    audioConfig: { speed: 0.8, reverbDecay: 3.2, bassGainDb: 2 },
  },
  {
    id: "8d-audio",
    name: "8D Audio",
    category: "Spatial",
    tagline: "Binaural 360° orbital soundstage",
    description:
      "Oscillates sound seamlessly around your head with an LFO stereo panner and subtle spatial reflection decay. Best experienced on headphones.",
    specs: [
      { label: "Orbit LFO", value: "0.12 Hz" },
      { label: "Width", value: "85%" },
      { label: "Mode", value: "Binaural" },
    ],
    audioConfig: { speed: 1.0, reverbDecay: 1.8, bassGainDb: 0, panRate: 0.12 },
  },
  {
    id: "bass-boost-heavy",
    name: "Bass Boost",
    category: "Bass & Dynamics",
    tagline: "Calibrated low-end sub weight",
    description:
      "Deepens low frequencies below 85 Hz with a clean low-shelf filter. Clamped by our look-ahead peak limiter to eliminate digital distortion.",
    specs: [
      { label: "Shelf", value: "+7 dB" },
      { label: "Frequency", value: "80 Hz" },
      { label: "Ceiling", value: "−0.3 dBFS" },
    ],
    audioConfig: { speed: 1.0, reverbDecay: 0, bassGainDb: 7, filterFreq: 80, filterType: "lowshelf" },
  },
  {
    id: "nightcore",
    name: "Nightcore",
    category: "Speed & Energy",
    tagline: "Accelerated tempo and heightened pitch",
    description:
      "Spins up playback rate to 1.30x, raising musical pitch by +3.8 semitones with enhanced high-shelf treble clarity.",
    specs: [
      { label: "Tempo", value: "1.30x" },
      { label: "Pitch", value: "+3.8 st" },
      { label: "Treble", value: "+4 dB" },
    ],
    audioConfig: { speed: 1.3, reverbDecay: 0.5, bassGainDb: -1, filterFreq: 6500, filterType: "highshelf" },
  },
  {
    id: "cathedral-reverb",
    name: "Cathedral Reverb",
    category: "Acoustic Spaces",
    tagline: "Sprawling stone sanctuary decay",
    description:
      "Models the vast reflections of a sacred stone hall with dense diffusion and a lingering 4.8-second decay tail.",
    specs: [
      { label: "Decay Tail", value: "4.8s" },
      { label: "Pre-Delay", value: "32 ms" },
      { label: "Damping", value: "High-Cut" },
    ],
    audioConfig: { speed: 1.0, reverbDecay: 4.8, bassGainDb: 0 },
  },
  {
    id: "pitch-432hz",
    name: "432 Hz Sacred Pitch",
    category: "Harmonic Tuning",
    tagline: "Pythagorean acoustic transposition",
    description:
      "Transposes international concert pitch A4=440 Hz down by −31.77 cents to natural 432 Hz tuning with polyphase sinc interpolation.",
    specs: [
      { label: "Tuning", value: "A4 = 432 Hz" },
      { label: "Shift", value: "−31.8 cents" },
      { label: "Resampling", value: "256-Phase" },
    ],
    audioConfig: { speed: 0.9818, reverbDecay: 0.8, bassGainDb: 0 },
  },
];

export function PresetSignatures({ className }: { className?: string }) {
  const [auditioningId, setAuditioningId] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeNodesRef = useRef<{ source?: AudioBufferSourceNode; stopTimeout?: ReturnType<typeof setTimeout> }>({});

  const stopAudition = useCallback(() => {
    if (activeNodesRef.current.source) {
      try {
        activeNodesRef.current.source.stop();
        activeNodesRef.current.source.disconnect();
      } catch {}
      activeNodesRef.current.source = undefined;
    }
    if (activeNodesRef.current.stopTimeout) {
      clearTimeout(activeNodesRef.current.stopTimeout);
      activeNodesRef.current.stopTimeout = undefined;
    }
    setAuditioningId(null);
  }, []);

  const playAudition = async (presetData: FeaturedPresetData) => {
    if (auditioningId === presetData.id) {
      stopAudition();
      return;
    }

    stopAudition();

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioContextRef.current || audioContextRef.current.state === "closed") {
        audioContextRef.current = new AudioCtx();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      const sampleRate = ctx.sampleRate;
      const durationSec = 3.6;
      const totalFrames = Math.floor(sampleRate * durationSec);

      // Generate a pleasant synth chord (Fmaj9 -> G6 -> Am7)
      const buffer = ctx.createBuffer(2, totalFrames, sampleRate);
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      const notes = [174.61, 220.0, 261.63, 329.63, 392.0]; // F, A, C, E, G
      for (let i = 0; i < totalFrames; i++) {
        const t = i / sampleRate;
        const env = Math.exp(-t * 0.75) * 0.16;
        let sample = 0;
        for (let n = 0; n < notes.length; n++) {
          sample += Math.sin(2 * Math.PI * notes[n] * t) * (1 / (n + 1));
        }
        left[i] = sample * env;
        right[i] = sample * env * 0.96;
      }

      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.playbackRate.value = presetData.audioConfig.speed;

      // Filter
      let lastNode: AudioNode = source;

      if (presetData.audioConfig.filterFreq && presetData.audioConfig.filterType) {
        const filter = ctx.createBiquadFilter();
        filter.type = presetData.audioConfig.filterType;
        filter.frequency.value = presetData.audioConfig.filterFreq;
        if (filter.gain) filter.gain.value = presetData.audioConfig.bassGainDb;
        lastNode.connect(filter);
        lastNode = filter;
      }

      // Reverb simulation
      if (presetData.audioConfig.reverbDecay > 0) {
        const convolver = ctx.createConvolver();
        const irLength = Math.floor(sampleRate * Math.min(presetData.audioConfig.reverbDecay, 2.0));
        const irBuf = ctx.createBuffer(2, irLength, sampleRate);
        const irL = irBuf.getChannelData(0);
        const irR = irBuf.getChannelData(1);
        let seed = 1234567;
        const nextRand = () => {
          seed = (seed * 1664525 + 1013904223) % 4294967296;
          return seed / 4294967296;
        };
        for (let i = 0; i < irLength; i++) {
          const decay = Math.exp((-i / sampleRate) * (3 / presetData.audioConfig.reverbDecay));
          irL[i] = (nextRand() * 2 - 1) * decay * 0.4;
          irR[i] = (nextRand() * 2 - 1) * decay * 0.4;
        }
        convolver.buffer = irBuf;

        const wetGain = ctx.createGain();
        wetGain.gain.value = 0.35;
        const dryGain = ctx.createGain();
        dryGain.gain.value = 0.75;

        lastNode.connect(dryGain);
        lastNode.connect(convolver);
        convolver.connect(wetGain);

        const merger = ctx.createGain();
        dryGain.connect(merger);
        wetGain.connect(merger);
        lastNode = merger;
      }

      lastNode.connect(ctx.destination);
      source.start();

      activeNodesRef.current.source = source;
      setAuditioningId(presetData.id);

      activeNodesRef.current.stopTimeout = setTimeout(() => {
        stopAudition();
      }, durationSec * 1000 + 200);
    } catch (err) {
      console.warn("Audition failed:", err);
      stopAudition();
    }
  };

  useEffect(() => {
    return () => {
      stopAudition();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stopAudition]);

  return (
    <div className={cn("space-y-12", className)}>
      {/* Section Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end border-b border-line pb-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Sparkle size={13} weight="fill" />
            <span>Curated DSP Signatures</span>
          </div>
          <h2 className="display-title mt-3 text-3xl font-bold tracking-tight text-fg sm:text-4xl">
            Signature Presets.
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            Six iconic transformations calibrated for creators. Audition how each algorithm sculpts sound,
            then load it straight into the Studio.
          </p>
        </div>

        <div className="shrink-0">
          <Link
            href="/presets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary-hover transition-colors"
          >
            <span>Explore all 36+ presets</span>
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>

      {/* 6 Curated Preset Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURED_PRESETS.map((preset) => {
          const isAuditioning = auditioningId === preset.id;

          return (
            <div
              key={preset.id}
              className={cn(
                "group relative rounded-2xl border p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between",
                isAuditioning
                  ? "border-primary bg-surface shadow-md ring-1 ring-primary/40"
                  : "border-line bg-surface/80 hover:border-line-strong hover:bg-surface hover:shadow-sm"
              )}
            >
              <div>
                {/* Card Top: Icon & Category Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-canvas text-primary group-hover:border-primary/40 transition-colors">
                    <PresetIcon presetId={preset.id} size={22} weight="duotone" />
                  </div>

                  <span className="rounded-full border border-line bg-raised/70 px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-wider text-muted font-medium">
                    {preset.category}
                  </span>
                </div>

                {/* Title & Tagline */}
                <h3 className="mt-4 text-base font-semibold text-fg group-hover:text-primary transition-colors">
                  {preset.name}
                </h3>
                <p className="text-xs font-medium text-primary mt-0.5">
                  {preset.tagline}
                </p>
                <p className="mt-2.5 text-xs text-muted leading-relaxed">
                  {preset.description}
                </p>

                {/* Technical Specs Readout Chips */}
                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-line/60">
                  {preset.specs.map((spec) => (
                    <span
                      key={spec.label}
                      className="inline-flex items-center gap-1 rounded-md border border-line bg-canvas/80 px-2 py-0.5 text-[11px] font-mono text-faint"
                    >
                      <span className="text-muted font-medium">{spec.label}:</span>
                      <span className="text-fg font-semibold">{spec.value}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Footer: Live Audition + Studio Destination */}
              <div className="mt-6 pt-4 border-t border-line flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => playAudition(preset)}
                  aria-label={isAuditioning ? `Stop ${preset.name} demo` : `Audition ${preset.name} sound`}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer",
                    isAuditioning
                      ? "border-primary bg-primary text-white shadow-xs"
                      : "border-line bg-canvas text-fg hover:border-primary/50 hover:bg-raised"
                  )}
                >
                  {isAuditioning ? (
                    <>
                      <Pause size={12} weight="fill" />
                      <span>Playing</span>
                    </>
                  ) : (
                    <>
                      <Play size={12} weight="fill" />
                      <span>Audition</span>
                    </>
                  )}
                </button>

                <Link
                  href={`/studio?preset=${preset.id}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-muted hover:text-primary transition-colors"
                >
                  <span>Open in Studio</span>
                  <ArrowRight size={13} weight="bold" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
