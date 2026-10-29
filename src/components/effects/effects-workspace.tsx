"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  ArrowsClockwise,
  Play,
  Pause,
  SpeakerHigh,
  SpeakerNone,
  FileAudio,
  Trash,
  CheckCircle,
  CircleNotch,
  ArrowRight,
  Waveform,
  WarningCircle,
  Sparkle,
  UploadSimple,
  MusicNotes,
  Repeat,
  Info,
  ArrowsLeftRight,
  Compass,
} from "@phosphor-icons/react";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { DownloadButton } from "@/components/ui/download-button";
import { useEditorStore, selectIsResultStale } from "@/stores/editor-store";
import { presets, getPresetById } from "@/config/presets";
import { generateStudioSampleAudioFile } from "@/lib/sample-audio";
import { supportedExtensions, validateAudioFile, fileSizeError } from "@/lib/audio-file";
import { formatBytes, formatTime, cn } from "@/lib/utils";
import { AdBanner } from "@/components/advertising/ad-banner";

export function EffectsWorkspace() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Store state
  const file = useEditorStore((s) => s.file);
  const rawFile = useEditorStore((s) => s.rawFile);
  const decodedAudio = useEditorStore((s) => s.decodedAudio);
  const isDecoding = useEditorStore((s) => s.isDecoding);
  const originalAudioUrl = useEditorStore((s) => s.originalAudioUrl);
  const selectFile = useEditorStore((s) => s.selectFile);
  const clearFile = useEditorStore((s) => s.clearFile);

  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectPreset = useEditorStore((s) => s.selectPreset);
  const effectValues = useEditorStore((s) => s.effectValues);
  const setEffectValue = useEditorStore((s) => s.setEffectValue);
  const resetEffects = useEditorStore((s) => s.resetEffects);

  const exportConfig = useEditorStore((s) => s.exportConfig);
  const setExportConfig = useEditorStore((s) => s.setExportConfig);

  const isProcessing = useEditorStore((s) => s.isProcessing);
  const processingProgress = useEditorStore((s) => s.processingProgress);
  const processingStatus = useEditorStore((s) => s.processingStatus);
  const processingError = useEditorStore((s) => s.processingError);
  const processedResult = useEditorStore((s) => s.processedResult);
  const processAudio = useEditorStore((s) => s.processAudio);
  const cancelProcessing = useEditorStore((s) => s.cancelProcessing);

  const isPlaying = useEditorStore((s) => s.isPlaying);
  const togglePlay = useEditorStore((s) => s.togglePlay);
  const currentTime = useEditorStore((s) => s.currentTime);
  const setCurrentTime = useEditorStore((s) => s.setCurrentTime);
  const duration = useEditorStore((s) => s.duration);
  const setDuration = useEditorStore((s) => s.setDuration);
  const volume = useEditorStore((s) => s.volume);
  const setVolume = useEditorStore((s) => s.setVolume);
  const showAfter = useEditorStore((s) => s.showAfter);
  const setShowAfter = useEditorStore((s) => s.setShowAfter);

  const [isLooping, setIsLooping] = useState(false);
  const [activeGroup, setActiveGroup] = useState<string>("all");

  // Read ?preset= param on mount or update
  useEffect(() => {
    const presetParam = searchParams.get("preset");
    if (presetParam && presets.some((p) => p.id === presetParam)) {
      if (selectedPresetId !== presetParam) {
        selectPreset(presetParam);
      }
    }
  }, [searchParams, selectPreset, selectedPresetId]);

  // Handle file selection from local disc
  const handleFileSelect = (selectedFiles: FileList | null) => {
    const chosen = selectedFiles?.[0];
    if (!chosen) return;
    const validation = validateAudioFile(chosen);
    if (!validation.ok) {
      alert(fileSizeError(validation.reason));
      return;
    }
    void selectFile(chosen);
  };

  // Load demo test audio in 1 click
  const handleLoadDemoSample = () => {
    const demo = generateStudioSampleAudioFile();
    void selectFile(demo);
  };

  // Synchronize HTML audio element
  const activeUrl = showAfter && processedResult ? processedResult.url : originalAudioUrl;
  const canCompare = Boolean(originalAudioUrl && processedResult);
  const isStale = selectIsResultStale({
    processedResult,
    selectedPresetId,
    effectValues,
    exportConfig,
  });

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => togglePlay(false));
    } else {
      audio.pause();
    }
  }, [isPlaying, togglePlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.loop = isLooping;
    }
  }, [volume, isLooping]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !activeUrl) return;

    const wasPlaying = !audio.paused;
    audio.src = activeUrl;
    audio.currentTime = 0;
    setCurrentTime(0);

    if (wasPlaying) {
      audio.play().catch(() => togglePlay(false));
    }
  }, [activeUrl, setCurrentTime, togglePlay]);

  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && Number.isFinite(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  }, [setCurrentTime, setDuration]);

  const handleEnded = useCallback(() => {
    if (isLooping && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => togglePlay(false));
      return;
    }
    togglePlay(false);
    setCurrentTime(0);
    if (audioRef.current) audioRef.current.currentTime = 0;
  }, [isLooping, togglePlay, setCurrentTime]);

  const handleSeek = (seconds: number) => {
    if (audioRef.current && duration > 0) {
      const target = Math.max(0, Math.min(duration, seconds));
      audioRef.current.currentTime = target;
      setCurrentTime(target);
    }
  };

  const selectedPreset = useMemo(() => {
    return selectedPresetId ? getPresetById(selectedPresetId) : null;
  }, [selectedPresetId]);

  // Effect value helpers with defaults
  const getVal = (paramId: string, fallback: number): number => {
    const v = effectValues[paramId];
    return typeof v === "number" && Number.isFinite(v) ? v : fallback;
  };

  const getBool = (paramId: string, fallback: boolean): boolean => {
    const v = effectValues[paramId];
    return typeof v === "boolean" ? v : fallback;
  };

  // Effect group reset helpers
  const resetSpeedPitch = () => {
    setEffectValue("speed", 100);
    setEffectValue("pitch", 0);
    setEffectValue("432hz-enabled", false);
    setEffectValue("reverse-enabled", false);
  };

  const resetReverb = () => {
    setEffectValue("reverb", 0);
    setEffectValue("size", 50);
    setEffectValue("echo", 0);
  };

  const resetEQ = () => {
    setEffectValue("bass", 0);
    setEffectValue("eq-mid", 0);
    setEffectValue("eq-high", 0);
    setEffectValue("mud-cut", false);
  };

  const resetStereo = () => {
    setEffectValue("rotation", 50);
    setEffectValue("width", 100);
    setEffectValue("pan-speed", 50);
  };

  const resetMastering = () => {
    setEffectValue("volume-gain", 0);
    setExportConfig({ peakProtection: true, peakNormalize: false, channels: "stereo" });
  };

  return (
    <div className="space-y-8">
      {/* Hidden real HTML5 Audio element */}
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

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={supportedExtensions.map((e) => `.${e}`).join(",") + ",audio/*"}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="sr-only"
        aria-label="Upload audio file"
      />

      {/* ── 1. Track & Audio Context Area ───────────────────────────── */}
      <section
        aria-labelledby="track-status-heading"
        className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <FileAudio size={18} weight="duotone" />
            </div>
            <div>
              <h2 id="track-status-heading" className="text-sm font-bold text-fg">
                Audio Context &amp; Source Track
              </h2>
              <p className="text-[11px] text-muted">
                {file ? "Track loaded in browser memory" : "No track active in workspace"}
              </p>
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-7 text-xs px-2.5"
                title="Change active track"
              >
                <ArrowsClockwise size={12} />
                <span>Replace</span>
              </Button>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearFile}
                className="h-7 w-7 text-muted hover:text-error hover:bg-error/10"
                aria-label="Clear active track"
                title="Remove track"
              >
                <Trash size={14} />
              </Button>
            </div>
          )}
        </div>

        {/* State A: File Loaded & Decoded */}
        {file && !isDecoding && (
          <div className="space-y-4">
            {/* Track Info Badges */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-semibold text-fg truncate">{file.name}</span>
                <span className="rounded bg-canvas border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                  {formatBytes(file.size)}
                </span>
                <span className="rounded bg-canvas border border-line px-2 py-0.5 font-mono text-[11px] text-muted">
                  {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2 font-mono text-[11px] text-muted">
                {file.sampleRate && <span>{(file.sampleRate / 1000).toFixed(1)} kHz</span>}
                {file.channels && (
                  <span>· {file.channels === 1 ? "Mono" : "Stereo"}</span>
                )}
                {file.detectedBpm && (
                  <span className="text-primary font-semibold">· {file.detectedBpm} BPM</span>
                )}
              </div>
            </div>

            {/* Live Playback Deck */}
            <div className="rounded-xl border border-line bg-canvas p-4 space-y-3">
              {/* Waveform Scrubber with Real Peaks */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-mono text-muted">
                  <span className="tabular-nums font-medium text-fg">{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>

                <div className="relative flex items-center">
                  <Slider
                    value={[currentTime]}
                    min={0}
                    max={duration || 1}
                    step={0.05}
                    onValueChange={([val]) => handleSeek(val)}
                    aria-label="Audio scrubber"
                    className="w-full cursor-pointer"
                  />
                </div>
              </div>

              {/* Playback Controls & A/B Switch */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant={isPlaying ? "primary" : "outline"}
                    onClick={() => togglePlay()}
                    aria-label={isPlaying ? "Pause playback" : "Start playback"}
                    className="h-8 text-xs px-3"
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={13} weight="fill" />
                        <span>Pause</span>
                      </>
                    ) : (
                      <>
                        <Play size={13} weight="fill" />
                        <span>Play</span>
                      </>
                    )}
                  </Button>

                  <button
                    type="button"
                    onClick={() => setIsLooping((prev) => !prev)}
                    aria-pressed={isLooping}
                    className={cn(
                      "p-1.5 rounded-lg border transition-colors cursor-pointer",
                      isLooping
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-line bg-surface text-muted hover:text-fg"
                    )}
                    title={isLooping ? "Looping enabled" : "Enable loop"}
                  >
                    <Repeat size={14} weight={isLooping ? "bold" : "regular"} />
                  </button>

                  {/* Volume Slider */}
                  <div className="flex items-center gap-1.5 pl-2 border-l border-line">
                    <button
                      type="button"
                      onClick={() => setVolume(volume > 0 ? 0 : 80)}
                      className="text-muted hover:text-fg p-1"
                      aria-label={volume === 0 ? "Unmute" : "Mute"}
                    >
                      {volume === 0 ? <SpeakerNone size={15} /> : <SpeakerHigh size={15} />}
                    </button>
                    <Slider
                      value={[volume]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={([v]) => setVolume(v)}
                      aria-label="Volume level"
                      className="w-20"
                    />
                  </div>
                </div>

                {/* Dry/Wet A/B Audition Comparison */}
                {canCompare ? (
                  <div className="inline-flex rounded-lg border border-line bg-surface p-0.5 text-xs">
                    <button
                      type="button"
                      onClick={() => setShowAfter(false)}
                      className={cn(
                        "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                        !showAfter ? "bg-raised text-fg font-semibold shadow-2xs" : "text-muted hover:text-fg"
                      )}
                    >
                      Dry (Original)
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAfter(true)}
                      className={cn(
                        "px-2.5 py-1 rounded-md font-medium transition-colors cursor-pointer",
                        showAfter ? "bg-primary text-white font-semibold shadow-2xs" : "text-muted hover:text-fg"
                      )}
                    >
                      Wet (Processed)
                    </button>
                  </div>
                ) : (
                  <span className="text-[11px] font-mono text-muted">
                    Previewing Dry Track · Process audio to audition Wet Master
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* State B: Decoding in Progress */}
        {file && isDecoding && (
          <div className="rounded-xl border border-line bg-canvas p-6 text-center space-y-2">
            <CircleNotch size={20} className="animate-spin text-primary mx-auto" />
            <p className="text-xs font-semibold text-fg">Decoding 32-bit float audio buffer…</p>
            <p className="text-[11px] text-muted">
              Analyzing sample channels and rendering waveform peaks client-side.
            </p>
          </div>
        )}

        {/* State C: Empty State (No File Loaded) */}
        {!file && (
          <div className="rounded-xl border border-dashed border-line bg-canvas/60 p-6 sm:p-8 text-center space-y-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface border border-line mx-auto text-muted shadow-xs">
              <Waveform size={24} weight="duotone" className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-fg">No audio track loaded</h3>
              <p className="mt-1 text-xs text-muted max-w-md mx-auto leading-relaxed">
                Load an audio file to hear these DSP effects applied directly to your music, or load our studio test track to test controls immediately.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
              <Button
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs"
              >
                <UploadSimple size={14} />
                <span>Upload Audio File</span>
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={handleLoadDemoSample}
                className="text-xs"
              >
                <Sparkle size={14} className="text-amber-500" />
                <span>Load Studio Test Track</span>
              </Button>

              <Button asChild size="sm" variant="ghost" className="text-xs">
                <Link href="/studio">
                  <span>Go to Studio</span>
                  <ArrowRight size={13} />
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Ad Placement: Mid-page sponsor banner in effects workstation */}
      <div className="py-2">
        <AdBanner id="effects-mid-controls" className="mx-auto" />
      </div>

      {/* ── 2. Effect Presets Quick Bar & Group Filters ──────────────── */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-line pb-3">
          <div>
            <h2 className="text-base font-bold text-fg">Web Audio DSP Controls</h2>
            <p className="text-xs text-muted">
              Organized into 6 genuine signal processing stages backed by browser-native DSP nodes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={resetEffects}
              className="h-7 text-xs px-2.5"
            >
              <ArrowsClockwise size={12} />
              <span>Reset All Controls</span>
            </Button>
          </div>
        </div>

        {/* Group Filter Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: "all", label: "All Groups" },
            { id: "speed-pitch", label: "Speed & Pitch" },
            { id: "reverb-ambience", label: "Reverb & Ambience" },
            { id: "eq-tone", label: "EQ & Tone" },
            { id: "bass", label: "Bass Enhancement" },
            { id: "spatial", label: "Spatial & Stereo" },
            { id: "mastering", label: "Volume & Limiter" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveGroup(tab.id)}
              className={cn(
                "rounded-xl px-3 py-1.5 text-xs font-medium transition-all border cursor-pointer select-none",
                activeGroup === tab.id
                  ? "border-primary bg-primary text-white shadow-xs font-semibold"
                  : "border-line bg-surface/80 text-muted hover:text-fg hover:border-line-strong"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Six Dedicated DSP Effect Groups ───────────────────────── */}
      <div className="space-y-6">
        {/* GROUP 1: Speed and Pitch */}
        {(activeGroup === "all" || activeGroup === "speed-pitch") && (
          <section
            aria-labelledby="group-speed-pitch"
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 id="group-speed-pitch" className="text-sm font-bold text-fg">
                  Speed &amp; Pitch Controls
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  AudioBufferSourceNode.playbackRate · Sinc Resampling
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetSpeedPitch} className="h-6 text-[11px] px-2 text-muted hover:text-fg">
                <ArrowsClockwise size={11} />
                <span>Reset</span>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Playback Speed Slider */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-speed" className="text-fg font-semibold">
                    Playback Speed
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("speed", 100)}%
                  </span>
                </div>
                <Slider
                  id="ctrl-speed"
                  value={[getVal("speed", 100)]}
                  min={30}
                  max={180}
                  step={1}
                  onValueChange={([v]) => setEffectValue("speed", v)}
                  aria-label="Playback speed percentage"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Varispeed playback rate. Values below 100% slow down tempo while pitching down; above 100% accelerates.
                </p>
              </div>

              {/* Semitone Pitch Slider */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-pitch" className="text-fg font-semibold">
                    Semitone Pitch Transposition
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("pitch", 0) > 0 ? `+${getVal("pitch", 0)}` : getVal("pitch", 0)} st
                  </span>
                </div>
                <Slider
                  id="ctrl-pitch"
                  value={[getVal("pitch", 0)]}
                  min={-12}
                  max={12}
                  step={1}
                  onValueChange={([v]) => setEffectValue("pitch", v)}
                  aria-label="Semitone pitch transposition"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Transposes pitch up or down by discrete musical half-steps (-12 to +12 semitones = 1 full octave).
                </p>
              </div>

              {/* 432 Hz Sacred Pitch Toggle */}
              <div className="flex items-start justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
                <div>
                  <label htmlFor="ctrl-432hz" className="text-xs font-semibold text-fg">
                    432 Hz Sacred Pitch Tuning
                  </label>
                  <p className="mt-1 text-[11px] text-muted leading-snug">
                    Calibrates A4 standard from 440 Hz down to 432 Hz (≈ -1.8% pitch &amp; tempo ratio).
                  </p>
                </div>
                <Switch
                  id="ctrl-432hz"
                  checked={getBool("432hz-enabled", false)}
                  onCheckedChange={(c) => setEffectValue("432hz-enabled", c)}
                  aria-label="Toggle 432 Hz Sacred Pitch Tuning"
                />
              </div>

              {/* Reverse Audio Toggle */}
              <div className="flex items-start justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
                <div>
                  <label htmlFor="ctrl-reverse" className="text-xs font-semibold text-fg">
                    Reverse Playback Buffer
                  </label>
                  <p className="mt-1 text-[11px] text-muted leading-snug">
                    Reverses PCM samples across all channels end-to-beginning for reverse swells.
                  </p>
                </div>
                <Switch
                  id="ctrl-reverse"
                  checked={getBool("reverse-enabled", false)}
                  onCheckedChange={(c) => setEffectValue("reverse-enabled", c)}
                  aria-label="Toggle Reverse Playback Buffer"
                />
              </div>
            </div>
          </section>
        )}

        {/* GROUP 2: Reverb and Ambience */}
        {(activeGroup === "all" || activeGroup === "reverb-ambience") && (
          <section
            aria-labelledby="group-reverb"
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 id="group-reverb" className="text-sm font-bold text-fg">
                  Reverb &amp; Ambience
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  ConvolverNode (Impulse Responses) · DelayNode Feedback
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetReverb} className="h-6 text-[11px] px-2 text-muted hover:text-fg">
                <ArrowsClockwise size={11} />
                <span>Reset</span>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Reverb Wet Mix */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-reverb" className="text-fg font-semibold">
                    Reverb Wet Mix
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("reverb", 0)}%
                  </span>
                </div>
                <Slider
                  id="ctrl-reverb"
                  value={[getVal("reverb", 0)]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setEffectValue("reverb", v)}
                  aria-label="Reverb wet mix percentage"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Wet-to-dry balance of the acoustic reflection signal bus.
                </p>
              </div>

              {/* Room Dimension */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-size" className="text-fg font-semibold">
                    Room Dimension
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("size", 50)}%
                  </span>
                </div>
                <Slider
                  id="ctrl-size"
                  value={[getVal("size", 50)]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setEffectValue("size", v)}
                  aria-label="Room dimension percentage"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Scale of the architectural acoustic space and algorithmic decay tail length.
                </p>
              </div>

              {/* Stereo Delay / Echo */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-echo" className="text-fg font-semibold">
                    Stereo Feedback Delay
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("echo", 0)}%
                  </span>
                </div>
                <Slider
                  id="ctrl-echo"
                  value={[getVal("echo", 0)]}
                  min={0}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setEffectValue("echo", v)}
                  aria-label="Stereo delay wet level"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Repeating feedback delay line with high-frequency acoustic damping.
                </p>
              </div>
            </div>

            {/* Quick Space Profile Shortcuts */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted font-medium">Acoustic Space Profiles:</span>
              {[
                { name: "Small Room", rev: 35, sz: 30 },
                { name: "Hall Reverb", rev: 45, sz: 65 },
                { name: "Cathedral", rev: 60, sz: 95 },
                { name: "Bathroom Tile", rev: 50, sz: 25 },
              ].map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setEffectValue("reverb", p.rev);
                    setEffectValue("size", p.sz);
                  }}
                  className="rounded-lg border border-line bg-canvas px-2.5 py-1 text-[11px] text-muted hover:text-fg hover:border-line-strong transition-colors cursor-pointer"
                >
                  {p.name} ({p.rev}% / {p.sz}%)
                </button>
              ))}
            </div>
          </section>
        )}

        {/* GROUP 3: Equalization and Tone */}
        {(activeGroup === "all" || activeGroup === "eq-tone") && (
          <section
            aria-labelledby="group-eq"
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 id="group-eq" className="text-sm font-bold text-fg">
                  Equalization &amp; Tone Shaping
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  BiquadFilterNode (LowShelf, Peaking, HighShelf, HighPass)
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetEQ} className="h-6 text-[11px] px-2 text-muted hover:text-fg">
                <ArrowsClockwise size={11} />
                <span>Reset</span>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* Low-Shelf Bass */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-eq-bass" className="text-fg font-semibold">
                    Low Shelf (120 Hz)
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("bass", 0) > 0 ? `+${getVal("bass", 0)}` : getVal("bass", 0)} dB
                  </span>
                </div>
                <Slider
                  id="ctrl-eq-bass"
                  value={[getVal("bass", 0)]}
                  min={-12}
                  max={18}
                  step={0.5}
                  onValueChange={([v]) => setEffectValue("bass", v)}
                  aria-label="Low shelf gain in dB"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Low-frequency fundamental weight and kick punch.
                </p>
              </div>

              {/* Mid Peaking Presence */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-eq-mid" className="text-fg font-semibold">
                    Mid Presence (2.4 kHz)
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("eq-mid", 0) > 0 ? `+${getVal("eq-mid", 0)}` : getVal("eq-mid", 0)} dB
                  </span>
                </div>
                <Slider
                  id="ctrl-eq-mid"
                  value={[getVal("eq-mid", 0)]}
                  min={-12}
                  max={12}
                  step={0.5}
                  onValueChange={([v]) => setEffectValue("eq-mid", v)}
                  aria-label="Mid band gain in dB"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Vocal articulation, instrument clarity, and mid-range definition.
                </p>
              </div>

              {/* High-Shelf Air */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-eq-high" className="text-fg font-semibold">
                    High Shelf Air (9.0 kHz)
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("eq-high", 0) > 0 ? `+${getVal("eq-high", 0)}` : getVal("eq-high", 0)} dB
                  </span>
                </div>
                <Slider
                  id="ctrl-eq-high"
                  value={[getVal("eq-high", 0)]}
                  min={-12}
                  max={14}
                  step={0.5}
                  onValueChange={([v]) => setEffectValue("eq-high", v)}
                  aria-label="High shelf air gain in dB"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Top-end sheen, vocal breath, and acoustic shimmer.
                </p>
              </div>
            </div>

            {/* Mud Cut High-Pass Filter */}
            <div className="flex items-start justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
              <div>
                <label htmlFor="ctrl-mud-cut" className="text-xs font-semibold text-fg">
                  Sub Rumble &amp; Mud Cut Filter (110 Hz High-Pass)
                </label>
                <p className="mt-1 text-[11px] text-muted leading-snug">
                  Cleans up boxy low-frequency mud and subsonic microphone thumps below 110 Hz.
                </p>
              </div>
              <Switch
                id="ctrl-mud-cut"
                checked={getBool("mud-cut", false)}
                onCheckedChange={(c) => setEffectValue("mud-cut", c)}
                aria-label="Toggle mud cut filter"
              />
            </div>
          </section>
        )}

        {/* GROUP 4: Bass Enhancement */}
        {(activeGroup === "all" || activeGroup === "bass") && (
          <section
            aria-labelledby="group-bass"
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 id="group-bass" className="text-sm font-bold text-fg">
                  Bass &amp; Sub-Bass Enhancement
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  BiquadFilterNode (LowShelf 65 Hz – 95 Hz)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEffectValue("bass", 0)}
                className="h-6 text-[11px] px-2 text-muted hover:text-fg"
              >
                <ArrowsClockwise size={11} />
                <span>Reset</span>
              </Button>
            </div>

            <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
              <div className="flex items-baseline justify-between text-xs font-medium">
                <label htmlFor="ctrl-bass-boost" className="text-fg font-semibold">
                  Bass Reinforcement Level
                </label>
                <span className="font-mono text-primary font-bold">
                  +{getVal("bass", 0)} dB
                </span>
              </div>
              <Slider
                id="ctrl-bass-boost"
                value={[getVal("bass", 0)]}
                min={0}
                max={18}
                step={0.5}
                onValueChange={([v]) => setEffectValue("bass", v)}
                aria-label="Bass boost gain in dB"
              />
              <p className="text-[11px] text-muted leading-snug">
                Sub-bass fundamental enhancement with phase-aligned corner slope.
              </p>
            </div>

            {/* Four Calibrated Boost Tiers */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-muted font-medium">Calibrated Tiers:</span>
              {[
                { label: "Light (+3.5 dB)", db: 3.5 },
                { label: "Moderate (+7.0 dB)", db: 7.0 },
                { label: "Heavy (+10.5 dB)", db: 10.5 },
                { label: "Extreme (+15.0 dB)", db: 15.0 },
              ].map((tier) => (
                <button
                  key={tier.label}
                  type="button"
                  onClick={() => setEffectValue("bass", tier.db)}
                  className={cn(
                    "rounded-lg border px-2.5 py-1 text-[11px] transition-colors cursor-pointer",
                    getVal("bass", 0) === tier.db
                      ? "border-primary bg-primary/10 text-primary font-semibold"
                      : "border-line bg-canvas text-muted hover:text-fg"
                  )}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </section>
        )}

        {/* GROUP 5: Stereo Width & Spatial Effects */}
        {(activeGroup === "all" || activeGroup === "spatial") && (
          <section
            aria-labelledby="group-spatial"
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 id="group-spatial" className="text-sm font-bold text-fg">
                  Stereo Width &amp; Spatial Effects
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  StereoPannerNode · LFO Sinusoidal Panning · Mid/Side Expander
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetStereo} className="h-6 text-[11px] px-2 text-muted hover:text-fg">
                <ArrowsClockwise size={11} />
                <span>Reset</span>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {/* 8D Orbital Pan Rate */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-orbit" className="text-fg font-semibold">
                    360° 8D Orbit Rate
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("rotation", 50)}%
                  </span>
                </div>
                <Slider
                  id="ctrl-orbit"
                  value={[getVal("rotation", 50)]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setEffectValue("rotation", v)}
                  aria-label="8D orbital rotation speed"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Speed of continuous left-to-right binaural rotational panning.
                </p>
              </div>

              {/* Stereo Width Expander */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-width" className="text-fg font-semibold">
                    Soundstage Width
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("width", 100)}%
                  </span>
                </div>
                <Slider
                  id="ctrl-width"
                  value={[getVal("width", 100)]}
                  min={20}
                  max={200}
                  step={5}
                  onValueChange={([v]) => setEffectValue("width", v)}
                  aria-label="Stereo soundstage width percentage"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Mid/side matrix boundary widening past standard speaker cones.
                </p>
              </div>

              {/* Auto-Pan Speed */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-pan-speed" className="text-fg font-semibold">
                    Auto-Pan Speed
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("pan-speed", 50)}%
                  </span>
                </div>
                <Slider
                  id="ctrl-pan-speed"
                  value={[getVal("pan-speed", 50)]}
                  min={10}
                  max={100}
                  step={1}
                  onValueChange={([v]) => setEffectValue("pan-speed", v)}
                  aria-label="Auto pan cycle speed"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Cycle speed of rhythmic left-and-right balance oscillations.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* GROUP 6: Volume and Output Level */}
        {(activeGroup === "all" || activeGroup === "mastering") && (
          <section
            aria-labelledby="group-mastering"
            className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-line pb-3">
              <div>
                <h3 id="group-mastering" className="text-sm font-bold text-fg">
                  Volume &amp; Output Limiting
                </h3>
                <span className="text-[10px] font-mono text-muted">
                  Look-Ahead Envelope Limiter (-0.3 dBFS) · Peak Headroom Normalizer
                </span>
              </div>
              <Button variant="ghost" size="sm" onClick={resetMastering} className="h-6 text-[11px] px-2 text-muted hover:text-fg">
                <ArrowsClockwise size={11} />
                <span>Reset</span>
              </Button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Output Make-up Gain */}
              <div className="rounded-xl border border-line bg-canvas p-4 space-y-2">
                <div className="flex items-baseline justify-between text-xs font-medium">
                  <label htmlFor="ctrl-gain" className="text-fg font-semibold">
                    Output Gain (dB)
                  </label>
                  <span className="font-mono text-primary font-bold">
                    {getVal("volume-gain", 0) > 0 ? `+${getVal("volume-gain", 0)}` : getVal("volume-gain", 0)} dB
                  </span>
                </div>
                <Slider
                  id="ctrl-gain"
                  value={[getVal("volume-gain", 0)]}
                  min={-12}
                  max={12}
                  step={0.5}
                  onValueChange={([v]) => setEffectValue("volume-gain", v)}
                  aria-label="Output make-up gain in dB"
                />
                <p className="text-[11px] text-muted leading-snug">
                  Clean master output gain before limiter stage.
                </p>
              </div>

              {/* Peak Limiter Protection Toggle */}
              <div className="flex items-start justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
                <div>
                  <label htmlFor="ctrl-limiter" className="text-xs font-semibold text-fg">
                    Look-Ahead Peak Protection Limiter
                  </label>
                  <p className="mt-1 text-[11px] text-muted leading-snug">
                    Clamps hot transients to a strict -0.3 dBFS ceiling to prevent digital DAC clipping.
                  </p>
                </div>
                <Switch
                  id="ctrl-limiter"
                  checked={exportConfig.peakProtection}
                  onCheckedChange={(c) => setExportConfig({ peakProtection: c })}
                  aria-label="Toggle peak protection limiter"
                />
              </div>

              {/* Headroom Normalization Toggle */}
              <div className="flex items-start justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
                <div>
                  <label htmlFor="ctrl-norm" className="text-xs font-semibold text-fg">
                    Peak Headroom Normalization (-0.5 dBFS)
                  </label>
                  <p className="mt-1 text-[11px] text-muted leading-snug">
                    Maximizes track loudness safely without clipping.
                  </p>
                </div>
                <Switch
                  id="ctrl-norm"
                  checked={exportConfig.peakNormalize}
                  onCheckedChange={(c) => setExportConfig({ peakNormalize: c })}
                  aria-label="Toggle peak headroom normalization"
                />
              </div>

              {/* Summed Mono Downmix Toggle */}
              <div className="flex items-start justify-between gap-3 rounded-xl border border-line bg-canvas p-4">
                <div>
                  <label htmlFor="ctrl-mono" className="text-xs font-semibold text-fg">
                    Summed Mono Downmixing
                  </label>
                  <p className="mt-1 text-[11px] text-muted leading-snug">
                    Sums L + R channels (0.5 * L + 0.5 * R) for mono speaker and club system verification.
                  </p>
                </div>
                <Switch
                  id="ctrl-mono"
                  checked={exportConfig.channels === "mono"}
                  onCheckedChange={(c) =>
                    setExportConfig({ channels: c ? "mono" : "stereo" })
                  }
                  aria-label="Toggle mono downmixing"
                />
              </div>
            </div>
          </section>
        )}
      </div>

      {/* ── 4. Primary Action & Processing Status Bar ────────────────── */}
      <section
        aria-label="DSP Render Action Console"
        className="rounded-2xl border border-line bg-surface p-5 sm:p-6 shadow-md space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-fg flex items-center gap-2">
              <span>DSP Processing Engine</span>
              {isStale && !isProcessing && (
                <span className="rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-semibold text-amber-500 uppercase tracking-wide">
                  Parameters Changed
                </span>
              )}
            </h3>
            <p className="text-xs text-muted mt-0.5">
              {file
                ? "Click 'Apply effects' to render this DSP signal chain into 32-bit float audio."
                : "Load a track above to process with these customized effect parameters."}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {isProcessing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={cancelProcessing}
                className="text-xs border-error/30 text-error hover:bg-error/10"
              >
                Cancel Render
              </Button>
            ) : processedResult ? (
              <div className="flex items-center gap-2">
                <DownloadButton
                url={processedResult.url}
                filename={`audify-${file?.name || "master"}`}
                label="Download Master"
                variant="outline"
                size="sm"
              />
                <Button
                  size="sm"
                  onClick={() => void processAudio()}
                  disabled={!file || !decodedAudio}
                  className="text-xs"
                >
                  <ArrowsClockwise size={13} />
                  <span>Re-render Effects</span>
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                onClick={() => {
                  if (!file) {
                    fileInputRef.current?.click();
                  } else {
                    void processAudio();
                  }
                }}
                disabled={isProcessing}
                className="text-xs"
              >
                <Sparkle size={13} weight="fill" />
                <span>{file ? "Apply Effects to Audio" : "Upload File to Apply"}</span>
              </Button>
            )}

            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/studio">
                <span>Open in Studio</span>
                <ArrowRight size={12} />
              </Link>
            </Button>
          </div>
        </div>

        {/* Live Processing Progress Bar */}
        {isProcessing && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="flex items-center gap-2 text-primary font-semibold">
                <CircleNotch size={14} className="animate-spin" />
                <span>{processingStatus || "Rendering offline DSP graph…"}</span>
              </span>
              <span className="font-mono text-primary font-bold">
                {Math.round(processingProgress * 100)}%
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-primary/20 overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-150 rounded-full"
                style={{ width: `${Math.round(processingProgress * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Processing Error Notice */}
        {processingError && !isProcessing && (
          <div className="rounded-xl border border-error/30 bg-error/10 p-4 flex items-start gap-3 text-xs text-error">
            <WarningCircle size={16} className="shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold">Processing error encountered</p>
              <p className="text-[11px] leading-relaxed opacity-90">{processingError}</p>
            </div>
          </div>
        )}

        {/* Finished Render Ready Feedback */}
        {processedResult && !isProcessing && (
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-4 flex items-center justify-between text-xs text-emerald-600 dark:text-emerald-400">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} weight="fill" className="text-emerald-500" />
              <span>
                Master audio rendered successfully ({formatTime(processedResult.duration)} · {formatBytes(processedResult.blob.size)})
              </span>
            </div>
            <span className="font-mono text-[11px]">32-bit Float PCM</span>
          </div>
        )}
      </section>
    </div>
  );
}
