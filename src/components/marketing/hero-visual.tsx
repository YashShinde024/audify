"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import Link from "next/link";
import {
  UploadSimple,
  Play,
  Pause,
  ArrowRight,
  Waveform,
  SlidersHorizontal,
  SpeakerHigh,
  Sparkle,
  ArrowsClockwise,
  Lock,
  ArrowClockwise,
  CaretLeft,
  CaretRight,
  Lightning,
  ShieldCheck,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { presets, getPresetById } from "@/config/presets";
import { validateAudioFile, fileSizeError } from "@/lib/audio-file";
import { formatTime, cn } from "@/lib/utils";
import { encodeWav } from "@/features/audio/codecs/encoders";

const SHOWCASE_PRESETS = [
  "slowed-reverb",
  "8d-audio",
  "bass-boost-heavy",
  "nightcore",
  "cathedral-reverb",
];

/**
 * macOS Browser Window Composition showcasing the actual Audify Studio.
 * Replaces the obsolete "Interactive Audio Demonstration" card.
 */
export function HeroVisual() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const file = useEditorStore((s) => s.file);
  const decodedAudio = useEditorStore((s) => s.decodedAudio);
  const originalAudioUrl = useEditorStore((s) => s.originalAudioUrl);
  const processedResult = useEditorStore((s) => s.processedResult);
  const isDecoding = useEditorStore((s) => s.isDecoding);
  const decodeError = useEditorStore((s) => s.decodeError);
  const selectFile = useEditorStore((s) => s.selectFile);
  const clearFile = useEditorStore((s) => s.clearFile);

  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectPreset = useEditorStore((s) => s.selectPreset);
  const effectValues = useEditorStore((s) => s.effectValues);
  const setEffectValue = useEditorStore((s) => s.setEffectValue);

  const isPlaying = useEditorStore((s) => s.isPlaying);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const currentTime = useEditorStore((s) => s.currentTime);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const duration = useEditorStore((s) => s.duration);
  const setDuration = useEditorStore((s) => s.setDuration);
  const showAfter = useEditorStore((s) => s.showAfter);
  const toggleAfter = useEditorStore((s) => s.toggleAfter);
  const volume = useEditorStore((s) => s.volume);

  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Active audio URL depends on A/B comparison state
  const activeUrl = showAfter && processedResult ? processedResult.url : originalAudioUrl;

  // Real audio playback synchronization with shared store
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.warn("Audio playback prevented:", err);
        togglePlay(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, togglePlay]);

  // Volume synchronization
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  // Source synchronization without redundant playhead reset
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;

    const wasPlaying = !audio.paused;
    audio.src = activeUrl;
    audio.currentTime = currentTime;

    if (wasPlaying) {
      audio.play().catch(() => togglePlay(false));
    }
  }, [activeUrl]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && Number.isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  }, [setCurrentTime, setDuration]);

  const handleEnded = useCallback(() => {
    togglePlay(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [togglePlay, setCurrentTime]);

  const handleSeek = (ratio: number) => {
    const targetDuration = duration || file?.duration || 0;
    if (audioRef.current && targetDuration > 0) {
      const targetTime = Math.max(0, Math.min(targetDuration, ratio * targetDuration));
      audioRef.current.currentTime = targetTime;
      setCurrentTime(targetTime);
    }
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      setLocalError(null);
      const selected = files?.[0];
      if (!selected) return;

      const validation = validateAudioFile(selected);
      if (!validation.ok) {
        setLocalError(fileSizeError(validation.reason));
        return;
      }
      selectFile(selected);
    },
    [selectFile],
  );

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  /**
   * Generates a 4-bar Rhodes chord progression in client RAM,
   * encodes it to a real WAV file, and loads it into the real editorStore.
   */
  const handleLoadDemoAudio = async () => {
    try {
      setIsGeneratingDemo(true);
      setLocalError(null);

      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const sampleRate = ctx.sampleRate;
      const totalSeconds = 8.7;
      const totalFrames = Math.floor(sampleRate * totalSeconds);

      const buffer = ctx.createBuffer(2, totalFrames, sampleRate);
      const left = buffer.getChannelData(0);
      const right = buffer.getChannelData(1);

      // Chords (Cm9, Abmaj7, Eb, Bb) with warm analog harmonic profile
      const chords = [
        [130.81, 155.56, 196.0, 233.08, 293.66],
        [103.83, 130.81, 155.56, 196.0],
        [155.56, 196.0, 233.08, 293.66],
        [116.54, 146.83, 174.61, 220.0],
      ];

      for (let chordIdx = 0; chordIdx < 4; chordIdx++) {
        const chordStart = chordIdx * 2.175;
        const chordEnd = chordStart + 2.175;
        const startFrame = Math.floor(chordStart * sampleRate);
        const endFrame = Math.min(totalFrames, Math.floor(chordEnd * sampleRate));
        const freqs = chords[chordIdx];

        for (let i = startFrame; i < endFrame; i++) {
          const t = (i - startFrame) / sampleRate;
          const env = Math.exp(-t * 0.9) * 0.18;

          let sample = 0;
          for (let f = 0; f < freqs.length; f++) {
            const freq = freqs[f];
            sample += Math.sin(2 * Math.PI * freq * t) * (1 / (f + 1));
            sample += Math.sin(4 * Math.PI * freq * t) * 0.25;
          }

          left[i] += sample * env;
          right[i] += sample * env * 0.95;
        }
      }

      await ctx.close().catch(() => {});

      const wavBlob = encodeWav(buffer, 16);
      const demoFile = new File([wavBlob], "audify-studio-preview.wav", { type: "audio/wav" });

      await selectFile(demoFile);
      if (!selectedPresetId) {
        selectPreset("slowed-reverb");
      }
    } catch (err) {
      console.error("Failed to generate demo audio:", err);
      setLocalError("Could not synthesize audio on this browser.");
    } finally {
      setIsGeneratingDemo(false);
    }
  };

  const progressRatio =
    duration > 0
      ? Math.min(1, Math.max(0, currentTime / duration))
      : file?.duration && file.duration > 0
      ? Math.min(1, Math.max(0, currentTime / file.duration))
      : 0;

  const peaks = decodedAudio?.peaks || [];

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden real HTML5 Audio element synchronized with Web Audio store */}
      <audio
        ref={audioRef}
        src={activeUrl || undefined}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onLoadedMetadata={() => {
          if (audioRef.current?.duration && Number.isFinite(audioRef.current.duration)) {
            setDuration(audioRef.current.duration);
          }
        }}
      />

      {/* Refined macOS Browser Window Frame */}
      <div
        className={cn(
          "group relative rounded-2xl border border-line/80 bg-surface/95 dark:bg-[#0c0d14]/95 backdrop-blur-xl",
          "shadow-2xl shadow-black/20 dark:shadow-black/70 overflow-hidden transition-all duration-300",
          isHovered ? "border-primary/40 ring-1 ring-primary/20" : "hover:border-line"
        )}
      >
        {/* Subtle top specular border highlight */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/35 to-transparent"
        />

        {/* 1. macOS Browser Chrome Header */}
        <div className="flex h-11 items-center justify-between border-b border-line/70 bg-raised/50 px-3.5 sm:px-4">
          {/* Left: macOS Traffic Lights & Navigation Chevrons */}
          <div className="flex items-center gap-3">
            {/* Functional-looking macOS window dots */}
            <div className="flex items-center gap-1.5">
              <span
                title="Close"
                className="group/dot relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f56] border border-[#e0443e] transition-transform hover:scale-110"
              >
                <span className="opacity-0 group-hover/dot:opacity-100 text-[8px] font-bold text-black/60 leading-none">
                  ×
                </span>
              </span>
              <span
                title="Minimize"
                className="group/dot relative flex h-3 w-3 items-center justify-center rounded-full bg-[#ffbd2e] border border-[#dea123] transition-transform hover:scale-110"
              >
                <span className="opacity-0 group-hover/dot:opacity-100 text-[8px] font-bold text-black/60 leading-none">
                  −
                </span>
              </span>
              <span
                title="Zoom"
                className="group/dot relative flex h-3 w-3 items-center justify-center rounded-full bg-[#27c93f] border border-[#1aab29] transition-transform hover:scale-110"
              >
                <span className="opacity-0 group-hover/dot:opacity-100 text-[7px] font-bold text-black/60 leading-none">
                  +
                </span>
              </span>
            </div>

            {/* Browser Navigation Chevrons */}
            <div className="hidden sm:flex items-center gap-0.5 text-faint">
              <button
                type="button"
                aria-label="Back"
                className="rounded p-1 hover:bg-raised hover:text-fg transition-colors"
                disabled
              >
                <CaretLeft size={12} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Forward"
                className="rounded p-1 hover:bg-raised hover:text-fg transition-colors"
                disabled
              >
                <CaretRight size={12} weight="bold" />
              </button>
              <button
                type="button"
                aria-label="Reload"
                onClick={() => {
                  if (audioRef.current) {
                    audioRef.current.currentTime = 0;
                    setCurrentTime(0);
                  }
                }}
                className="rounded p-1 hover:bg-raised hover:text-fg transition-colors cursor-pointer"
              >
                <ArrowClockwise size={11} weight="bold" />
              </button>
            </div>
          </div>

          {/* Center: Sleek Address Omnibar */}
          <div className="flex items-center justify-center max-w-[200px] sm:max-w-xs md:max-w-sm w-full mx-2">
            <div className="flex h-6 w-full items-center justify-center gap-1.5 rounded-full border border-line/70 bg-canvas/70 px-3 text-[11px] font-mono shadow-xs">
              <Lock size={10} className="text-emerald-500 shrink-0" weight="fill" />
              <span className="text-fg font-medium truncate">https://audify.nyxen.in/studio</span>
            </div>
          </div>

          {/* Right: Studio Quick Launch CTA */}
          <div className="flex items-center">
            <Link
              href="/studio"
              className="inline-flex items-center gap-1 rounded-md border border-line/70 bg-surface px-2 py-0.5 text-[10px] sm:text-[11px] font-medium text-fg hover:border-primary/50 hover:text-primary transition-colors whitespace-nowrap"
            >
              <span>Open Studio</span>
              <ArrowRight size={10} aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* 2. Application Viewport: Actual Working Studio Interface */}
        <div className="p-3.5 sm:p-5 space-y-4">
          {!file ? (
            /* State A: Ingest Dropzone & Demo Track Generator */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "relative rounded-xl border-2 border-dashed p-6 sm:p-8 text-center transition-all duration-200",
                isDragging
                  ? "border-primary bg-primary/10 scale-[0.99]"
                  : "border-line bg-canvas/40 hover:border-primary/40 hover:bg-canvas/70"
              )}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                id="hero-file-input"
              />

              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-surface text-primary shadow-sm mb-3">
                <UploadSimple size={22} weight="duotone" />
              </div>

              <h3 className="text-sm font-semibold text-fg">
                Audify Studio · Client Memory DSP
              </h3>
              <p className="mt-1 text-xs text-muted max-w-sm mx-auto leading-relaxed">
                Drop any MP3, WAV, FLAC, or AAC track up to 10 MB. Or load our synthesized test loop to shape effects live.
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isDecoding || isGeneratingDemo}
                  className="cursor-pointer text-xs"
                >
                  <UploadSimple className="h-3.5 w-3.5" />
                  <span>Choose Audio File</span>
                </Button>

                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleLoadDemoAudio}
                  loading={isGeneratingDemo}
                  disabled={isDecoding || isGeneratingDemo}
                  className="border-line/80 hover:border-primary/50 cursor-pointer text-xs"
                >
                  <Lightning className="h-3.5 w-3.5 text-primary" weight="fill" />
                  <span>Load Demo Track</span>
                </Button>
              </div>

              {localError && (
                <p className="mt-3 text-xs font-medium text-error" role="alert">
                  {localError}
                </p>
              )}
              {decodeError && (
                <p className="mt-3 text-xs font-medium text-error" role="alert">
                  {decodeError}
                </p>
              )}
            </div>
          ) : (
            /* State B: Active Studio Workstation with Live Waveform & DSP */
            <div className="space-y-4">
              {/* Track Status Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-line/60 bg-canvas/60 px-3 py-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.5)] shrink-0" />
                  <p className="text-xs font-semibold text-fg truncate max-w-[180px] sm:max-w-xs font-mono">
                    {file.name}
                  </p>
                </div>

                {/* Dry/Wet A/B Toggle */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleAfter()}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] font-mono font-semibold transition-all cursor-pointer",
                      showAfter
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-line bg-surface text-muted hover:text-fg"
                    )}
                    title="Toggle A/B Dry/Wet sound preview"
                  >
                    <SpeakerHigh size={12} weight="bold" />
                    <span>{showAfter ? "DSP WET" : "ORIGINAL DRY"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => clearFile()}
                    className="rounded-md border border-line/60 bg-surface/70 p-1 text-xs text-muted hover:text-fg hover:border-line transition-colors cursor-pointer"
                    title="Eject audio"
                  >
                    <ArrowsClockwise size={12} />
                  </button>
                </div>
              </div>

              {/* Decoded Waveform Scrubbing Track */}
              <div className="rounded-xl border border-line/70 bg-canvas/80 p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <Button
                      type="button"
                      size="icon"
                      variant="primary"
                      onClick={() => togglePlay()}
                      aria-label={isPlaying ? "Pause playback" : "Start playback"}
                      className="h-8 w-8 shrink-0 rounded-lg cursor-pointer"
                    >
                      {isPlaying ? (
                        <Pause size={14} weight="fill" />
                      ) : (
                        <Play size={14} weight="fill" />
                      )}
                    </Button>
                    <div className="font-mono text-xs">
                      <span className="font-semibold text-fg">{formatTime(currentTime)}</span>
                      <span className="text-muted"> / {formatTime(duration || file.duration || 0)}</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-500 font-medium">
                    <ShieldCheck size={12} weight="fill" />
                    Limiter: −0.3 dBFS
                  </span>
                </div>

                {/* Waveform Bars from real decoded AudioBuffer peaks */}
                <div
                  role="slider"
                  aria-label="Seek audio position"
                  aria-valuemin={0}
                  aria-valuemax={Math.round(duration || file.duration || 1)}
                  aria-valuenow={Math.round(currentTime)}
                  tabIndex={0}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const ratio = (e.clientX - rect.left) / rect.width;
                    handleSeek(ratio);
                  }}
                  className="group/seeker relative flex h-16 w-full cursor-pointer items-center overflow-hidden rounded-md border border-line/70 bg-raised/50 px-1.5 select-none"
                >
                  <div className="flex h-full w-full items-center justify-between gap-[2px]">
                    {peaks.length > 0 ? (
                      peaks.map((peak, idx) => {
                        const barRatio = idx / peaks.length;
                        const isPassed = barRatio <= progressRatio;
                        return (
                          <div
                            key={idx}
                            className="w-full min-w-[1.5px] max-w-[5px] rounded-full transition-colors"
                            style={{
                              height: `${Math.max(12, Math.round(peak * 88))}%`,
                              backgroundColor: isPassed
                                ? "var(--color-primary)"
                                : "var(--color-line-strong)",
                            }}
                          />
                        );
                      })
                    ) : (
                      <div className="relative h-1.5 w-full rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full bg-primary transition-[width] duration-100"
                          style={{ width: `${progressRatio * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Preset Selector Chips */}
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted mb-1.5">
                  Preset Algorithm:
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                  {SHOWCASE_PRESETS.map((id) => {
                    const preset = getPresetById(id);
                    if (!preset) return null;
                    const isSelected = selectedPresetId === preset.id;

                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => selectPreset(preset.id)}
                        className={cn(
                          "rounded-lg border p-1.5 sm:p-2 text-left transition-all duration-150 cursor-pointer",
                          isSelected
                            ? "border-primary bg-primary/15 text-fg shadow-xs font-semibold ring-1 ring-primary/40"
                            : "border-line bg-surface hover:border-line-strong hover:bg-raised text-muted hover:text-fg"
                        )}
                      >
                        <span className="block text-[11px] font-medium truncate">
                          {preset.name}
                        </span>
                        <span className="block text-[9px] text-faint truncate font-mono">
                          {preset.category}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Real Parameter Knobs / Sliders */}
              <div className="grid gap-2 sm:grid-cols-3 rounded-lg border border-line/60 bg-canvas/60 p-2.5">
                {/* Speed Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted font-medium flex items-center gap-1">
                      <SlidersHorizontal size={11} className="text-primary" />
                      Speed
                    </span>
                    <span className="font-mono text-fg font-semibold text-[11px]">
                      {(effectValues.speed as number) || 0.85}×
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.65"
                    max="1.45"
                    step="0.05"
                    value={(effectValues.speed as number) || 0.85}
                    onChange={(e) => setEffectValue("speed", parseFloat(e.target.value))}
                    aria-label="Playback speed"
                    className="w-full accent-[var(--color-primary)] cursor-pointer h-1.5"
                  />
                </div>

                {/* Reverb Space Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted font-medium flex items-center gap-1">
                      <Waveform size={11} className="text-primary" />
                      Reverb
                    </span>
                    <span className="font-mono text-fg font-semibold text-[11px]">
                      {Math.round(((effectValues.reverb_decay as number) || 2.5) * 20)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="5.0"
                    step="0.25"
                    value={(effectValues.reverb_decay as number) || 2.5}
                    onChange={(e) => setEffectValue("reverb_decay", parseFloat(e.target.value))}
                    aria-label="Reverb space"
                    className="w-full accent-[var(--color-primary)] cursor-pointer h-1.5"
                  />
                </div>

                {/* Sub-Bass Gain Slider */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-muted font-medium flex items-center gap-1">
                      <Sparkle size={11} className="text-primary" />
                      Bass
                    </span>
                    <span className="font-mono text-fg font-semibold text-[11px]">
                      +{(effectValues.bass_gain as number) || 6} dB
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="1"
                    value={(effectValues.bass_gain as number) || 6}
                    onChange={(e) => setEffectValue("bass_gain", parseInt(e.target.value, 10))}
                    aria-label="Sub-bass gain"
                    className="w-full accent-[var(--color-primary)] cursor-pointer h-1.5"
                  />
                </div>
              </div>

              {/* Bottom Console Footer Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-line/60">
                <span className="text-[10px] text-muted font-mono">
                  WAV 24-bit · AIFF · MP3 320k
                </span>

                <Button asChild size="sm" variant="primary" className="text-xs">
                  <Link href="/studio">
                    <span>Open Fullscreen Studio</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
