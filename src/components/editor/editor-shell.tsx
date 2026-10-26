"use client";

import { useRef, useState } from "react";
import { AudioUploader } from "./audio-uploader";
import { AudioPlayer } from "./audio-player";
import { SoundSelector } from "./sound-selector";
import { ProcessAndOutput } from "./process-and-output";
import { MusicEditFacts } from "./music-facts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { getPresetById } from "@/config/presets";
import {
  FileAudio,
  ArrowsClockwise,
  Trash,
  CheckCircle,
  CircleNotch,
  Sparkle,
  SlidersHorizontal,
  Waveform,
  ShieldCheck,
  Cpu,
} from "@phosphor-icons/react";
import { cn, formatBytes, formatTime } from "@/lib/utils";
import { supportedExtensions, validateAudioFile, fileSizeError } from "@/lib/audio-file";

export function EditorShell() {
  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [mobileView, setMobileView] = useState<"dsp" | "export">("dsp");

  const file = useEditorStore((s) => s.file);
  const duration = useEditorStore((s) => s.duration);
  const isDecoding = useEditorStore((s) => s.isDecoding);
  const isProcessing = useEditorStore((s) => s.isProcessing);
  const processingProgress = useEditorStore((s) => s.processingProgress);
  const processingStatus = useEditorStore((s) => s.processingStatus);
  const processedResult = useEditorStore((s) => s.processedResult);
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectFile = useEditorStore((s) => s.selectFile);
  const clearFile = useEditorStore((s) => s.clearFile);

  const selectedPreset = getPresetById(selectedPresetId ?? "slowed-reverb");
  const percent = Math.round(Math.min(1, Math.max(0, processingProgress)) * 100);

  const handleReplacementFile = (files: FileList | null) => {
    const selected = files?.[0];
    if (!selected) return;
    const validation = validateAudioFile(selected);
    if (!validation.ok) {
      alert(fileSizeError(validation.reason));
      return;
    }
    void selectFile(selected);
  };

  return (
    <div id="editor" className="py-6 sm:py-8 lg:py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Compact Studio Header with Live Contextual Status */}
        <header className="rounded-2xl border border-line bg-surface/80 p-4 sm:p-5 shadow-xs backdrop-blur-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Title & Brand Attribution */}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
                  Audify Studio
                </h1>
                <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-[10px] font-mono font-medium text-primary">
                  DSP Workstation v1.0
                </span>
              </div>
              <p className="mt-0.5 text-xs text-muted">
                100% in-browser audio sculpting · Developed by Nyxen × Xpert Melody
              </p>
            </div>

            {/* Contextual Status Badge & File Quick Actions */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Contextual Status Pill */}
              <div className="inline-flex items-center gap-2 rounded-full border border-line bg-raised/70 px-3 py-1.5 text-xs font-medium">
                {isProcessing ? (
                  <>
                    <CircleNotch size={14} className="animate-spin text-primary" />
                    <span className="text-fg font-semibold font-mono">
                      Rendering DSP ({percent}%)
                    </span>
                  </>
                ) : isDecoding ? (
                  <>
                    <CircleNotch size={14} className="animate-spin text-amber-500" />
                    <span className="text-amber-500 font-medium">Decoding Audio PCM…</span>
                  </>
                ) : processedResult ? (
                  <>
                    <CheckCircle size={14} weight="fill" className="text-emerald-500" />
                    <span className="text-emerald-500 font-semibold">Master Render Ready</span>
                  </>
                ) : file ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm" />
                    <span className="text-fg font-medium">Workspace Active</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-muted/60" />
                    <span className="text-muted">Awaiting Audio Track</span>
                  </>
                )}
              </div>

              {/* Active File Quick Bar */}
              {file && !isDecoding && (
                <div className="flex items-center gap-1.5 rounded-lg border border-line bg-deep/50 p-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => replaceInputRef.current?.click()}
                    aria-label="Change current audio track"
                    title="Change track"
                    className="text-xs h-7 px-2.5"
                  >
                    <ArrowsClockwise size={13} />
                    <span>Change</span>
                  </Button>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={clearFile}
                    aria-label="Remove audio track and return to upload"
                    title="Remove track"
                    className="h-7 w-7 text-faint hover:text-error hover:bg-error/10"
                  >
                    <Trash size={14} />
                  </Button>

                  <input
                    ref={replaceInputRef}
                    type="file"
                    accept={supportedExtensions.map((e) => `.${e}`).join(",") + ",audio/*"}
                    className="sr-only"
                    onChange={(e) => handleReplacementFile(e.target.files)}
                    aria-label="Select replacement audio file"
                  />
                </div>
              )}
            </div>
          </div>
        </header>

        {/* STATE A: EMPTY STATE (No File Uploaded Yet) */}
        {!file && (
          <div className="space-y-6">
            <AudioUploader />

            {/* Studio Capabilities Overview Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              <div className="rounded-xl border border-line bg-surface/70 p-4 space-y-1.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <SlidersHorizontal size={18} weight="duotone" />
                </div>
                <h4 className="text-xs font-semibold text-fg">36 Acoustic DSP Presets</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Slowed+reverb, nightcore, 432 Hz tuning, cathedral space, and 8D audio spatial orbits.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface/70 p-4 space-y-1.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Waveform size={18} weight="duotone" />
                </div>
                <h4 className="text-xs font-semibold text-fg">Authentic PCM Waveform</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Sample-accurate peak calculation with smooth scrubbing, timecodes, and dry/wet A/B auditioning.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface/70 p-4 space-y-1.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Cpu size={18} weight="duotone" />
                </div>
                <h4 className="text-xs font-semibold text-fg">Pro Mastering Engine</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  Look-ahead limiter (−0.3 dBFS ceiling) and peak normalization ensure distortion-free masters.
                </p>
              </div>

              <div className="rounded-xl border border-line bg-surface/70 p-4 space-y-1.5 shadow-xs">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <ShieldCheck size={18} weight="duotone" />
                </div>
                <h4 className="text-xs font-semibold text-fg">Zero-Cloud Privacy</h4>
                <p className="text-[11px] text-muted leading-relaxed">
                  All signal processing executes 100% inside your browser thread. No files ever leave your device.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* STATE B: DECODING FEEDBACK SKELETON */}
        {file && isDecoding && (
          <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
            <AudioUploader />

            <div className="rounded-xl border border-line/70 bg-deep/40 p-5 space-y-3">
              <div className="flex items-center justify-between text-xs text-muted">
                <span className="flex items-center gap-2 text-primary font-medium">
                  <CircleNotch size={14} className="animate-spin" />
                  Generating PCM waveform &amp; extracting spectral peaks…
                </span>
                <span className="font-mono">Analyzing buffer</span>
              </div>

              {/* Waveform skeleton bars */}
              <div className="flex items-end justify-between gap-1 h-20">
                {Array.from({ length: 48 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    className="w-1 rounded-full bg-primary/20 animate-pulse"
                    style={{
                      height: `${Math.max(15, Math.sin(i * 0.25) * 60 + 35)}%`,
                      animationDelay: `${(i % 10) * 80}ms`,
                    }}
                  />
                ))}
              </div>
            </div>

            <MusicEditFacts />
          </div>
        )}

        {/* STATE C: LOADED-AUDIO WORKSTATION */}
        {file && !isDecoding && (
          <div className="space-y-5 min-w-0">
            {/* Active Track Metadata & Quick Context Bar */}
            <div className="rounded-xl border border-line bg-surface/80 px-4 py-2.5 text-xs flex flex-wrap items-center justify-between gap-3 shadow-xs min-w-0 overflow-hidden">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <FileAudio size={16} weight="duotone" />
                </div>
                <div className="truncate">
                  <span className="font-semibold text-fg truncate">{file.name}</span>
                  <span className="ml-2 font-mono text-[11px] text-muted">
                    {formatBytes(file.size)} · {formatTime(duration)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 font-mono text-[11px] text-muted shrink-0">
                {file.sampleRate && <span>{(file.sampleRate / 1000).toFixed(1)} kHz</span>}
                {file.channels && (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span>{file.channels === 1 ? "Mono" : "Stereo"}</span>
                  </>
                )}
                {file.detectedBpm && (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span className="text-primary font-semibold">{file.detectedBpm} BPM</span>
                  </>
                )}
                <span aria-hidden="true" className="text-line-strong">·</span>
                <span className="rounded bg-primary/10 text-primary px-2 py-0.5 font-sans font-medium">
                  {selectedPreset?.name || "Preset Active"}
                </span>
              </div>
            </div>

            {/* 1. HERO TRACK WAVEFORM & AUDITION DECK (Full-Width, Uncramped) */}
            <div className="w-full min-w-0">
              <AudioPlayer />
            </div>

            {/* Mobile / Tablet View Switcher (Only visible on screens < 1024px) */}
            <div className="flex lg:hidden items-center justify-center p-1 rounded-xl bg-deep/60 border border-line">
              <button
                type="button"
                onClick={() => setMobileView("dsp")}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                  mobileView === "dsp"
                    ? "bg-surface text-fg font-semibold shadow-xs"
                    : "text-muted hover:text-fg",
                )}
              >
                <SlidersHorizontal size={14} className="text-primary" />
                <span>1. DSP Presets &amp; Sliders</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileView("export")}
                className={cn(
                  "flex-1 py-1.5 px-3 rounded-lg text-xs font-medium transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer",
                  mobileView === "export"
                    ? "bg-surface text-fg font-semibold shadow-xs"
                    : "text-muted hover:text-fg",
                )}
              >
                <Cpu size={14} className="text-primary" />
                <span>2. Mastering &amp; Export</span>
              </button>
            </div>

            {/* 2. DUAL WORKSTATION DECKS: Presets Sculpting & Mastering Console */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start w-full min-w-0">
              {/* Presets & Acoustic DSP Rack (Cols 1-7 on desktop, visible when mobileView === 'dsp' on mobile) */}
              <div className={cn(
                "lg:col-span-7 space-y-5 min-w-0 overflow-hidden",
                mobileView !== "dsp" && "hidden lg:block",
              )}>
                <SoundSelector />
              </div>

              {/* Mastering & Lossless Export Console (Cols 8-12 on desktop, visible when mobileView === 'export' on mobile) */}
              <div className={cn(
                "lg:col-span-5 space-y-5 min-w-0 overflow-hidden",
                mobileView !== "export" && "hidden lg:block",
              )}>
                <ProcessAndOutput />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
