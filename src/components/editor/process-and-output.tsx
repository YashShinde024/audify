"use client";

import Link from "next/link";
import {
  CircleNotch,
  CheckCircle,
  ArrowsClockwise,
  WarningCircle,
  MusicNotes,
  ShieldCheck,
  Waveform,
  X,
  Sparkle,
  Info,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { selectIsResultStale, useEditorStore } from "@/stores/editor-store";
import { getPresetById } from "@/config/presets";
import { cn, formatBytes, formatTime } from "@/lib/utils";
import { ExportPanel } from "./export-panel";
import { MusicEditFacts } from "./music-facts";
import { DownloadButton } from "@/components/ui/download-button";

const easeOut = [0.2, 0.8, 0.2, 1] as const;

export function ProcessAndOutput() {
  const file = useEditorStore((s) => s.file);
  const decodedAudio = useEditorStore((s) => s.decodedAudio);
  const isDecoding = useEditorStore((s) => s.isDecoding);
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectedPreset = getPresetById(selectedPresetId ?? "");

  const isProcessing = useEditorStore((s) => s.isProcessing);
  const processingProgress = useEditorStore((s) => s.processingProgress);
  const processingStatus = useEditorStore((s) => s.processingStatus);
  const processingError = useEditorStore((s) => s.processingError);
  const processedResult = useEditorStore((s) => s.processedResult);
  const processAudio = useEditorStore((s) => s.processAudio);
  const cancelProcessing = useEditorStore((s) => s.cancelProcessing);
  const clearProcessedResult = useEditorStore((s) => s.clearProcessedResult);
  const isStale = useEditorStore(selectIsResultStale);

  if (!file) return null;

  const presetName = selectedPreset ? selectedPreset.name : "Custom DSP";
  const canProcess = Boolean(decodedAudio) && !isProcessing && !isDecoding;
  const percent = Math.round(Math.min(1, Math.max(0, processingProgress)) * 100);

  /* ------------------------------- Result view ------------------------------ */
  if (processedResult && !isProcessing) {
    return (
      <motion.section
        aria-labelledby="output-heading"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.24, ease: easeOut }}
        className="space-y-4 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <CheckCircle size={18} weight="fill" />
            </span>
            <div>
              <h3 id="output-heading" className="text-sm font-semibold text-fg">
                Master Render Complete
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                {presetName} · {processedResult.channels === 1 ? "Mono" : "Stereo"} ·{" "}
                {(processedResult.sampleRate / 1000).toFixed(1)} kHz ·{" "}
                {processedResult.bitDepthOrBitrate}
              </p>
            </div>
          </div>

          <DownloadButton url={processedResult.url} filename={processedResult.filename} />
        </div>

        {isStale && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs">
            <span className="flex items-start gap-2 text-fg">
              <Info size={15} className="mt-px shrink-0 text-amber-500" />
              Settings or knobs were modified after this render. Click re-render to update the master file.
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => void processAudio()}
              className="shrink-0 text-xs h-7"
            >
              <ArrowsClockwise size={13} />
              Re-render
            </Button>
          </div>
        )}

        {/* Master File Metadata Box */}
        <div className="rounded-xl border border-line bg-deep/50 p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-primary">
                <MusicNotes size={20} weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-xs sm:text-sm font-semibold text-fg">
                  {processedResult.filename}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
                  <span className="font-mono font-medium">{formatBytes(processedResult.sizeBytes)}</span>
                  <span aria-hidden="true" className="text-line-strong">·</span>
                  <span className="font-mono">{formatTime(processedResult.duration)}</span>
                  <span aria-hidden="true" className="text-line-strong">·</span>
                  <span className="uppercase font-mono text-[10px] bg-surface px-1.5 py-0.5 rounded border border-line">{processedResult.format}</span>
                  {processedResult.isPeakProtected && (
                    <>
                      <span aria-hidden="true" className="text-line-strong">·</span>
                      <span className="inline-flex items-center gap-1 text-primary">
                        <ShieldCheck size={13} weight="duotone" />
                        {processedResult.limiterReductionDb > 0.01
                          ? `limiter reduced ${processedResult.limiterReductionDb.toFixed(1)} dB`
                          : "limiter armed (clean)"}
                      </span>
                    </>
                  )}
                  {processedResult.isNormalized && (
                    <>
                      <span aria-hidden="true" className="text-line-strong">·</span>
                      <span className="inline-flex items-center gap-1 text-emerald-500">
                        <Sparkle size={13} weight="duotone" />
                        normalized +{processedResult.normalizeDb.toFixed(1)} dB
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Acoustic Diagnostics & Signal Telemetry */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-0.5 text-[11px] font-mono">
          <div className="rounded-lg border border-line bg-deep/40 p-2.5">
            <span className="text-muted block text-[10px] uppercase font-sans font-semibold">Render Time</span>
            <span className="text-fg font-medium">
              {processedResult.renderDurationMs !== undefined ? `${processedResult.renderDurationMs}ms` : "< 1s"}
            </span>
          </div>
          <div className="rounded-lg border border-line bg-deep/40 p-2.5">
            <span className="text-muted block text-[10px] uppercase font-sans font-semibold">True Peak</span>
            <span className={cn(
              "font-medium",
              processedResult.peakDbfs > -0.5 ? "text-amber-500" : "text-fg"
            )}>
              {processedResult.peakDbfs !== undefined ? `${processedResult.peakDbfs.toFixed(1)} dBFS` : "--"}
            </span>
          </div>
          <div className="rounded-lg border border-line bg-deep/40 p-2.5">
            <span className="text-muted block text-[10px] uppercase font-sans font-semibold">RMS Loudness</span>
            <span className="text-fg font-medium">
              {processedResult.rmsDbfs !== undefined ? `${processedResult.rmsDbfs.toFixed(1)} dBFS` : "--"}
            </span>
          </div>
          <div className="rounded-lg border border-line bg-deep/40 p-2.5">
            <span className="text-muted block text-[10px] uppercase font-sans font-semibold">Signal Path</span>
            <span className="text-primary font-medium text-[10px] font-sans">100% In-Memory DSP</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-3.5 text-xs">
          <span className="text-muted">
            The audition deck above is now playing your rendered master with A/B comparison enabled.
          </span>
          <Button variant="outline" size="sm" onClick={clearProcessedResult} className="text-xs h-7">
            <ArrowsClockwise size={13} />
            <span>New Master Setup</span>
          </Button>
        </div>
      </motion.section>
    );
  }

  /* ---------------------------- Ready / rendering --------------------------- */
  return (
    <motion.section
      aria-labelledby="processing-action-heading"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: easeOut }}
      className="space-y-5 rounded-2xl border border-line bg-surface p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden"
    >
      {!isProcessing && (
        <div className="min-w-0 overflow-hidden">
          <ExportPanel />
        </div>
      )}

      <div className="space-y-2.5 border-t border-line pt-5">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="min-w-0">
            <h3 id="processing-action-heading" className="text-sm font-semibold text-fg">
              {isProcessing ? "Rendering Master Audio" : "Render Master File"}
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              {isProcessing ? (
                processingStatus
              ) : isDecoding ? (
                "Decoding source audio…"
              ) : (
                <>
                  Applies <strong className="font-semibold text-fg">{presetName}</strong> DSP curve to{" "}
                  <span className="font-mono text-muted">{file.name}</span>.
                </>
              )}
            </p>
          </div>

          {isProcessing ? (
            <Button variant="outline" size="md" onClick={cancelProcessing} className="shrink-0 text-xs">
              <X size={14} />
              <span>Cancel Render</span>
            </Button>
          ) : (
            <Button
              size="md"
              disabled={!canProcess}
              onClick={() => void processAudio()}
              aria-label={`Process audio with ${presetName}`}
              className="shrink-0 rounded-full shadow-glow-wire px-6 cursor-pointer"
            >
              <Waveform size={16} weight="duotone" />
              <span>Render Master</span>
            </Button>
          )}
        </div>

        {/* Quiet, accessible legal agreement notice adjacent to primary processing action */}
        <p className="text-[11px] text-faint leading-normal">
          By submitting your audio for processing, you agree to our{" "}
          <Link
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg/80 underline decoration-line underline-offset-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            Terms of Service
          </Link>{" "}
          and acknowledge our{" "}
          <Link
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fg/80 underline decoration-line underline-offset-2 transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>

      <AnimatePresence initial={false}>
        {isProcessing && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/25 bg-surface p-4 sm:p-5 space-y-4 shadow-sm min-w-0 overflow-hidden">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-2 font-medium text-fg">
                  <CircleNotch size={16} className="shrink-0 animate-spin text-primary" />
                  <span className="truncate font-semibold">{processingStatus}</span>
                </span>
                <span className="shrink-0 font-mono text-xs font-bold text-primary tnum">{percent}%</span>
              </div>

              {/* Glowing Wire Progress Bar */}
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-deep relative"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Render progress"
              >
                <div
                  className="h-full rounded-full bg-wire-gradient transition-[width] duration-200 ease-out shadow-glow-wire"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Visual DSP Node Pipeline Stages */}
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-2 text-[10px] font-mono min-w-0">
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all duration-150",
                  percent >= 15 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  1. Graph Setup
                </div>
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all duration-150",
                  percent >= 45 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  2. DSP Compute
                </div>
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all duration-150",
                  percent >= 75 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  3. Peak Limiting
                </div>
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all duration-150",
                  percent >= 95 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  4. Packaging
                </div>
              </div>

              <p className="text-[11px] text-faint">
                OfflineAudioContext executing at maximum CPU throughput. 100% in-browser rendering with zero cloud latency.
              </p>

              {/* Audio engineering trivia while rendering */}
              <MusicEditFacts className="border-line/80 bg-raised/70" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {processingError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-xl border border-error/25 bg-error/5 p-4 text-xs"
        >
          <div className="flex items-start gap-2.5">
            <WarningCircle size={16} className="mt-0.5 shrink-0 text-error" />
            <div>
              <p className="font-semibold text-fg">Processing could not complete</p>
              <p className="mt-0.5 text-muted leading-relaxed">{processingError}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void processAudio()}
            disabled={!canProcess}
            className="shrink-0 text-xs h-7"
          >
            Retry
          </Button>
        </div>
      )}
    </motion.section>
  );
}
