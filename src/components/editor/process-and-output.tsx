"use client";

import {
  DownloadSimple,
  CircleNotch,
  CheckCircle,
  ArrowsClockwise,
  WarningCircle,
  MusicNotes,
  ShieldCheck,
  Sparkle,
  Waveform,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { getPresetById } from "@/config/presets";
import { formatBytes, formatTime } from "@/lib/utils";
import { AudioPlayer } from "./audio-player";
import { ExportPanel } from "./export-panel";

/** DSP pipeline stages shown as an animated stepper while rendering. */
const PIPELINE_STAGES = ["Analyse", "Render DSP", "Normalize", "Encode"] as const;

const easeLux = [0.2, 0.8, 0.2, 1] as const;

export function ProcessAndOutput() {
  const file = useEditorStore((s) => s.file);
  const decodedAudio = useEditorStore((s) => s.decodedAudio);
  const selectedPresetId = useEditorStore((s) => s.selectedPresetId);
  const selectedPreset = getPresetById(selectedPresetId ?? "");

  const isProcessing = useEditorStore((s) => s.isProcessing);
  const processingStatus = useEditorStore((s) => s.processingStatus);
  const processingError = useEditorStore((s) => s.processingError);
  const processedResult = useEditorStore((s) => s.processedResult);
  const processAudio = useEditorStore((s) => s.processAudio);
  const clearProcessedResult = useEditorStore((s) => s.clearProcessedResult);

  // If no file loaded yet, do not render processing or output
  if (!file) {
    return null;
  }

  // State 2: Processed Output Destination State
  if (processedResult) {
    return (
      <motion.section
        aria-labelledby="output-heading"
        initial={{ opacity: 0, y: 16, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: easeLux }}
        className="rounded-xl border border-violet/30 bg-surface p-6 shadow-xs space-y-6 sm:p-7 dark:border-violet/25 dark:shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
      >
        {/* Success banner — checkmark springs in */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2.5">
            <motion.span
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 380, damping: 18, delay: 0.1 }}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-violet/20 text-violet"
            >
              <CheckCircle size={17} weight="bold" />
            </motion.span>
            <motion.h3
              id="output-heading"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.18, duration: 0.3 }}
              className="text-base font-semibold text-fg"
            >
              Audio Processed Successfully
            </motion.h3>
          </div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.3 }}
          >
            {processedResult.isPeakProtected && (
              <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                <ShieldCheck size={12} weight="duotone" />
                Peak Protected
              </span>
            )}
            {processedResult.isNormalized && (
              <span className="inline-flex items-center gap-1 rounded bg-violet/10 px-2 py-0.5 text-[11px] font-medium text-violet border border-violet/20">
                <Sparkle size={12} weight="duotone" />
                -0.5 dBFS Normalized
              </span>
            )}
            <span className="rounded bg-violet/10 px-2 py-0.5 text-xs font-semibold text-violet">
              Ready to Download
            </span>
          </motion.div>
        </div>

        {/* Processed metadata summary — staggered entrance, interactive lift */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="group rounded-lg border border-line bg-deep/40 p-4 transition-colors hover:border-violet/30"
        >
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <motion.div
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 300, damping: 20 }}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-surface text-violet transition-shadow group-hover:shadow-[0_0_18px_rgb(139_92_246/0.25)]"
              >
                <MusicNotes size={20} weight="duotone" />
              </motion.div>
              <motion.div
                className="min-w-0"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.34, duration: 0.3 }}
              >
                <p className="truncate font-mono text-sm font-semibold text-fg">
                  {processedResult.filename}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-semibold text-violet">{processedResult.bitDepthOrBitrate}</span>
                  <span>·</span>
                  <span className="tnum">{formatBytes(processedResult.sizeBytes)}</span>
                  <span>·</span>
                  <span className="font-mono tnum">{formatTime(processedResult.duration)}</span>
                  <span>·</span>
                  <span className="tnum">{(processedResult.sampleRate / 1000).toFixed(1)} kHz</span>
                  <span>·</span>
                  <span>{processedResult.channels === 1 ? "Mono" : "Stereo"}</span>
                </div>
              </motion.div>
            </div>

            {/* Download action — magnetic hover + ember glow trail */}
            <motion.a
              href={processedResult.url}
              download={processedResult.filename}
              aria-label={`Download processed file ${processedResult.filename}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.3 }}
              className="group/dl inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-gradient-to-r from-violet to-purple px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-shadow hover:shadow-[0_8px_28px_rgb(139_92_246/0.4)]"
            >
              <DownloadSimple size={16} weight="bold" className="transition-transform group-hover/dl:translate-y-0.5" />
              Download Audio
            </motion.a>
          </div>
        </motion.div>

        {/* Real in-browser auditioning & A/B comparison */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45, duration: 0.35 }}
        >
          <p className="mb-2 text-xs font-medium text-muted">
            Audition and compare against original audio:
          </p>
          <AudioPlayer />
        </motion.div>

        {/* Re-process / adjust action */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs"
        >
          <span className="text-muted">
            Want to try different parameters, another format, or a different preset?
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearProcessedResult}
            className="group/again cursor-pointer text-xs transition-colors hover:border-violet/40"
          >
            <ArrowsClockwise size={14} className="transition-transform duration-500 group-hover/again:rotate-180" />
            Adjust Settings & Process Again
          </Button>
        </motion.div>
      </motion.section>
    );
  }

  // State 1: Ready to Process (Pre-render) with Export Panel
  const isDecoding = useEditorStore.getState().isDecoding;
  const canProcess = Boolean(decodedAudio && !isProcessing && !isDecoding);

  return (
    <motion.section
      aria-labelledby="processing-action-heading"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: easeLux }}
      className="rounded-xl border border-line bg-surface p-5 space-y-6 sm:p-6 dark:shadow-[0_16px_50px_rgba(0,0,0,0.45)]"
    >
      {/* 5. Export settings section */}
      <div>
        <ExportPanel />
      </div>

      {/* 6. Execution trigger */}
      <div className="flex flex-col justify-between gap-4 border-t border-line pt-5 sm:flex-row sm:items-center">
        <div>
          <h3 id="processing-action-heading" className="text-base font-semibold text-fg">
            Ready to Render & Export
          </h3>
          <p className="mt-0.5 text-xs text-muted">
            Will apply{" "}
            <strong className="font-semibold text-fg">
              {selectedPreset ? selectedPreset.name : "Custom DSP Effects"}
            </strong>{" "}
            to {file.name}.
          </p>
        </div>

        {/* Prominent Process action — ember halo sweep on hover */}
        <motion.div
          whileHover={canProcess && !isProcessing ? { scale: 1.03 } : undefined}
          whileTap={canProcess && !isProcessing ? { scale: 0.97 } : undefined}
          transition={{ type: "spring", stiffness: 380, damping: 24 }}
        >
          <Button
            size="lg"
            disabled={!canProcess}
            onClick={() => processAudio()}
            aria-label={
              isProcessing
                ? "Audio is processing, please wait"
                : `Process audio with ${selectedPreset ? selectedPreset.name : "selected effects"}`
            }
            className={cnShrink()}
          >
            {isProcessing ? (
              <>
                <CircleNotch size={16} className="animate-spin" />
                Processing Audio…
              </>
            ) : (
              <>
                <Waveform size={15} weight="duotone" className="transition-transform group-hover:scale-110" />
                Process & Export
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Progress / status during DSP execution — pipeline stepper + shimmer */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: 8, height: 0 }}
            transition={{ duration: 0.28, ease: easeLux }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-violet/25 bg-violet/[0.06] p-4 dark:border-violet/20 dark:shadow-[inset_0_0_40px_rgba(139,92,246,0.06)]">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium text-violet">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet opacity-60" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-violet" />
                  </span>
                  {processingStatus}
                </span>
                <span className="font-mono text-[11px] text-muted">Web Audio OfflineContext</span>
              </div>

              {/* Pipeline stepper chips */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5" aria-hidden="true">
                {PIPELINE_STAGES.map((stage, i) => (
                  <motion.span
                    key={stage}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.18, type: "spring", stiffness: 320, damping: 22 }}
                    className="rounded-full border border-violet/20 bg-violet/10 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-violet/90 animate-pulse"
                    style={{ animationDelay: `${i * 0.45}s` }}
                  >
                    {String(i + 1).padStart(2, "0")} · {stage}
                  </motion.span>
                ))}
              </div>

              {/* Progress track with sweeping shimmer head */}
              <div className="relative mt-3 h-1.5 w-full overflow-hidden rounded-full bg-violet/15">
                <div className="absolute inset-y-0 left-0 w-2/3 rounded-full bg-gradient-to-r from-violet via-purple to-ember animate-pulse" />
                <div className="nx-shimmer-sweep absolute inset-y-0 -left-1/3 w-1/3 rounded-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error state */}
      {processingError && (
        <motion.div
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: [0, -3, 3, -2, 0] }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="flex items-start gap-2 rounded-lg border border-error/20 bg-error/5 p-3.5 text-xs text-error"
        >
          <WarningCircle size={16} className="mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">Processing could not complete</p>
            <p className="mt-0.5 text-error/90">{processingError}</p>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
}

function cnShrink() {
  return "group cursor-pointer shrink-0 min-w-48 relative overflow-hidden transition-shadow enabled:hover:shadow-[0_10px_36px_rgb(139_92_246/0.35)] disabled:opacity-40";
}
