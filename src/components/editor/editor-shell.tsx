"use client";

import { useState, useEffect } from "react";
import { AudioUploader } from "./audio-uploader";
import { AudioPlayer } from "./audio-player";
import { SoundSelector } from "./sound-selector";
import { ProcessAndOutput } from "./process-and-output";
import { MusicEditFacts } from "./music-facts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { AdPlaceholder } from "@/components/advertising/ad-placeholder";
import { useEditorStore } from "@/stores/editor-store";
import { getPresetById } from "@/config/presets";
import {
  UploadSimple,
  Faders,
  Play,
  Cpu,
  Lock,
  Check,
  ArrowRight,
  ArrowLeft,
  ArrowsClockwise,
  Waveform,
} from "@phosphor-icons/react";
import { cn, formatTime } from "@/lib/utils";

export function EditorShell() {
  const file = useEditorStore((s) => s.file);
  const isDecoding = useEditorStore((s) => s.isDecoding);
  const isProcessing = useEditorStore((s) => s.isProcessing);
  const processedResult = useEditorStore((s) => s.processedResult);
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectedPreset = getPresetById(selectedPresetId ?? "slowed-reverb");

  // Track user-selected active step
  const [activeStep, setActiveStep] = useState<number>(1);

  // Maximum step unlocked based on data completeness
  let maxUnlockedStep = 1;
  if (file && !isDecoding) maxUnlockedStep = 2;
  if (file && !isDecoding && selectedPresetId) maxUnlockedStep = 3;
  if (file && !isDecoding && processedResult) maxUnlockedStep = 4;

  // Auto-advance when file is uploaded or processing finishes
  useEffect(() => {
    if (!file) {
      setActiveStep(1);
    } else if (file && !isDecoding && activeStep === 1) {
      setActiveStep(2);
    } else if (processedResult && activeStep < 4) {
      setActiveStep(4);
    }
  }, [file, isDecoding, processedResult]);

  const steps = [
    {
      num: 1,
      title: "Audio Ingest",
      shortLabel: "Upload",
      desc: "Import local source audio file",
      icon: UploadSimple,
      summary: file ? `${file.name} (${formatTime(file.duration || 0)})` : "No file loaded",
    },
    {
      num: 2,
      title: "Acoustic Preset & DSP",
      shortLabel: "Sound",
      desc: "Choose preset or fine-tune knobs",
      icon: Faders,
      summary: selectedPreset ? selectedPreset.name : "Choose preset",
    },
    {
      num: 3,
      title: "Audition & Waveform",
      shortLabel: "Preview",
      desc: "A/B dry/wet audition & scrubber",
      icon: Play,
      summary: "Waveform scrub & tone check",
    },
    {
      num: 4,
      title: "Process & Export Master",
      shortLabel: "Export",
      desc: "Offline DSP render & lossless download",
      icon: Cpu,
      summary: processedResult ? "Master rendered" : "Format options & render",
    },
  ];

  return (
    <div id="editor" className="py-8 sm:py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Studio Editorial Intro */}
        <header className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
            <span>Interactive DSP Workspace · Developed by Nyxen</span>
          </div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            Audify Studio
          </h1>
          <p className="mt-1.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-muted">
            Guided 4-step workflow: Ingest your track, dial in signature acoustic DSP, audition in real-time,
            and export pristine 32-bit float WAV or 320kbps MP3 masters entirely in-browser.
          </p>
        </header>

        {/* 4-Step Progressive Workflow Bar */}
        <div className="mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
            {steps.map((step) => {
              const isPast = maxUnlockedStep > step.num;
              const isCurrent = activeStep === step.num;
              const isLocked = step.num > maxUnlockedStep;
              const Icon = step.icon;

              return (
                <button
                  key={step.num}
                  type="button"
                  disabled={isLocked}
                  onClick={() => setActiveStep(step.num)}
                  className={cn(
                    "relative flex flex-col items-start p-3 sm:p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer",
                    isCurrent
                      ? "border-accent bg-surface/90 shadow-sm ring-1 ring-accent/30"
                      : isPast
                      ? "border-line bg-surface/60 hover:bg-surface hover:border-line-strong"
                      : "border-line/60 bg-raised/40 opacity-60 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center justify-between w-full mb-1.5">
                    <span
                      className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-lg text-xs font-mono font-bold",
                        isCurrent
                          ? "bg-accent text-white"
                          : isPast
                          ? "bg-accent/15 text-accent"
                          : "bg-line text-muted"
                      )}
                    >
                      {isPast ? <Check size={12} weight="bold" /> : `0${step.num}`}
                    </span>

                    {isLocked ? (
                      <Lock size={12} className="text-muted" />
                    ) : isCurrent ? (
                      <span className="h-2 w-2 rounded-full bg-accent animate-ping" />
                    ) : null}
                  </div>

                  <p className="text-xs font-semibold text-fg truncate w-full">{step.title}</p>
                  <p className="text-[11px] text-muted truncate w-full mt-0.5">{step.summary}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Progressive Step Workspace */}
        <div className="space-y-6">
          {/* STEP 1: Audio File Ingest */}
          <div
            className={cn(
              "rounded-2xl border transition-all duration-300 overflow-hidden",
              activeStep === 1
                ? "border-line-strong bg-surface/90 shadow-md p-6"
                : "border-line bg-surface/40 p-4"
            )}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold">
                  01
                </span>
                <div>
                  <h2 className="text-sm font-semibold text-fg">Step 1: Audio File Ingest</h2>
                  <p className="text-xs text-muted">Upload any WAV, MP3, FLAC, OGG, or AAC track</p>
                </div>
              </div>

              {file && activeStep !== 1 && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setActiveStep(1)}
                  className="text-xs"
                >
                  <ArrowsClockwise size={13} />
                  <span>Change File</span>
                </Button>
              )}
            </div>

            {/* Ingest Uploader Body */}
            {activeStep === 1 ? (
              <div className="space-y-4">
                <AudioUploader />

                {file && !isDecoding && (
                  <div className="flex justify-end pt-2">
                    <Button
                      size="md"
                      onClick={() => setActiveStep(2)}
                      className="rounded-full shadow-glow-wire"
                    >
                      <span>Continue to Sound Sculpting</span>
                      <ArrowRight size={14} weight="bold" />
                    </Button>
                  </div>
                )}
              </div>
            ) : file ? (
              <div className="flex items-center justify-between rounded-xl bg-surface/60 border border-line p-3 text-xs">
                <span className="font-medium text-fg truncate max-w-md">{file.name}</span>
                <span className="font-mono text-muted">{formatTime(file.duration || 0)}</span>
              </div>
            ) : null}
          </div>

          {/* DECODING SPINNER / FACTS SKELETON */}
          {isDecoding && (
            <div className="space-y-4 rounded-2xl border border-line bg-surface p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-14 rounded" />
                  </div>
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-8 w-24 rounded-lg" />
              </div>

              <div className="rounded-xl border border-line/70 bg-deep/40 p-4">
                <div className="flex items-end justify-between gap-1 h-20">
                  {Array.from({ length: 42 }).map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-1 rounded-full bg-primary/20"
                      style={{
                        height: `${Math.max(18, Math.sin(i * 0.28) * 65 + 30)}%`,
                      }}
                    />
                  ))}
                </div>
              </div>

              <MusicEditFacts />
            </div>
          )}

          {/* STEP 2: Acoustic Preset & DSP Parameters */}
          {!isDecoding && (
            <div
              className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                activeStep === 2
                  ? "border-line-strong bg-surface/90 shadow-md p-6"
                  : "border-line bg-surface/40 p-4",
                maxUnlockedStep < 2 && "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold">
                    02
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-fg">Step 2: Choose Acoustic Preset &amp; Sculpt DSP</h2>
                    <p className="text-xs text-muted">Pick from 36 standard presets or dial custom parameters</p>
                  </div>
                </div>

                {maxUnlockedStep >= 2 && activeStep !== 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveStep(2)}
                    className="text-xs"
                  >
                    <span>Edit Preset ({selectedPreset?.name})</span>
                  </Button>
                )}
              </div>

              {maxUnlockedStep < 2 ? (
                <div className="rounded-xl border border-line/60 bg-raised/30 p-6 text-center text-xs text-muted flex items-center justify-center gap-2">
                  <Lock size={15} />
                  <span>Upload an audio file in Step 1 to unlock acoustic presets &amp; DSP knobs.</span>
                </div>
              ) : activeStep === 2 ? (
                <div className="space-y-5">
                  <SoundSelector />

                  <div className="flex items-center justify-between border-t border-line pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveStep(1)}
                      className="gap-1.5"
                    >
                      <ArrowLeft size={13} weight="bold" />
                      <span>Back to Audio</span>
                    </Button>

                    <Button
                      size="md"
                      onClick={() => setActiveStep(3)}
                      className="rounded-full shadow-glow-wire"
                    >
                      <span>Next: Audition Waveform</span>
                      <ArrowRight size={14} weight="bold" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-xl bg-surface/60 border border-line p-3 text-xs">
                  <span className="font-semibold text-fg">Selected: {selectedPreset?.name}</span>
                  <span className="text-muted font-mono text-[11px]">{selectedPreset?.category}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Preview Source Track & Waveform Audition */}
          {!isDecoding && (
            <div
              className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                activeStep === 3
                  ? "border-line-strong bg-surface/90 shadow-md p-6"
                  : "border-line bg-surface/40 p-4",
                maxUnlockedStep < 3 && "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold">
                    03
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-fg">Step 3: Audition &amp; Waveform Inspection</h2>
                    <p className="text-xs text-muted">Audition decoded PCM peaks and scrub dry/wet audio</p>
                  </div>
                </div>

                {maxUnlockedStep >= 3 && activeStep !== 3 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setActiveStep(3)}
                    className="text-xs"
                  >
                    <span>Inspect Player</span>
                  </Button>
                )}
              </div>

              {maxUnlockedStep < 3 ? (
                <div className="rounded-xl border border-line/60 bg-raised/30 p-6 text-center text-xs text-muted flex items-center justify-center gap-2">
                  <Lock size={15} />
                  <span>Select a sound preset in Step 2 to preview waveform playback.</span>
                </div>
              ) : activeStep === 3 ? (
                <div className="space-y-5">
                  <AudioPlayer />

                  <div className="flex items-center justify-between border-t border-line pt-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setActiveStep(2)}
                      className="gap-1.5"
                    >
                      <ArrowLeft size={13} weight="bold" />
                      <span>Back to Presets</span>
                    </Button>

                    <Button
                      size="md"
                      onClick={() => setActiveStep(4)}
                      className="rounded-full shadow-glow-wire"
                    >
                      <span>Next: Process &amp; Export</span>
                      <ArrowRight size={14} weight="bold" />
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )}

          {/* STEP 4: Render DSP & Lossless Export */}
          {!isDecoding && (
            <div
              className={cn(
                "rounded-2xl border transition-all duration-300 overflow-hidden",
                activeStep === 4
                  ? "border-line-strong bg-surface/90 shadow-md p-6"
                  : "border-line bg-surface/40 p-4",
                maxUnlockedStep < 3 && "opacity-50 pointer-events-none"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-mono font-bold">
                    04
                  </span>
                  <div>
                    <h2 className="text-sm font-semibold text-fg">Step 4: Process Audio &amp; Export Master</h2>
                    <p className="text-xs text-muted">OfflineAudioContext DSP engine with rate-limited CPU protection</p>
                  </div>
                </div>
              </div>

              {maxUnlockedStep < 3 ? (
                <div className="rounded-xl border border-line/60 bg-raised/30 p-6 text-center text-xs text-muted flex items-center justify-center gap-2">
                  <Lock size={15} />
                  <span>Complete previous steps to unlock processing and master export.</span>
                </div>
              ) : (
                <ProcessAndOutput />
              )}
            </div>
          )}
        </div>

        {/* Respectful Ad Slot placed cleanly below the entire editing experience */}
        <div className="mt-14 border-t border-line pt-8">
          <AdPlaceholder
            size="banner"
            note="Unobtrusive banner placement strictly below all workspace controls"
          />
        </div>
      </div>
    </div>
  );
}
