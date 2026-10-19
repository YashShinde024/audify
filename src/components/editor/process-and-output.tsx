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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/stores/editor-store";
import { getPresetById } from "@/config/presets";
import { formatBytes, formatTime } from "@/lib/utils";
import { AudioPlayer } from "./audio-player";
import { ExportPanel } from "./export-panel";

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
      <section
        aria-labelledby="output-heading"
        className="rounded-xl border border-violet/30 bg-surface p-6 sm:p-7 shadow-xs space-y-6"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet/20 text-violet">
              <CheckCircle size={16} weight="bold" />
            </span>
            <h3 id="output-heading" className="text-base font-semibold text-fg">
              Audio Processed Successfully
            </h3>
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>

        {/* Processed Metadata Summary */}
        <div className="rounded-lg border border-line bg-deep/40 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface border border-line text-violet">
                <MusicNotes size={20} weight="duotone" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-fg font-mono">
                  {processedResult.filename}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="font-semibold text-violet">{processedResult.bitDepthOrBitrate}</span>
                  <span>·</span>
                  <span>{formatBytes(processedResult.sizeBytes)}</span>
                  <span>·</span>
                  <span className="font-mono">{formatTime(processedResult.duration)}</span>
                  <span>·</span>
                  <span>{(processedResult.sampleRate / 1000).toFixed(1)} kHz</span>
                  <span>·</span>
                  <span>{processedResult.channels === 1 ? "Mono" : "Stereo"}</span>
                </div>
              </div>
            </div>

            {/* Direct Download Action */}
            <a
              href={processedResult.url}
              download={processedResult.filename}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg bg-violet px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-accent-hover transition-colors shrink-0"
              aria-label={`Download processed file ${processedResult.filename}`}
            >
              <DownloadSimple size={16} weight="bold" />
              Download Audio
            </a>
          </div>
        </div>

        {/* Real In-Browser Auditioning & A/B Comparison */}
        <div>
          <p className="mb-2 text-xs font-medium text-muted">
            Audition and compare against original audio:
          </p>
          <AudioPlayer />
        </div>

        {/* Re-process / Adjust Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4 text-xs">
          <span className="text-muted">
            Want to try different parameters, another format, or a different preset?
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={clearProcessedResult}
            className="text-xs"
          >
            <ArrowsClockwise size={14} />
            Adjust Settings & Process Again
          </Button>
        </div>
      </section>
    );
  }

  // State 1: Ready to Process (Pre-render) with Export Panel
  const isDecoding = useEditorStore.getState().isDecoding;
  const canProcess = Boolean(decodedAudio && !isProcessing && !isDecoding);

  return (
    <section
      aria-labelledby="processing-action-heading"
      className="rounded-xl border border-line bg-surface p-5 sm:p-6 space-y-6"
    >
      {/* 5. Export Settings Section */}
      <div>
        <ExportPanel />
      </div>

      {/* 6. Execution Trigger */}
      <div className="border-t border-line pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 id="processing-action-heading" className="text-base font-semibold text-fg">
            Ready to Render & Export
          </h3>
          <p className="text-xs text-muted mt-0.5">
            Will apply{" "}
            <strong className="text-fg font-semibold">
              {selectedPreset ? selectedPreset.name : "Custom DSP Effects"}
            </strong>{" "}
            to {file.name}.
          </p>
        </div>

        {/* Single Prominent Process Audio Action */}
        <Button
          size="lg"
          disabled={!canProcess}
          onClick={() => processAudio()}
          aria-label={
            isProcessing
              ? "Audio is processing, please wait"
              : `Process audio with ${selectedPreset ? selectedPreset.name : "selected effects"}`
          }
          className="shrink-0 min-w-48"
        >
          {isProcessing ? (
            <>
              <CircleNotch size={16} className="animate-spin" />
              Processing Audio…
            </>
          ) : (
            <>
              Process & Export
            </>
          )}
        </Button>
      </div>

      {/* Progress / Status during DSP Execution */}
      {isProcessing && (
        <div className="rounded-lg border border-violet/20 bg-violet/5 p-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-violet flex items-center gap-2">
              <CircleNotch size={14} className="animate-spin" />
              {processingStatus}
            </span>
            <span className="text-muted text-[11px] font-mono">Web Audio OfflineContext</span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-violet/15">
            <div className="h-full w-2/3 animate-pulse rounded-full bg-violet" />
          </div>
        </div>
      )}

      {/* Error state */}
      {processingError && (
        <div className="flex items-start gap-2 rounded-lg border border-error/20 bg-error/5 p-3.5 text-xs text-error">
          <WarningCircle size={16} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Processing could not complete</p>
            <p className="mt-0.5 text-error/90">{processingError}</p>
          </div>
        </div>
      )}
    </section>
  );
}
