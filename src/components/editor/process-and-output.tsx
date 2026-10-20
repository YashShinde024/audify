"use client";

import {
  DownloadSimple,
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
import { AudioPlayer } from "./audio-player";
import { ExportPanel } from "./export-panel";
import { MusicEditFacts } from "./music-facts";

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
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: easeOut }}
        className="space-y-5 rounded-xl border border-line bg-raised p-5 sm:p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-start gap-2.5">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-accent">
              <CheckCircle size={16} weight="fill" />
            </span>
            <div>
              <h3 id="output-heading" className="text-sm font-semibold text-fg">
                Render complete
              </h3>
              <p className="mt-0.5 text-xs text-muted">
                {presetName} · {processedResult.channels === 1 ? "mono" : "stereo"} ·{" "}
                {(processedResult.sampleRate / 1000).toFixed(1)} kHz ·{" "}
                {processedResult.bitDepthOrBitrate}
              </p>
            </div>
          </div>

          <a
            href={processedResult.url}
            download={processedResult.filename}
            aria-label={`Download ${processedResult.filename}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <DownloadSimple size={16} weight="bold" />
            Download
          </a>
        </div>

        {isStale && (
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-accent/25 bg-accent-soft px-3.5 py-3 text-xs">
            <span className="flex items-start gap-2 text-fg">
              <Info size={15} className="mt-px shrink-0 text-accent" />
              Settings changed since this render. The file below still matches the previous
              configuration.
            </span>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => void processAudio()}
              className="shrink-0"
            >
              <ArrowsClockwise size={14} />
              Reprocess
            </Button>
          </div>
        )}

        <div className="rounded-lg border border-line bg-canvas/60 p-4">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-raised text-accent">
                <MusicNotes size={18} weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="truncate font-mono text-sm font-medium text-fg">
                  {processedResult.filename}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
                  <span className="tnum">{formatBytes(processedResult.sizeBytes)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono tnum">{formatTime(processedResult.duration)}</span>
                  <span aria-hidden="true">·</span>
                  <span className="uppercase">{processedResult.format}</span>
                  {processedResult.isPeakProtected && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <ShieldCheck size={12} weight="duotone" />
                        {processedResult.limiterReductionDb > 0.01
                          ? `peak limited ${processedResult.limiterReductionDb.toFixed(1)} dB`
                          : "peak ceiling armed"}
                      </span>
                    </>
                  )}
                  {processedResult.isNormalized && (
                    <>
                      <span aria-hidden="true">·</span>
                      <span className="inline-flex items-center gap-1">
                        <Sparkle size={12} weight="duotone" />
                        peak normalized +{processedResult.normalizeDb.toFixed(1)} dB
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted">A/B compare original and processed:</p>
          <AudioPlayer />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs">
          <span className="text-muted">
            Change parameters, format, or preset and render again.
          </span>
          <Button variant="outline" size="sm" onClick={clearProcessedResult}>
            <ArrowsClockwise size={14} />
            Adjust &amp; reprocess
          </Button>
        </div>
      </motion.section>
    );
  }

  /* ---------------------------- Ready / rendering --------------------------- */
  return (
    <motion.section
      aria-labelledby="processing-action-heading"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: easeOut }}
      className="space-y-5 rounded-xl border border-line bg-raised p-5 sm:p-6"
    >
      {!isProcessing && (
        <div>
          <ExportPanel />
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
        <div className="min-w-0">
          <h3 id="processing-action-heading" className="text-sm font-semibold text-fg">
            {isProcessing ? "Rendering" : "Ready to render"}
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            {isProcessing ? (
              processingStatus
            ) : isDecoding ? (
              "Decoding source audio…"
            ) : (
              <>
                Applies <strong className="font-medium text-fg">{presetName}</strong> to{" "}
                <span className="break-all">{file.name}</span>.
              </>
            )}
          </p>
        </div>

        {isProcessing ? (
          <Button variant="outline" size="md" onClick={cancelProcessing} className="shrink-0">
            <X size={15} />
            Cancel
          </Button>
        ) : (
          <Button
            size="md"
            disabled={!canProcess}
            onClick={() => void processAudio()}
            aria-label={`Process audio with ${presetName}`}
            className="shrink-0"
          >
            <Waveform size={15} weight="duotone" />
            Process &amp; export
          </Button>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isProcessing && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: easeOut }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-primary/25 bg-surface/80 dark:bg-canvas/80 p-4 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="flex min-w-0 items-center gap-2 font-medium text-fg">
                  <CircleNotch size={15} className="shrink-0 animate-spin text-primary" />
                  <span className="truncate font-semibold">{processingStatus}</span>
                </span>
                <span className="shrink-0 font-mono text-xs font-bold text-primary tnum">{percent}%</span>
              </div>

              {/* Glowing Wire-Red Progress Bar */}
              <div
                className="h-2 w-full overflow-hidden rounded-full bg-line/80 relative"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={percent}
                aria-label="Render progress"
              >
                <div
                  className="h-full rounded-full bg-wire-gradient transition-[width] duration-300 ease-out shadow-[0_0_12px_rgba(230,0,38,0.5)]"
                  style={{ width: `${percent}%` }}
                />
              </div>

              {/* Visual DSP Node Pipeline Stages */}
              <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] font-mono">
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all",
                  percent >= 15 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  1. Graph Setup
                </div>
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all",
                  percent >= 45 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  2. DSP Offline Compute
                </div>
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all",
                  percent >= 75 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  3. Headroom Limiting
                </div>
                <div className={cn(
                  "p-2 rounded-lg border text-center transition-all",
                  percent >= 95 ? "border-primary/40 bg-primary/10 text-primary font-semibold" : "border-line/60 text-faint"
                )}>
                  4. Multi-format Packaging
                </div>
              </div>

              <p className="text-[11px] text-faint">
                OfflineAudioContext executing at maximum CPU throughput. 100% in-browser rendering with zero cloud latency.
              </p>

              {/* Music Editing Facts during DSP render */}
              <MusicEditFacts className="mt-3 border-line/80 bg-raised/70" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {processingError && (
        <div
          role="alert"
          className="flex items-start justify-between gap-3 rounded-lg border border-error/25 bg-error/5 p-3.5 text-xs"
        >
          <div className="flex items-start gap-2">
            <WarningCircle size={16} className="mt-px shrink-0 text-error" />
            <div>
              <p className="font-semibold text-fg">Processing could not complete</p>
              <p className="mt-0.5 text-muted">{processingError}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void processAudio()}
            disabled={!canProcess}
            className="shrink-0"
          >
            Retry
          </Button>
        </div>
      )}
    </motion.section>
  );
}
