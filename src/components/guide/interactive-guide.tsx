"use client";

import { useState, useId, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Waveform,
  Sliders,
  Sparkle,
  Cpu,
  ArrowsClockwise,
  Play,
  Pause,
  SpeakerSimpleHigh,
  SpeakerSimpleSlash,
  DownloadSimple,
  ShieldCheck,
  CheckCircle,
  Warning,
  ArrowRight,
  Headset,
  Cube,
  Gauge,
  Lightning,
  Funnel,
  Pulse,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// -------------------------------------------------------------
// 1. SIGNAL PIPELINE NODES
// -------------------------------------------------------------
interface PipelineNode {
  id: string;
  number: string;
  name: string;
  subname: string;
  badge: string;
  formula: string;
  summary: string;
  details: string;
  parameterExamples: string[];
}

const PIPELINE_NODES: PipelineNode[] = [
  {
    id: "ingest",
    number: "01",
    name: "Audio Buffer Ingest",
    subname: "DecodeAudioData",
    badge: "32-bit Float PCM",
    formula: "S[n] ∈ [-1.0, +1.0] @ 44.1/48.0 kHz",
    summary:
      "When you drag and drop a file, the browser decodes compressed MP3, AAC, FLAC, or WAV containers into uncompressed 32-bit floating-point linear PCM sample buffers in volatile tab memory.",
    details:
      "Unlike cloud audio converters that send files to remote servers, Audify never uploads audio. Decoding takes milliseconds on modern multi-core CPUs and preserves full dynamic headroom (+770 dB before digital clipping).",
    parameterExamples: ["Stereo L/R Channels", "44,100 / 48,000 Hz Sample Rate", "Volatile Browser RAM (~50 MB per 5 min)"],
  },
  {
    id: "resampler",
    number: "02",
    name: "Varispeed / Resampler",
    subname: "AudioBufferSourceNode",
    badge: "Pitch & Tempo",
    formula: "f_out = f_in × playbackRate;   Δst = 12 × log₂(rate)",
    summary:
      "Modulates playback speed and pitch. In Varispeed mode, changing speed naturally alters musical pitch (like vinyl or tape). For independent pitch shifting, polyphase sinc interpolation shifts semitones while preserving time.",
    details:
      "For Slowed + Reverb, rate is set to 0.85× (-2.83 semitones). For Nightcore, rate is pushed to 1.35× alongside a +3.0 semitone lift for an energetic +7.87 semitones total transposition.",
    parameterExamples: ["Speed Multiplier: 0.50× to 2.00×", "Pitch Shift: -12.0 to +12.0 semitones", "Sinc Resampling Quality"],
  },
  {
    id: "eq",
    number: "03",
    name: "3-Band Parametric EQ",
    subname: "BiquadFilterNode Cascade",
    badge: "Tone Sculpting",
    formula: "H(s) = (s² + (ω₀/Q)s + ω₀²) / (s² + (ω₀/Q_p)s + ω₀²)",
    summary:
      "Shapes low-end warmth, vocal clarity, and airy sparkle using calibrated second-order IIR biquad filters with smooth phase response.",
    details:
      "Consists of a Low-Shelf at 120 Hz, Peaking Bell filter at 2.4 kHz (Q = 1.0) for vocal presence, and High-Shelf at 9 kHz for cymbal and breath air.",
    parameterExamples: ["Low Shelf (120 Hz): -15 dB to +15 dB", "Mid Peak (2.4 kHz): -12 dB to +12 dB", "High Shelf (9.0 kHz): -12 dB to +12 dB"],
  },
  {
    id: "filter",
    number: "04",
    name: "Biquad Tone Filter",
    subname: "Resonant Filter",
    badge: "Character & Haze",
    formula: "fc ∈ [100 Hz, 18 kHz];   Q ∈ [0.5, 6.0]",
    summary:
      "Applies stylistic frequency attenuation. Used in Underwater (450 Hz lowpass), Telephone (bandpass 400 Hz–3.5 kHz), and Lo-Fi warmth presets.",
    details:
      "Implements Butterworth and Chebyshev filter contours to create moody, vintage, or lo-fi acoustic profiles without phase smearing.",
    parameterExamples: ["Cutoff Frequency: 200 Hz – 16 kHz", "Filter Resonance (Q): 0.707 (critically damped)", "Modes: Lowpass, Highpass, Bandpass"],
  },
  {
    id: "convolver",
    number: "05",
    name: "Convolution Reverb",
    subname: "ConvolverNode",
    badge: "Acoustic Impulse",
    formula: "y[n] = (x * h)[n] = ∑ x[k] · h[n - k]",
    summary:
      "Mathematical convolution between the audio stream and synthetic room impulse response buffers to simulate real spaces: bathrooms, halls, and cathedrals.",
    details:
      "Synthesizes exponential decaying white noise shaped with high-frequency absorption curves. Audify dynamically extends the render window to ensure reverberation decay tails are never cut off.",
    parameterExamples: ["Impulse Decay: 0.65s (Bathroom) to 6.5s (Cathedral)", "Wet/Dry Blend: 0% to 100%", "Pre-delay: 10 ms to 45 ms"],
  },
  {
    id: "spatial",
    number: "06",
    name: "8D Spatial Panner",
    subname: "StereoPanner + LFO",
    badge: "Binaural Motion",
    formula: "pan(t) = sin(2π · f_orbit · t);   ITD ≈ 0.65ms · sin(θ)",
    summary:
      "Simulates circular 360-degree sound rotation around the listener's head by modulating stereophonic pan azimuth using an LFO oscillator.",
    details:
      "Exploits Interaural Time Difference (ITD) and Interaural Level Difference (ILD). Requires headphones to prevent acoustic crosstalk in the open air.",
    parameterExamples: ["Orbit Rate: 0.05 Hz to 0.20 Hz (5s to 20s/circle)", "Stereo Width: 100% to 180%", "Headphone-optimized phase curve"],
  },
  {
    id: "limiter",
    number: "07",
    name: "Look-Ahead Peak Limiter",
    subname: "Master Headroom Guard",
    badge: "-0.3 dBFS True-Peak",
    formula: "y[n] = min(x[n], 10^(-0.3/20));   Look-ahead = 5ms",
    summary:
      "Guarantees that hot signals, heavy bass boosts, and resonant filter peaks never cause harsh digital clipping distortion upon export.",
    details:
      "Provides inter-sample safety headroom. Ensures pristine exports across both 24-bit / 32-bit float WAV and high-bitrate MP3 encoders.",
    parameterExamples: ["Ceiling: -0.3 dBFS (-0.035 linear)", "Look-Ahead Buffer: 5.0 milliseconds", "Release Envelope: 50 ms smooth recovery"],
  },
];

// -------------------------------------------------------------
// 2. EXPORT FORMAT MATRIX
// -------------------------------------------------------------
const FORMAT_SPECS = [
  {
    id: "wav-24",
    name: "WAV (24-bit PCM)",
    badge: "Lossless Master",
    sampleRate: "44.1 / 48.0 kHz",
    bitrate: "2,304 kbps",
    dynamicRange: "144 dB",
    sizePer3Min: "~31.7 MB",
    compression: "Uncompressed Linear PCM",
    bestFor: "Music production, master archival, video editing sync",
    recommended: true,
  },
  {
    id: "wav-32",
    name: "WAV (32-bit Float)",
    badge: "Infinite Headroom",
    sampleRate: "44.1 / 48.0 kHz",
    bitrate: "3,072 kbps",
    dynamicRange: "1,528 dB (+770 dB headroom)",
    sizePer3Min: "~42.3 MB",
    compression: "Floating Point Uncompressed",
    bestFor: "DAW interchange, multi-pass processing, zero clipping risk",
    recommended: false,
  },
  {
    id: "mp3-320",
    name: "MP3 (320 kbps CBR)",
    badge: "High-Fidelity Web",
    sampleRate: "44.1 kHz",
    bitrate: "320 kbps CBR",
    dynamicRange: "~96 dB perceptual",
    sizePer3Min: "~7.2 MB",
    compression: "LAME Psychoacoustic (Psy-Model)",
    bestFor: "Everyday listening, streaming sharing, mobile playback",
    recommended: true,
  },
  {
    id: "mp3-192",
    name: "MP3 (192 kbps CBR)",
    badge: "Compact Mobile",
    sampleRate: "44.1 kHz",
    bitrate: "192 kbps CBR",
    dynamicRange: "~90 dB perceptual",
    sizePer3Min: "~4.3 MB",
    compression: "LAME Psychoacoustic Medium",
    bestFor: "Messaging sharing, podcast previews, low data usage",
    recommended: false,
  },
];

// -------------------------------------------------------------
// MAIN COMPONENT
// -------------------------------------------------------------
export function InteractiveAudioGuide() {
  // Signal Chain Interactive State
  const [activeNodeId, setActiveNodeId] = useState<string>("resampler");

  // Speed & Pitch Calculator State
  const [speed, setSpeed] = useState<number>(0.85);
  const [pitchMode, setPitchMode] = useState<"varispeed" | "decoupled">("varispeed");
  const [independentSemitones, setIndependentSemitones] = useState<number>(0);

  // 8D Orbit State
  const [isOrbiting, setIsOrbiting] = useState<boolean>(true);
  const [orbitAngle, setOrbitAngle] = useState<number>(45);
  const [orbitDuration, setOrbitDuration] = useState<number>(12); // seconds per rotation
  const [stereoWidth, setStereoWidth] = useState<number>(100);

  // EQ Spectrum State
  const [selectedBand, setSelectedBand] = useState<string>("sub");
  const [bassGain, setBassGain] = useState<number>(7.0);

  // Reverb Chamber State
  const [selectedRoom, setSelectedRoom] = useState<"bathroom" | "studio" | "hall" | "cathedral">("hall");
  const [wetMix, setWetMix] = useState<number>(35);

  // Format Matrix State
  const [selectedFormat, setSelectedFormat] = useState<string>("wav-24");

  // Orbit animation loop
  const requestRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOrbiting) {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const animate = (time: number) => {
      if (lastTimeRef.current !== null) {
        const delta = (time - lastTimeRef.current) / 1000;
        const degreesPerSec = 360 / orbitDuration;
        setOrbitAngle((prev) => (prev + degreesPerSec * delta) % 360);
      }
      lastTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      lastTimeRef.current = null;
    };
  }, [isOrbiting, orbitDuration]);

  // Speed & Pitch live calculations
  const calculatedOutputs = useMemo(() => {
    const baseDurationSec = 210; // 3:30 song
    const newDurationSec = Math.round(baseDurationSec / speed);
    const newMin = Math.floor(newDurationSec / 60);
    const newSec = Math.floor(newDurationSec % 60);
    const durationFormatted = `${newMin}:${newSec < 10 ? "0" : ""}${newSec}`;

    let totalSemitones = 0;
    if (pitchMode === "varispeed") {
      totalSemitones = 12 * Math.log2(speed);
    } else {
      totalSemitones = independentSemitones;
    }

    const cents = Math.round(totalSemitones * 100);
    const sign = totalSemitones >= 0 ? "+" : "";

    return {
      duration: durationFormatted,
      durationRatio: ((newDurationSec / baseDurationSec) * 100).toFixed(0),
      semitonesFormatted: `${sign}${totalSemitones.toFixed(2)} st`,
      centsFormatted: `${sign}${cents} cents`,
      keyDirection:
        totalSemitones > 0.4
          ? `Transposed up ${Math.abs(Math.round(totalSemitones))} half-steps`
          : totalSemitones < -0.4
          ? `Transposed down ${Math.abs(Math.round(totalSemitones))} half-steps`
          : "Standard Pitch (A4 = 440 Hz)",
    };
  }, [speed, pitchMode, independentSemitones]);

  // 8D ITD / ILD calculations
  const orbitCalculations = useMemo(() => {
    const rad = (orbitAngle * Math.PI) / 180;
    // pan value from -1 (left) to +1 (right)
    const panValue = Math.sin(rad) * (stereoWidth / 100);
    const clampedPan = Math.max(-1, Math.min(1, panValue));

    // Left and Right ear amplitudes
    const leftGain = Math.cos(((clampedPan + 1) * Math.PI) / 4);
    const rightGain = Math.sin(((clampedPan + 1) * Math.PI) / 4);

    // Interaural Time Difference (max ~0.65 ms across average human head)
    const itdMs = (Math.sin(rad) * 0.65).toFixed(2);
    // Interaural Level Difference (up to ~12 dB)
    const ildDb = (clampedPan * 12).toFixed(1);

    const xPos = 50 + 38 * Math.sin(rad);
    const yPos = 50 - 38 * Math.cos(rad);

    return {
      panValue: clampedPan.toFixed(2),
      leftPercent: Math.round(leftGain * 100),
      rightPercent: Math.round(rightGain * 100),
      itdMs,
      ildDb,
      xPos,
      yPos,
    };
  }, [orbitAngle, stereoWidth]);

  // Active Node Details
  const activeNode = useMemo(
    () => PIPELINE_NODES.find((n) => n.id === activeNodeId) || PIPELINE_NODES[0],
    [activeNodeId]
  );

  return (
    <div className="space-y-16">
      {/* ========================================================= */}
      {/* LAB SECTION 1: INTERACTIVE DSP SIGNAL CHAIN */}
      {/* ========================================================= */}
      <section aria-labelledby="pipeline-heading" className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-violet">
              <Cpu className="h-4 w-4" weight="bold" />
              <span className="text-xs font-semibold uppercase tracking-wider">
                Real-Time Audio Graph
              </span>
            </div>
            <h2 id="pipeline-heading" className="text-2xl font-bold tracking-tight text-fg mt-1">
              Interactive Web Audio DSP Pipeline
            </h2>
            <p className="text-sm text-muted mt-1 max-w-2xl">
              Audify runs 100% inside your browser using the HTML5 Web Audio API. Click any processing node below to inspect its mathematical transfer function, buffer lifecycle, and acoustic parameters.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-mono font-medium text-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            32-bit Float Headroom Active
          </span>
        </div>

        {/* Visual Node Flow Strip */}
        <div className="overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-[780px] p-1.5 rounded-2xl border border-line bg-surface/50">
            {PIPELINE_NODES.map((node, index) => {
              const isActive = node.id === activeNodeId;
              return (
                <div key={node.id} className="flex items-center flex-1">
                  <button
                    type="button"
                    onClick={() => setActiveNodeId(node.id)}
                    className={cn(
                      "group relative flex-1 rounded-xl p-3 text-left transition-all",
                      isActive
                        ? "bg-violet text-white shadow-md shadow-violet/20"
                        : "bg-surface border border-line/60 text-fg hover:border-violet/50 hover:bg-surface/80"
                    )}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span
                        className={cn(
                          "text-[10px] font-mono font-semibold",
                          isActive ? "text-white/80" : "text-muted"
                        )}
                      >
                        {node.number}
                      </span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.2 text-[9px] font-medium tracking-wide",
                          isActive ? "bg-white/20 text-white" : "bg-black/5 dark:bg-white/5 text-muted"
                        )}
                      >
                        {node.badge}
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate">{node.name}</div>
                    <div
                      className={cn(
                        "text-[10px] font-mono truncate mt-0.5",
                        isActive ? "text-white/80" : "text-muted"
                      )}
                    >
                      {node.subname}
                    </div>
                  </button>
                  {index < PIPELINE_NODES.length - 1 && (
                    <div className="px-1 text-muted/40 font-mono text-xs">➔</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Node Inspector Card */}
        <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-line pb-5">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-violet font-semibold uppercase">
                <span>Node {activeNode.number}</span>
                <span>•</span>
                <span>{activeNode.subname}</span>
              </div>
              <h3 className="text-xl font-bold text-fg mt-1">{activeNode.name}</h3>
            </div>
            <div className="rounded-xl border border-line bg-canvas px-4 py-2 font-mono text-xs text-violet">
              <span className="text-muted mr-2">Formula:</span>
              <span className="font-semibold">{activeNode.formula}</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">
                Acoustic Operation & Theory
              </h4>
              <p className="text-sm text-fg leading-relaxed">{activeNode.summary}</p>
              <p className="text-xs text-muted leading-relaxed">{activeNode.details}</p>
            </div>

            <div className="space-y-3 rounded-xl border border-line bg-canvas/60 p-4">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted flex items-center gap-1.5">
                <Sliders className="h-3.5 w-3.5 text-violet" />
                <span>Configured Parameters & Bounds</span>
              </h4>
              <ul className="space-y-2 text-xs text-fg">
                {activeNode.parameterExamples.map((param, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{param}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 pt-3 border-t border-line/60 flex items-center justify-between text-xs">
                <span className="text-muted">Test in live engine:</span>
                <Link
                  href="/studio"
                  className="font-medium text-violet hover:underline inline-flex items-center gap-1"
                >
                  <span>Open Studio</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* LAB SECTION 2: SPEED, PITCH & VARISPEED CALCULATOR */}
      {/* ========================================================= */}
      <section aria-labelledby="speed-pitch-heading" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-violet">
            <Gauge className="h-4 w-4" weight="bold" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Acoustic Calculator
            </span>
          </div>
          <h2 id="speed-pitch-heading" className="text-2xl font-bold tracking-tight text-fg mt-1">
            Understanding Speed vs. Pitch Math
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Experiment with tempo and pitch multipliers. Learn how the viral Slowed + Reverb and Nightcore aesthetics derive their exact acoustic formulas.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Controls Column */}
          <div className="lg:col-span-7 rounded-2xl border border-line bg-surface p-6 space-y-6">
            {/* Mode Toggle */}
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Resampling Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPitchMode("varispeed")}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    pitchMode === "varispeed"
                      ? "border-violet bg-violet/10 text-fg"
                      : "border-line bg-canvas text-muted hover:border-violet/40"
                  )}
                >
                  <div className="text-xs font-bold text-fg">Varispeed (Analog Tape)</div>
                  <div className="text-[11px] text-muted mt-0.5">
                    Speed & pitch linked. Slowing drops musical key.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPitchMode("decoupled")}
                  className={cn(
                    "rounded-xl border p-3 text-left transition-all",
                    pitchMode === "decoupled"
                      ? "border-violet bg-violet/10 text-fg"
                      : "border-line bg-canvas text-muted hover:border-violet/40"
                  )}
                >
                  <div className="text-xs font-bold text-fg">Decoupled Resampling</div>
                  <div className="text-[11px] text-muted mt-0.5">
                    Independent tempo and semitone transposition.
                  </div>
                </button>
              </div>
            </div>

            {/* Speed Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg">Playback Speed Multiplier</span>
                <span className="font-mono font-bold text-violet text-sm">{speed.toFixed(2)}×</span>
              </div>
              <input
                type="range"
                min="0.50"
                max="2.00"
                step="0.01"
                value={speed}
                onChange={(e) => setSpeed(parseFloat(e.target.value))}
                className="w-full accent-violet"
              />
              {/* Presets quick buttons */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] text-muted self-center mr-1">Quick presets:</span>
                {[
                  { label: "Super Slowed", val: 0.6 },
                  { label: "Slowed + Reverb", val: 0.85 },
                  { label: "Original (1.0×)", val: 1.0 },
                  { label: "Sped-Up", val: 1.2 },
                  { label: "Nightcore", val: 1.35 },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => {
                      setSpeed(item.val);
                      if (item.val === 1.35 && pitchMode === "decoupled") {
                        setIndependentSemitones(3.0);
                      }
                    }}
                    className={cn(
                      "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
                      Math.abs(speed - item.val) < 0.01
                        ? "bg-violet text-white"
                        : "bg-canvas border border-line text-muted hover:text-fg"
                    )}
                  >
                    {item.label} ({item.val}×)
                  </button>
                ))}
              </div>
            </div>

            {/* Independent Pitch Slider (if decoupled) */}
            {pitchMode === "decoupled" && (
              <div className="space-y-3 pt-3 border-t border-line">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg">Independent Pitch Shift</span>
                  <span className="font-mono font-bold text-violet text-sm">
                    {independentSemitones >= 0 ? "+" : ""}
                    {independentSemitones.toFixed(1)} semitones
                  </span>
                </div>
                <input
                  type="range"
                  min="-12.0"
                  max="12.0"
                  step="0.5"
                  value={independentSemitones}
                  onChange={(e) => setIndependentSemitones(parseFloat(e.target.value))}
                  className="w-full accent-violet"
                />
              </div>
            )}
          </div>

          {/* Real-time Math Display Column */}
          <div className="lg:col-span-5 rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Mathematical Output
                </span>
                <span className="text-xs font-mono text-emerald-500 font-semibold">
                  Sample-Accurate
                </span>
              </div>

              {/* Metric 1: Timeline Duration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">New Song Duration (from 3:30 base)</span>
                  <span className="font-mono font-bold text-fg text-sm">
                    {calculatedOutputs.duration}
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas border border-line overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet to-pink-500 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(25, Number(calculatedOutputs.durationRatio) / 1.5))}%` }}
                  />
                </div>
                <span className="text-[10px] text-muted font-mono">
                  Timeline scale: {calculatedOutputs.durationRatio}% of original length
                </span>
              </div>

              {/* Metric 2: Pitch Shift */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Pitch Transposition</span>
                  <span className="font-mono font-bold text-violet text-sm">
                    {calculatedOutputs.semitonesFormatted}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-muted">
                  <span>Fine Pitch (Cents)</span>
                  <span>{calculatedOutputs.centsFormatted}</span>
                </div>
                <div className="text-[11px] font-medium text-fg pt-1 border-t border-line/60">
                  {calculatedOutputs.keyDirection}
                </div>
              </div>
            </div>

            <div className="text-xs text-muted leading-relaxed p-3 rounded-xl bg-canvas border border-line/60">
              <strong className="text-fg font-semibold">Why this matters:</strong> Slowing to 0.85× lowers vocal formants and tempo, giving slowed tracks their warm, melancholic tone. Speeding up to 1.35× raises vocal pitch into the high soprano register.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* LAB SECTION 3: 8D BINAURAL ORBIT SIMULATOR */}
      {/* ========================================================= */}
      <section aria-labelledby="spatial-heading" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-violet">
            <Headset className="h-4 w-4" weight="bold" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Psychoacoustic Simulation
            </span>
          </div>
          <h2 id="spatial-heading" className="text-2xl font-bold tracking-tight text-fg mt-1">
            8D Audio & Binaural Phase Acoustics
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            8D audio creates the illusion of a physical band walking in circles around you. Watch how Interaural Time Difference (ITD) and Level Difference (ILD) guide the stereo field.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Visual Head Canvas Column */}
          <div className="lg:col-span-7 rounded-2xl border border-line bg-surface p-6 flex flex-col items-center justify-center relative min-h-[340px]">
            {/* SVG Binaural Orbital Model */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                {/* Orbital Guide Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  className="text-line"
                />

                {/* Cardinal Angle Labels */}
                <text x="50" y="8" textAnchor="middle" className="text-[4px] fill-muted font-mono">0° FRONT</text>
                <text x="94" y="52" textAnchor="start" className="text-[4px] fill-muted font-mono">90° RIGHT</text>
                <text x="50" y="96" textAnchor="middle" className="text-[4px] fill-muted font-mono">180° BACK</text>
                <text x="6" y="52" textAnchor="end" className="text-[4px] fill-muted font-mono">270° LEFT</text>

                {/* Human Head Silhouette */}
                <circle cx="50" cy="50" r="16" fill="currentColor" className="text-line/40" />
                {/* Nose pointing to 0° */}
                <polygon points="50,30 47,35 53,35" fill="currentColor" className="text-violet" />

                {/* Left Ear */}
                <ellipse cx="33" cy="50" rx="2.5" ry="5" fill="currentColor" className={cn(orbitCalculations.leftPercent > 60 ? "text-violet" : "text-muted")} />
                <text x="28" y="52" textAnchor="end" className="text-[4px] font-mono fill-muted">L</text>

                {/* Right Ear */}
                <ellipse cx="67" cy="50" rx="2.5" ry="5" fill="currentColor" className={cn(orbitCalculations.rightPercent > 60 ? "text-violet" : "text-muted")} />
                <text x="72" y="52" textAnchor="start" className="text-[4px] font-mono fill-muted">R</text>

                {/* Sound Source Satellite */}
                <circle
                  cx={orbitCalculations.xPos}
                  cy={orbitCalculations.yPos}
                  r="5"
                  fill="#772bee"
                  className="shadow-lg"
                />
                <circle
                  cx={orbitCalculations.xPos}
                  cy={orbitCalculations.yPos}
                  r="9"
                  fill="#772bee"
                  opacity="0.3"
                  className="animate-ping"
                />

                {/* Sound wave ray toward listener */}
                <line
                  x1={orbitCalculations.xPos}
                  y1={orbitCalculations.yPos}
                  x2="50"
                  y2="50"
                  stroke="#772bee"
                  strokeWidth="0.8"
                  strokeDasharray="1 1"
                  opacity="0.5"
                />
              </svg>
            </div>

            {/* Orbit Playback Toggle */}
            <div className="mt-4 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsOrbiting(!isOrbiting)}
                className="inline-flex items-center gap-2 rounded-xl bg-violet px-4 py-2 text-xs font-semibold text-white hover:bg-violet-dark transition-colors"
              >
                {isOrbiting ? <Pause size={14} weight="bold" /> : <Play size={14} weight="bold" />}
                <span>{isOrbiting ? "Pause Orbit" : "Resume Orbit"}</span>
              </button>
              <span className="text-xs font-mono text-muted">
                Azimuth: {Math.round(orbitAngle)}°
              </span>
            </div>
          </div>

          {/* Live Binaural Telemetry Column */}
          <div className="lg:col-span-5 rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Binaural Channel Telemetry
                </span>
                <span className="text-xs font-mono text-violet font-semibold">
                  Stereo LFO
                </span>
              </div>

              {/* Left Channel Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg">Left Ear Perception</span>
                  <span className="font-mono text-violet">{orbitCalculations.leftPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas border border-line overflow-hidden">
                  <div
                    className="h-full bg-violet rounded-full transition-all"
                    style={{ width: `${orbitCalculations.leftPercent}%` }}
                  />
                </div>
              </div>

              {/* Right Channel Bar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-fg">Right Ear Perception</span>
                  <span className="font-mono text-pink-500">{orbitCalculations.rightPercent}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-canvas border border-line overflow-hidden">
                  <div
                    className="h-full bg-pink-500 rounded-full transition-all"
                    style={{ width: `${orbitCalculations.rightPercent}%` }}
                  />
                </div>
              </div>

              {/* ITD and ILD metrics */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-xl border border-line bg-canvas p-3">
                  <div className="text-[10px] font-mono uppercase text-muted">Time Delta (ITD)</div>
                  <div className="text-base font-bold text-fg mt-0.5 font-mono">
                    {orbitCalculations.itdMs} ms
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">Ear Arrival Offset</div>
                </div>

                <div className="rounded-xl border border-line bg-canvas p-3">
                  <div className="text-[10px] font-mono uppercase text-muted">Level Delta (ILD)</div>
                  <div className="text-base font-bold text-fg mt-0.5 font-mono">
                    {orbitCalculations.ildDb} dB
                  </div>
                  <div className="text-[10px] text-muted mt-0.5">Head Shadow Volume</div>
                </div>
              </div>
            </div>

            {/* Headphone Requirement Alert */}
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 flex items-start gap-3">
              <Headset className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-xs text-muted leading-relaxed">
                <strong className="text-fg font-semibold">Headphones are mandatory:</strong> On speakers, sound from the left speaker bleeds through room air into your right ear (acoustic crosstalk), destroying the 360-degree illusion.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* LAB SECTION 4: FREQUENCY SPECTRUM & EQ */}
      {/* ========================================================= */}
      <section aria-labelledby="eq-heading" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-violet">
            <Pulse className="h-4 w-4" weight="bold" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Acoustic Spectrum
            </span>
          </div>
          <h2 id="eq-heading" className="text-2xl font-bold tracking-tight text-fg mt-1">
            Equalization, Bass Curves & Headroom Safety
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Understand how low-shelf and peaking filters alter frequency energy. Watch how boosting bass reduces digital headroom and triggers the −0.3 dBFS true-peak limiter.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Frequency Bands Selector */}
          <div className="lg:col-span-7 rounded-2xl border border-line bg-surface p-6 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted">
                Inspect Acoustic Frequency Bands
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { id: "sub", label: "Sub-Bass", hz: "20–60 Hz", role: "Chest rumble, 808 subs" },
                  { id: "bass", label: "Bass & Kick", hz: "60–250 Hz", role: "Punch, kick fundamentals" },
                  { id: "lowmid", label: "Low-Mids", hz: "250–500 Hz", role: "Warmth or boxiness" },
                  { id: "mid", label: "Midrange", hz: "500–2 kHz", role: "Vocal body, guitars" },
                  { id: "highmid", label: "High-Mids", hz: "2–6 kHz", role: "Vocal presence, bite" },
                  { id: "air", label: "Treble & Air", hz: "6–20 kHz", role: "Cymbal shimmer, breath" },
                ].map((band) => (
                  <button
                    key={band.id}
                    type="button"
                    onClick={() => setSelectedBand(band.id)}
                    className={cn(
                      "rounded-xl border p-2.5 text-left transition-all",
                      selectedBand === band.id
                        ? "border-violet bg-violet/10 text-fg"
                        : "border-line bg-canvas text-muted hover:border-violet/40"
                    )}
                  >
                    <div className="text-xs font-bold text-fg">{band.label}</div>
                    <div className="text-[10px] font-mono text-violet">{band.hz}</div>
                    <div className="text-[10px] text-muted truncate mt-0.5">{band.role}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Bass Boost Slider */}
            <div className="space-y-3 pt-3 border-t border-line">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg">Low-Shelf Gain Boost (85 Hz)</span>
                <span className="font-mono font-bold text-violet text-sm">+{bassGain.toFixed(1)} dB</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="15.0"
                step="0.5"
                value={bassGain}
                onChange={(e) => setBassGain(parseFloat(e.target.value))}
                className="w-full accent-violet"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted">
                <span>0 dB (Flat)</span>
                <span>+3.5 dB (Light)</span>
                <span>+7.0 dB (Medium)</span>
                <span>+10.5 dB (Heavy)</span>
                <span>+15.0 dB (Extreme)</span>
              </div>
            </div>
          </div>

          {/* Headroom Limiter Telemetry */}
          <div className="lg:col-span-5 rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Digital Headroom Meter
                </span>
                <span className="text-xs font-mono text-emerald-500 font-semibold">
                  Limiter Guard
                </span>
              </div>

              {/* Peak dBFS indicator */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Pre-Limiter Peak Level</span>
                  <span className={cn(
                    "font-mono font-bold text-sm",
                    bassGain > 6 ? "text-amber-500" : "text-fg"
                  )}>
                    {bassGain > 0 ? `+${(bassGain * 0.7).toFixed(1)} dBFS` : "0.0 dBFS"}
                  </span>
                </div>
                <div className="h-3 w-full rounded-full bg-canvas border border-line p-0.5">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      bassGain > 8 ? "bg-red-500" : bassGain > 4 ? "bg-amber-500" : "bg-emerald-500"
                    )}
                    style={{ width: `${Math.min(100, 30 + bassGain * 5)}%` }}
                  />
                </div>
              </div>

              {/* Post-Limiter Clamped Output */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted">Master Export True-Peak</span>
                  <span className="font-mono font-bold text-emerald-500 text-sm">
                    −0.3 dBFS Clamped
                  </span>
                </div>
                <p className="text-xs text-muted leading-relaxed">
                  Even when extreme +15 dB bass boost is applied, Audify&apos;s look-ahead limiter prevents inter-sample digital clipping by clamping instantaneous peaks to −0.3 dBFS.
                </p>
              </div>
            </div>

            <div className="text-xs text-muted leading-relaxed">
              <strong className="text-fg font-semibold">Speaker limits:</strong> Boosting frequencies below 40 Hz on small smartphone or laptop speakers produces no audible bass and only causes distortion. Heavy bass boost is tuned for subwoofers and over-ear headphones.
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* LAB SECTION 5: ACOUSTIC REVERB CHAMBERS */}
      {/* ========================================================= */}
      <section aria-labelledby="reverb-heading" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-violet">
            <Cube className="h-4 w-4" weight="bold" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Acoustic Architecture
            </span>
          </div>
          <h2 id="reverb-heading" className="text-2xl font-bold tracking-tight text-fg mt-1">
            Convolution Reverb & Room Impulse Modeling
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Reverberation is the acoustic persistence of sound after its source stops. Inspect the synthetic impulse response curves that Audify convolves with your audio.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-12">
          {/* Room Environment Selection */}
          <div className="lg:col-span-7 rounded-2xl border border-line bg-surface p-6 space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "bathroom", name: "Tiled Bathroom", decay: "0.65s", damp: "0.75", desc: "Hard ceramic early reflections, tight bright decay" },
                { id: "studio", name: "Small Studio", decay: "1.10s", damp: "0.50", desc: "Acoustically treated warmth without mud" },
                { id: "hall", name: "Concert Hall", decay: "3.20s", damp: "0.35", desc: "Expansive multi-tier orchestral reflection decay" },
                { id: "cathedral", name: "Gothic Cathedral", decay: "6.50s", damp: "0.20", desc: "Cavernous stone arch echoes with huge decay tail" },
              ].map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => setSelectedRoom(room.id as typeof selectedRoom)}
                  className={cn(
                    "rounded-xl border p-3.5 text-left transition-all",
                    selectedRoom === room.id
                      ? "border-violet bg-violet/10 text-fg"
                      : "border-line bg-canvas text-muted hover:border-violet/40"
                  )}
                >
                  <div className="text-xs font-bold text-fg">{room.name}</div>
                  <div className="flex items-center gap-2 text-[10px] font-mono text-violet mt-1">
                    <span>Decay: {room.decay}</span>
                    <span>•</span>
                    <span>Damp: {room.damp}</span>
                  </div>
                  <p className="text-[11px] text-muted mt-1 leading-relaxed">{room.desc}</p>
                </button>
              ))}
            </div>

            {/* Wet / Dry Mix Slider */}
            <div className="space-y-3 pt-3 border-t border-line">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-fg">Reverb Wet/Dry Blend</span>
                <span className="font-mono font-bold text-violet text-sm">{wetMix}% Wet</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={wetMix}
                onChange={(e) => setWetMix(parseInt(e.target.value, 10))}
                className="w-full accent-violet"
              />
              <div className="flex justify-between text-[10px] font-mono text-muted">
                <span>0% (100% Dry Source)</span>
                <span>35% (Slowed + Reverb sweetspot)</span>
                <span>100% (Ambient Wash)</span>
              </div>
            </div>
          </div>

          {/* Impulse Response Curve Display */}
          <div className="lg:col-span-5 rounded-2xl border border-line bg-surface p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-line pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Synthetic Impulse Response (IR)
                </span>
                <span className="text-xs font-mono text-violet">Convolver Node</span>
              </div>

              {/* Synthetic decay waveform illustration */}
              <div className="h-28 w-full rounded-xl border border-line bg-canvas p-3 flex items-end gap-1">
                {Array.from({ length: 32 }).map((_, i) => {
                  const decayFactor = Math.exp(-i / 8);
                  const heightPercent = Math.max(10, Math.round(decayFactor * 90 * (wetMix / 50)));
                  return (
                    <div
                      key={i}
                      className="flex-1 rounded-t bg-violet/70 transition-all"
                      style={{ height: `${heightPercent}%` }}
                    />
                  );
                })}
              </div>

              <div className="text-xs text-muted leading-relaxed">
                <strong className="text-fg font-semibold">Automatic Tail Extension:</strong> When exporting tracks with long reverbs, Audify extends the render buffer length by the impulse duration so your final reverberation tail never clips off abruptly.
              </div>
            </div>

            <div className="pt-3 border-t border-line/60 flex items-center justify-between text-xs">
              <span className="text-muted">Test in live engine:</span>
              <Link
                href="/presets"
                className="font-medium text-violet hover:underline inline-flex items-center gap-1"
              >
                <span>Browse Reverb Presets</span>
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* LAB SECTION 6: FORMAT & EXPORT QUALITY MATRIX */}
      {/* ========================================================= */}
      <section aria-labelledby="formats-heading" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-violet">
            <DownloadSimple className="h-4 w-4" weight="bold" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Export Architecture
            </span>
          </div>
          <h2 id="formats-heading" className="text-2xl font-bold tracking-tight text-fg mt-1">
            Export Format & Bitrate Decision Matrix
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            Choose the optimal export encoding. Understand the mathematical tradeoffs between uncompressed linear PCM and lossy psychoacoustic MP3 encoding.
          </p>
        </div>

        {/* Format Selector Pills */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FORMAT_SPECS.map((fmt) => {
            const isSelected = selectedFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                onClick={() => setSelectedFormat(fmt.id)}
                className={cn(
                  "rounded-2xl border p-5 text-left transition-all flex flex-col justify-between gap-4",
                  isSelected
                    ? "border-violet bg-violet/10 text-fg shadow-sm"
                    : "border-line bg-surface text-muted hover:border-violet/40 hover:text-fg"
                )}
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-violet/10 px-2 py-0.5 text-[10px] font-mono font-semibold text-violet uppercase">
                      {fmt.badge}
                    </span>
                    {fmt.recommended && (
                      <span className="text-[10px] font-medium text-emerald-500">
                        Recommended
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-fg">{fmt.name}</h3>
                  <div className="text-xs font-mono text-muted">{fmt.bitrate}</div>
                </div>

                <div className="border-t border-line/60 pt-3 text-xs space-y-1">
                  <div className="flex justify-between text-muted">
                    <span>Est. Size (3m):</span>
                    <strong className="text-fg font-mono">{fmt.sizePer3Min}</strong>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Dynamic Range:</span>
                    <strong className="text-fg font-mono">{fmt.dynamicRange}</strong>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Format Summary Card */}
        {(() => {
          const current = FORMAT_SPECS.find((f) => f.id === selectedFormat)!;
          return (
            <div className="rounded-2xl border border-line bg-surface p-6 sm:p-7 space-y-3">
              <h4 className="text-sm font-bold text-fg flex items-center gap-2">
                <span>Selected Export Profile:</span>
                <span className="text-violet">{current.name}</span>
              </h4>
              <p className="text-xs sm:text-sm text-muted leading-relaxed">
                <strong>Best For:</strong> {current.bestFor}. All exports from Audify pass through our look-ahead true-peak limiter calibrated to −0.3 dBFS to prevent inter-sample clipping on consumer audio converters.
              </p>
            </div>
          );
        })()}
      </section>

      {/* ========================================================= */}
      {/* LAB SECTION 7: 4-STEP STUDIO WORKFLOW */}
      {/* ========================================================= */}
      <section aria-labelledby="workflow-steps-heading" className="space-y-6">
        <div>
          <div className="flex items-center gap-2 text-violet">
            <Lightning className="h-4 w-4" weight="bold" />
            <span className="text-xs font-semibold uppercase tracking-wider">
              Step-by-Step
            </span>
          </div>
          <h2 id="workflow-steps-heading" className="text-2xl font-bold tracking-tight text-fg mt-1">
            How to Work with Audify
          </h2>
          <p className="text-sm text-muted mt-1 max-w-2xl">
            A frictionless, four-step workflow from audio import to master download.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              num: "01",
              title: "Import Your Track",
              desc: "Drag and drop any MP3, WAV, OGG, FLAC, or AAC up to 10 MB. Files are decoded strictly into your browser's RAM.",
            },
            {
              num: "02",
              title: "Apply DSP Presets",
              desc: "Choose from 36 acoustic treatments or customize speed, pitch, biquad filters, and stereo panning sliders.",
            },
            {
              num: "03",
              title: "Scrub & Audition",
              desc: "Listen to instant zero-latency previews with real-time waveform navigation and A/B bypass comparison.",
            },
            {
              num: "04",
              title: "Render & Download",
              desc: "Export bit-accurate WAV (16/24/32-bit float) or 320k MP3 with −0.3 dBFS true-peak look-ahead limiter protection.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="rounded-2xl border border-line bg-surface p-5 sm:p-6 space-y-3"
            >
              <span className="font-mono text-2xl font-black text-violet/40">
                {step.num}
              </span>
              <h3 className="text-base font-bold text-fg">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* BOTTOM ACTION CTA */}
      {/* ========================================================= */}
      <section className="rounded-2xl border border-line bg-surface p-6 sm:p-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 text-center sm:text-left">
          <h3 className="text-xl font-bold text-fg">Ready to shape your sound?</h3>
          <p className="text-xs sm:text-sm text-muted max-w-lg leading-relaxed">
            Put this theory into practice. Load your audio track into Audify Studio and audition every acoustic preset in real time with zero server wait times.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
          <Link
            href="/presets"
            className="rounded-xl border border-line bg-canvas px-5 py-3 text-xs font-semibold text-fg hover:border-violet transition-colors"
          >
            Browse 36 Presets
          </Link>
          <Link
            href="/studio"
            className="btn-gradient-primary rounded-xl px-6 py-3 text-xs font-semibold text-white shadow-sm inline-flex items-center gap-2"
          >
            <Waveform size={16} weight="bold" />
            <span>Open Audify Studio</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
