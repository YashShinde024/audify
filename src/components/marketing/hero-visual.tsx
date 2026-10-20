"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  ArrowRight,
  SlidersHorizontal,
  Waveform,
  SpeakerHigh,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

interface DemoPreset {
  id: string;
  name: string;
  tagline: string;
  playbackRate: number;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  filterGain?: number;
  reverbMix: number;
  panMode?: "center" | "orbit";
  bassBoostDb?: number;
}

const DEMO_PRESETS: DemoPreset[] = [
  {
    id: "original",
    name: "Original",
    tagline: "Unprocessed dry master",
    playbackRate: 1.0,
    reverbMix: 0,
    panMode: "center",
  },
  {
    id: "slowed-reverb",
    name: "Slowed + Reverb",
    tagline: "0.80x varispeed · Hall reverb",
    playbackRate: 0.8,
    reverbMix: 0.45,
    panMode: "center",
  },
  {
    id: "nightcore",
    name: "Nightcore",
    tagline: "1.35x varispeed · +3st · Treble lift",
    playbackRate: 1.35,
    filterType: "highshelf",
    filterFreq: 8500,
    filterGain: 5,
    reverbMix: 0.1,
    panMode: "center",
  },
  {
    id: "8d-audio",
    name: "8D Audio",
    tagline: "Orbital LFO panning · Spatial depth",
    playbackRate: 1.0,
    reverbMix: 0.35,
    panMode: "orbit",
  },
  {
    id: "underwater",
    name: "Underwater",
    tagline: "24dB/oct steep low-pass · Submerged",
    playbackRate: 0.95,
    filterType: "lowpass",
    filterFreq: 520,
    reverbMix: 0.5,
    panMode: "center",
  },
  {
    id: "bass-boost-mod",
    name: "Bass Boosted",
    tagline: "+7 dB low-shelf · Peak-protected",
    playbackRate: 1.0,
    filterType: "lowshelf",
    filterFreq: 85,
    filterGain: 7,
    reverbMix: 0.05,
    panMode: "center",
  },
];

/**
 * Synthesizes a melodic loop into an AudioBuffer purely in memory:
 * Warm chord progression (Cm9 - Abmaj7 - Eb - Bb) with gentle Rhodes-like harmonics
 * and a melodic bell top line. Zero external network assets required.
 */
function synthesizeDemoAudio(ctx: AudioContext): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const bpm = 110;
  const beatSec = 60 / bpm;
  const totalBeats = 16;
  const duration = beatSec * totalBeats;
  const numFrames = Math.floor(sampleRate * duration);

  const buffer = ctx.createBuffer(2, numFrames, sampleRate);
  const left = buffer.getChannelData(0);
  const right = buffer.getChannelData(1);

  // Chord progression frequencies (Root, 3rd, 5th, 7th/9th)
  // 1: C3, Eb3, G3, Bb3, D4
  // 2: Ab2, C3, Eb3, G3
  // 3: Eb3, G3, Bb3, D4
  // 4: Bb2, D3, F3, A3
  const chords = [
    [130.81, 155.56, 196.0, 233.08, 293.66],
    [103.83, 130.81, 155.56, 196.0],
    [155.56, 196.0, 233.08, 293.66],
    [116.54, 146.83, 174.61, 220.0],
  ];

  // Lead melody notes (Eb4, G4, F4, D4, C4, Bb3, C4...)
  const melodyNotes = [
    { beat: 0, freq: 311.13, dur: 1.5 },
    { beat: 2, freq: 392.0, dur: 1.0 },
    { beat: 3.5, freq: 349.23, dur: 0.5 },
    { beat: 4, freq: 293.66, dur: 2.0 },
    { beat: 7, freq: 311.13, dur: 0.8 },
    { beat: 8, freq: 261.63, dur: 1.8 },
    { beat: 10, freq: 233.08, dur: 1.2 },
    { beat: 12, freq: 261.63, dur: 3.0 },
  ];

  for (let c = 0; c < chords.length; c++) {
    const chordStartSec = c * 4 * beatSec;
    const chordDurSec = 4 * beatSec;
    const chordFreqs = chords[c];

    for (let f = 0; f < chordFreqs.length; f++) {
      const freq = chordFreqs[f];
      const startSample = Math.floor(chordStartSec * sampleRate);
      const endSample = Math.min(numFrames, Math.floor((chordStartSec + chordDurSec) * sampleRate));

      for (let i = startSample; i < endSample; i++) {
        const t = (i - startSample) / sampleRate;
        const env = Math.exp(-t * 0.45) * Math.min(1, t * 12);
        // Rich harmonic structure: fundamental + gentle 2nd and 3rd harmonics
        const sample =
          (Math.sin(2 * Math.PI * freq * t) * 0.55 +
            Math.sin(2 * Math.PI * freq * 2 * t) * 0.28 +
            Math.sin(2 * Math.PI * freq * 3 * t) * 0.12) *
          env *
          0.09;

        const pan = (f / (chordFreqs.length - 1) - 0.5) * 0.4; // subtle stereo spread
        left[i] += sample * (0.5 - pan);
        right[i] += sample * (0.5 + pan);
      }
    }
  }

  // Add lead melody
  for (const m of melodyNotes) {
    const startSec = m.beat * beatSec;
    const durSec = m.dur * beatSec;
    const startSample = Math.floor(startSec * sampleRate);
    const endSample = Math.min(numFrames, Math.floor((startSec + durSec) * sampleRate));

    for (let i = startSample; i < endSample; i++) {
      const t = (i - startSample) / sampleRate;
      const env = Math.exp(-t * 2.8) * Math.min(1, t * 40);
      const sample =
        (Math.sin(2 * Math.PI * m.freq * t) * 0.7 +
          Math.sin(2 * Math.PI * m.freq * 2 * t) * 0.2) *
        env *
        0.14;

      left[i] += sample * 0.55;
      right[i] += sample * 0.55;
    }
  }

  return buffer;
}

/**
 * Synthesize a simple stereophonic impulse response for the preview player
 */
function createPreviewImpulseResponse(ctx: AudioContext, decaySeconds = 2.4): AudioBuffer {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * decaySeconds);
  const ir = ctx.createBuffer(2, length, rate);
  const l = ir.getChannelData(0);
  const r = ir.getChannelData(1);

  for (let i = 0; i < length; i++) {
    const decay = Math.exp((-i / (rate * decaySeconds)) * 4.5);
    l[i] = (Math.random() * 2 - 1) * decay * 0.4;
    r[i] = (Math.random() * 2 - 1) * decay * 0.4;
  }
  return ir;
}

export function HeroVisual() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activePreset, setActivePreset] = useState<DemoPreset>(DEMO_PRESETS[1]); // Slowed + Reverb default
  const [sliderIntensity, setSliderIntensity] = useState(70);

  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const pannerOscRef = useRef<OscillatorNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const cachedBufferRef = useRef<AudioBuffer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize or get the AudioContext
  const getContext = useCallback(() => {
    if (!audioContextRef.current || audioContextRef.current.state === "closed") {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioContextRef.current = new AudioCtx();
    }
    return audioContextRef.current;
  }, []);

  const stopAudio = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
        sourceNodeRef.current.disconnect();
      } catch {
        // already stopped
      }
      sourceNodeRef.current = null;
    }
    if (pannerOscRef.current) {
      try {
        pannerOscRef.current.stop();
        pannerOscRef.current.disconnect();
      } catch {
        // already stopped
      }
      pannerOscRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const startAudio = useCallback(
    async (presetToPlay = activePreset, intensity = sliderIntensity) => {
      const ctx = getContext();
      if (ctx.state === "suspended") {
        await ctx.resume();
      }

      // Stop previous
      stopAudio();

      if (!cachedBufferRef.current) {
        cachedBufferRef.current = synthesizeDemoAudio(ctx);
      }

      const source = ctx.createBufferSource();
      source.buffer = cachedBufferRef.current;
      source.loop = true;

      // Rate adjusted by intensity slider
      const rateMod = 1 + ((intensity - 50) / 100) * 0.2;
      source.playbackRate.value = Math.max(0.3, Math.min(2.0, presetToPlay.playbackRate * rateMod));
      sourceNodeRef.current = source;

      // Filter node
      const filter = ctx.createBiquadFilter();
      if (presetToPlay.filterType) {
        filter.type = presetToPlay.filterType;
        filter.frequency.value = presetToPlay.filterFreq ?? 1000;
        if (presetToPlay.filterGain) filter.gain.value = presetToPlay.filterGain;
      } else {
        filter.type = "allpass";
      }
      filterNodeRef.current = filter;

      // Convolver & Reverb bus
      const convolver = ctx.createConvolver();
      convolver.buffer = createPreviewImpulseResponse(ctx, 2.2);

      const dry = ctx.createGain();
      const wet = ctx.createGain();
      const mix = Math.min(1, Math.max(0, presetToPlay.reverbMix * (intensity / 70)));
      dry.gain.value = Math.cos((mix * Math.PI) / 2);
      wet.gain.value = Math.sin((mix * Math.PI) / 2);
      dryGainRef.current = dry;
      wetGainRef.current = wet;

      // Panner
      const panner = ctx.createStereoPanner();
      panner.pan.value = 0;
      pannerRef.current = panner;

      if (presetToPlay.panMode === "orbit") {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = 0.25; // 4 second full cycle
        const depth = ctx.createGain();
        depth.gain.value = 0.88;
        osc.connect(depth);
        depth.connect(panner.pan);
        osc.start();
        pannerOscRef.current = osc;
      }

      // Analyser for real-time visualizer
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 128;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Output master
      const master = ctx.createGain();
      master.gain.value = 0.85;

      // Connect DSP graph:
      // source -> filter -> dry/wet -> panner -> master -> analyser -> destination
      source.connect(filter);

      filter.connect(dry);
      dry.connect(panner);

      filter.connect(convolver);
      convolver.connect(wet);
      wet.connect(panner);

      panner.connect(master);
      master.connect(analyser);
      analyser.connect(ctx.destination);

      source.start();
      setIsPlaying(true);
    },
    [activePreset, sliderIntensity, getContext, stopAudio]
  );

  const togglePlayback = () => {
    if (isPlaying) {
      stopAudio();
    } else {
      startAudio();
    }
  };

  const handleSelectPreset = (preset: DemoPreset) => {
    setActivePreset(preset);
    if (isPlaying) {
      startAudio(preset, sliderIntensity);
    }
  };

  const handleSliderChange = (newVal: number) => {
    setSliderIntensity(newVal);
    if (isPlaying && sourceNodeRef.current && dryGainRef.current && wetGainRef.current) {
      const rateMod = 1 + ((newVal - 50) / 100) * 0.2;
      sourceNodeRef.current.playbackRate.value = Math.max(
        0.3,
        Math.min(2.0, activePreset.playbackRate * rateMod)
      );
      const mix = Math.min(1, Math.max(0, activePreset.reverbMix * (newVal / 70)));
      dryGainRef.current.gain.value = Math.cos((mix * Math.PI) / 2);
      wetGainRef.current.gain.value = Math.sin((mix * Math.PI) / 2);
    }
  };

  // Real Web Audio FFT Analyser visualizer rendering on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      if (isPlaying && analyserRef.current && !reducedMotion) {
        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        const barWidth = (width / bufferLength) * 1.8;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const barHeight = (dataArray[i] / 255) * height * 0.88;
          const hue = 355; // crimson palette
          ctx.fillStyle = `hsla(${hue}, 80%, ${50 + (dataArray[i] / 255) * 20}%, 0.85)`;

          ctx.fillRect(x, height - barHeight, barWidth - 1.5, barHeight);
          x += barWidth;
        }

        // Draw overlay waveform center line
        const timeData = new Uint8Array(bufferLength);
        analyserRef.current.getByteTimeDomainData(timeData);
        ctx.beginPath();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";

        const sliceWidth = width / bufferLength;
        let wx = 0;
        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0;
          const y = (v * height) / 2;
          if (i === 0) ctx.moveTo(wx, y);
          else ctx.lineTo(wx, y);
          wx += sliceWidth;
        }
        ctx.stroke();
      } else {
        // Idle resting state: clean fine guides
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        ctx.lineTo(width, height / 2);
        ctx.stroke();

        // 5 subtle idle aesthetic bars
        const idlePillars = [0.2, 0.35, 0.55, 0.4, 0.25];
        const pWidth = 14;
        const gap = (width - idlePillars.length * pWidth) / (idlePillars.length + 1);
        for (let i = 0; i < idlePillars.length; i++) {
          const px = gap + i * (pWidth + gap);
          const pHeight = idlePillars[i] * height * 0.45;
          ctx.fillStyle = "rgba(229, 72, 77, 0.18)";
          ctx.fillRect(px, (height - pHeight) / 2, pWidth, pHeight);
        }
      }

      rafId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(rafId);
    };
  }, [isPlaying]);

  // Cleanup audio nodes on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioContextRef.current && audioContextRef.current.state !== "closed") {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [stopAudio]);

  return (
    <div className="relative mx-auto max-w-lg lg:max-w-none">
      {/* Studio hardware-inspired transformation panel */}
      <div className="rounded-2xl border border-line bg-surface/95 p-5 sm:p-6 shadow-[0_12px_40px_rgb(0_0_0/0.18)] backdrop-blur-md">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-line pb-3.5">
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                isPlaying ? "bg-accent shadow-[0_0_8px_var(--color-accent)] animate-pulse" : "bg-faint"
              )}
            />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-fg">
              Interactive Audio Demonstration
            </span>
          </div>

          <span className="rounded-full border border-accent/25 bg-accent-soft px-2.5 py-0.5 text-[10px] font-semibold text-accent">
            Live Web Audio DSP
          </span>
        </div>

        {/* Live Visualizer Stage */}
        <div className="relative mt-4 overflow-hidden rounded-xl border border-line bg-deep/90 p-4">
          <div className="flex items-center justify-between text-xs text-muted mb-2">
            <span className="flex items-center gap-1.5 font-mono text-[11px]">
              <Waveform className="h-3.5 w-3.5 text-accent" />
              {isPlaying
                ? "Live Web Audio Analyser (Real-time FFT)"
                : "Demo Synthesizer Stem · Ready to Audition"}
            </span>
            <span className="text-[10px] font-mono text-faint">
              {isPlaying ? "44.1 kHz · 32-bit Float" : "Zero download required"}
            </span>
          </div>

          {/* Real-time HTML5 Canvas Visualizer */}
          <canvas
            ref={canvasRef}
            width={480}
            height={90}
            className="w-full h-20 rounded-lg bg-surface/30"
          />

          {/* Player Bar: Play/Pause Button + Active Sound Details */}
          <div className="mt-3.5 flex items-center justify-between gap-3 pt-2 border-t border-line/60">
            <button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause audio demo" : "Play interactive audio demo"}
              className={cn(
                "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold text-white transition-all shadow-sm",
                isPlaying
                  ? "bg-surface border border-line text-fg hover:bg-raised"
                  : "bg-accent hover:bg-accent-hover shadow-[0_2px_12px_rgb(158_27_50_/_0.3)]"
              )}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-4 w-4 text-accent" weight="fill" />
                  <span>Pause Demo</span>
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" weight="fill" />
                  <span>Play Interactive Demo</span>
                </>
              )}
            </button>

            <div className="text-right">
              <p className="text-xs font-semibold text-fg">{activePreset.name}</p>
              <p className="text-[10px] text-muted">{activePreset.tagline}</p>
            </div>
          </div>
        </div>

        {/* Preset Selector Chips */}
        <div className="mt-4">
          <p className="text-[10px] font-mono uppercase tracking-wider text-faint mb-2">
            Click to compare preset DSP sound live:
          </p>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_PRESETS.map((preset) => {
              const active = activePreset.id === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  aria-pressed={active}
                  className={cn(
                    "rounded-xl border p-2 text-left transition-all",
                    active
                      ? "border-accent bg-accent-soft text-fg shadow-2xs font-semibold"
                      : "border-line bg-surface/80 text-muted hover:text-fg hover:border-line-strong hover:bg-surface"
                  )}
                >
                  <span className="block text-[11px] truncate">{preset.name}</span>
                  <span className="block text-[9px] text-faint truncate font-mono">
                    {preset.id === "original" ? "Dry source" : preset.playbackRate !== 1.0 ? `${preset.playbackRate}x speed` : "DSP filter"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Intensity Slider */}
        <div className="mt-4 rounded-xl border border-line bg-deep/40 p-3">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 font-medium text-fg">
              <SlidersHorizontal className="h-3.5 w-3.5 text-accent" />
              Effect Intensity / Speed Bias
            </span>
            <span className="font-mono text-xs text-accent font-semibold">{sliderIntensity}%</span>
          </div>
          <input
            type="range"
            min="20"
            max="120"
            value={sliderIntensity}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            aria-label="Effect intensity"
            className="mt-2 w-full accent-[var(--color-accent)] cursor-pointer"
          />
        </div>

        {/* Bottom Link to Full Studio */}
        <div className="mt-4 flex items-center justify-between pt-2">
          <span className="inline-flex items-center gap-1 text-[11px] text-faint">
            <SpeakerHigh className="h-3.5 w-3.5 text-muted" />
            100% in-browser Web Audio API
          </span>

          <Link
            href={activePreset.id === "original" ? "/studio" : `/studio?preset=${activePreset.id}`}
            className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            <span>Open in Studio</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
