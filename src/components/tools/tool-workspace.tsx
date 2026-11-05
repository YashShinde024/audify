"use client";

import React, { useState, useRef } from "react";
import type { ToolDefinition, ToolSettingValue } from "@/config/tools-registry";
import { ToolUploader, type LoadedAudioFile } from "./tool-uploader";
import { ToolSettings } from "./tool-settings";
import { ToolPlayer } from "./tool-player";
import {
  executeToolTask,
  type ToolExecutionResult,
  type SingleToolResult,
  type SplitToolResult,
  type MetadataToolResult,
  formatBytes,
  formatDurationMs,
} from "@/lib/audio/tools-engine";
import {
  downloadFile as platformDownload,
  triggerDownload,
} from "@/lib/download";
import { toolDspLimiter } from "@/lib/rate-limiter";
import { playCompletionSound, primeCompletionSound } from "@/lib/audio/completion-sound";
import { SoundSettings } from "@/components/ui/sound-settings";
import {
  DownloadSimple,
  ArrowCounterClockwise,
  CheckCircle,
  SpinnerGap,
  Sparkle,
  Copy,
  SlidersHorizontal,
  ShieldCheck,
  FileCode,
  WarningCircle,
} from "@phosphor-icons/react";
import Link from "next/link";

interface ToolWorkspaceProps {
  tool: ToolDefinition;
}

type WorkspaceState = "idle" | "ready" | "processing" | "completed";

export function ToolWorkspace({ tool }: ToolWorkspaceProps) {
  const [files, setFiles] = useState<LoadedAudioFile[]>([]);
  const [settings, setSettings] = useState<Record<string, ToolSettingValue>>(() => {
    const initial: Record<string, ToolSettingValue> = {};
    tool.settings?.forEach((s) => {
      initial[s.id] = s.defaultValue;
    });
    return initial;
  });

  const [state, setState] = useState<WorkspaceState>("idle");
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ToolExecutionResult | null>(null);
  const [copiedJson, setCopiedJson] = useState(false);

  const isCancelledRef = useRef(false);

  // Derived state: no files => idle; files present with idle state => ready.
  const displayState: WorkspaceState =
    files.length === 0 ? "idle" : state === "idle" ? "ready" : state;

  // Handle settings change
  const handleSettingChange = (id: string, value: ToolSettingValue) => {
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleResetSettings = () => {
    const initial: Record<string, ToolSettingValue> = {};
    tool.settings?.forEach((s) => {
      initial[s.id] = s.defaultValue;
    });
    setSettings(initial);
  };

  // Start processing
  const handleProcess = async () => {
    if (files.length === 0) return;

    // Prime Web Audio context during user interaction gesture
    primeCompletionSound();

    // Rate-limiting safeguard to prevent client device thread lock & excessive memory allocations
    const rateCheck = toolDspLimiter.check();
    if (!rateCheck.allowed) {
      setError(rateCheck.reason || "Client device CPU safeguard: please wait a moment before executing audio tools again.");
      return;
    }

    setError(null);
    setState("processing");
    setProgress(5);
    setStatusMessage("Preparing audio buffers...");
    isCancelledRef.current = false;

    try {
      const rawFiles = files.map((f) => f.file);
      const rawBuffers = files.map((f) => f.decoded.buffer);

      const res = await executeToolTask(
        tool.slug,
        rawFiles,
        rawBuffers,
        settings,
        (p, status) => {
          setProgress(p);
          setStatusMessage(status);
        },
        () => isCancelledRef.current
      );

      setResult(res);
      setState("completed");
      void playCompletionSound("tool-" + tool.slug + "-" + Date.now());
    } catch (err: unknown) {
      if (!isCancelledRef.current) {
        setError(
          err instanceof Error && err.message
            ? err.message
            : "An unexpected error occurred during audio processing."
        );
      }
      setState("ready");
    }
  };

  const handleCancel = () => {
    isCancelledRef.current = true;
    setState("ready");
    setProgress(0);
    setStatusMessage("");
  };

  const handleStartOver = () => {
    setFiles([]);
    setResult(null);
    setState("idle");
    setProgress(0);
    setError(null);
  };

  const downloadFile = (url: string, filename: string) => {
    void platformDownload(url, filename).catch(() => {
      triggerDownload(url, filename);
    });
  };

  const handleCopyJson = (json: string) => {
    navigator.clipboard.writeText(json);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const primaryDuration = files[0]?.decoded.duration || 60;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Upload & Files Section */}
      <div className="space-y-4">
        <ToolUploader
          multiFile={tool.multiFile}
          supportedInputs={tool.supportedInputs}
          files={files}
          onFilesChange={(newFiles) => {
            setFiles(newFiles);
            if (newFiles.length === 0) {
              setResult(null);
              setError(null);
            }
          }}
          disabled={displayState === "processing"}
        />
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/20 text-error text-sm">
          <WarningCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1">{error}</span>
          <button
            onClick={() => setError(null)}
            className="text-xs font-semibold underline hover:no-underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Ready / Configure Section */}
      {files.length > 0 && displayState !== "completed" && (
        <div className="space-y-6">
          <ToolSettings
            tool={tool}
            values={settings}
            onChange={handleSettingChange}
            onReset={handleResetSettings}
            audioDuration={primaryDuration}
            disabled={displayState === "processing"}
          />

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 sm:p-5 rounded-2xl border border-line bg-surface/60 backdrop-blur-sm">
            <div className="text-xs text-muted text-center sm:text-left">
              <span className="font-semibold text-fg">Processing:</span> 100% Client-Side in Browser Memory Â· Zero Cloud Uploads
            </div>

            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
              <SoundSettings variant="compact" />
              {displayState === "processing" ? (
                <button
                  onClick={handleCancel}
                  className="px-5 py-2.5 rounded-xl border border-line hover:bg-raised text-sm font-medium text-muted hover:text-fg transition-colors"
                >
                  Cancel
                </button>
              ) : (
                <button
                  onClick={handleProcess}
                  disabled={files.length === 0}
                  className="btn-gradient-primary btn-sweep-reverse w-full sm:w-auto px-7 py-3 rounded-xl font-semibold text-sm text-white inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Sparkle className="w-4 h-4" />
                  <span>Process Audio</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Processing State with Live Progress Bar */}
      {displayState === "processing" && (
        <div className="p-8 rounded-2xl border border-primary/30 bg-primary/5 backdrop-blur-sm space-y-4 text-center">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <SpinnerGap className="w-6 h-6 animate-spin" />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-semibold text-fg">{statusMessage}</h4>
            <p className="text-xs text-muted font-mono">{progress}% Complete</p>
          </div>

          {/* Progress track */}
          <div className="w-full max-w-md mx-auto h-2 bg-raised rounded-full overflow-hidden border border-line">
            <div
              className="h-full bg-gradient-to-r from-purple via-pink to-orange transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Completed Result State */}
      {displayState === "completed" && result && (
        <div className="space-y-6">
          {/* Header Banner */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-success/10 border border-success/30 text-success">
            <CheckCircle className="w-6 h-6 shrink-0" weight="fill" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold">Processing Finished Successfully!</h4>
              <p className="text-xs opacity-90">
                Your audio was rendered locally. Ready for instant preview and download.
              </p>
            </div>
          </div>

          {/* 1. SINGLE AUDIO RESULT */}
          {result.kind === "single" && (
            <div className="space-y-5 p-6 rounded-2xl border border-line bg-surface/60 backdrop-blur-sm">
              <ToolPlayer
                url={result.result.url}
                duration={result.result.duration}
                fileName={result.result.filename}
              />

              {/* Technical Specifications Badge Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl border border-line bg-raised/40 space-y-0.5">
                  <span className="text-[11px] text-muted uppercase font-medium">Format</span>
                  <p className="text-sm font-mono font-semibold text-fg uppercase">
                    {result.result.format} ({result.result.bitDepthOrBitrate})
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-line bg-raised/40 space-y-0.5">
                  <span className="text-[11px] text-muted uppercase font-medium">Output Size</span>
                  <p className="text-sm font-mono font-semibold text-fg">
                    {formatBytes(result.result.sizeBytes)}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-line bg-raised/40 space-y-0.5">
                  <span className="text-[11px] text-muted uppercase font-medium">Duration</span>
                  <p className="text-sm font-mono font-semibold text-fg">
                    {formatDurationMs(result.result.duration)}
                  </p>
                </div>

                <div className="p-3 rounded-xl border border-line bg-raised/40 space-y-0.5">
                  <span className="text-[11px] text-muted uppercase font-medium">Channels</span>
                  <p className="text-sm font-mono font-semibold text-fg">
                    {result.result.channels === 1 ? "Mono" : "Stereo"} ({(result.result.sampleRate / 1000).toFixed(1)} kHz)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-line">
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-fg px-4 py-2 rounded-xl hover:bg-raised border border-line transition-colors w-full sm:w-auto justify-center"
                >
                  <ArrowCounterClockwise className="w-4 h-4" />
                  <span>Process Another File</span>
                </button>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {tool.presetId && (
                    <Link
                      href={`/studio?preset=${tool.presetId}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-line hover:bg-raised text-xs font-semibold text-fg transition-colors"
                      title="Fine-tune in full Audify Studio"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>Open in Studio</span>
                    </Link>
                  )}

                  <button
                    onClick={() => downloadFile(result.result.url, result.result.filename)}
                    className="btn-gradient-primary btn-sweep-offset-a flex-1 sm:flex-initial px-7 py-3 rounded-xl font-semibold text-sm text-white inline-flex items-center justify-center gap-2 active:scale-95 transition-transform"
                  >
                    <DownloadSimple className="w-4 h-4" />
                    <span>Download Output</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 2. SPLIT SEGMENTS RESULT */}
          {result.kind === "split" && (
            <div className="space-y-5 p-6 rounded-2xl border border-line bg-surface/60 backdrop-blur-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h4 className="text-base font-semibold text-fg">Generated Audio Segments</h4>
                  <p className="text-xs text-muted">
                    Divided into {result.segments.length} playable files ({formatDurationMs(result.totalDuration)} total)
                  </p>
                </div>
                <button
                  onClick={() => {
                    result.segments.forEach((seg, i) => {
                      setTimeout(() => downloadFile(seg.url, seg.name), i * 300);
                    });
                  }}
                  className="px-4 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 text-xs font-semibold transition-colors active:scale-95"
                  title="Each segment will be saved as a separate file by your browser"
                >
                  Download All ({result.segments.length})
                </button>
              </div>

              <div className="space-y-3">
                {result.segments.map((seg, idx) => (
                  <div
                    key={seg.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border border-line bg-raised/40"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-fg truncate">{seg.name}</p>
                      <p className="text-xs text-muted font-mono">
                        {seg.durationFormatted} · {seg.sizeFormatted} · WAV Lossless
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <audio src={seg.url} controls className="h-8 w-full max-w-[200px] xs:w-auto" />
                      <button
                        onClick={() => downloadFile(seg.url, seg.name)}
                        className="px-3.5 py-1.5 rounded-lg bg-surface hover:bg-raised border border-line text-xs font-semibold text-fg inline-flex items-center gap-1.5 transition-colors cursor-pointer active:scale-95"
                      >
                        <DownloadSimple className="w-3.5 h-3.5" />
                        <span>Save</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-line">
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-fg px-4 py-2 rounded-xl hover:bg-raised border border-line transition-colors cursor-pointer"
                >
                  <ArrowCounterClockwise className="w-4 h-4" />
                  <span>Split Another File</span>
                </button>
              </div>
            </div>
          )}

          {/* 3. METADATA DIAGNOSTIC RESULT */}
          {result.kind === "metadata" && (
            <div className="space-y-6 p-4 sm:p-6 rounded-2xl border border-line bg-surface/60 backdrop-blur-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-line">
                <div>
                  <h4 className="text-base font-semibold text-fg">Technical File Diagnostics</h4>
                  <p className="text-xs text-muted font-mono truncate max-w-md">
                    {result.report.fileName} ({result.report.fileSizeFormatted})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyJson(result.rawJson)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-raised text-xs font-medium text-fg transition-colors cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedJson ? "Copied!" : "Copy JSON"}</span>
                  </button>
                  <button
                    onClick={async () => {
                      const url = URL.createObjectURL(new Blob([result.rawJson], { type: "application/json" }));
                      await platformDownload(url, `${result.report.fileName}-metadata.json`);
                      setTimeout(() => URL.revokeObjectURL(url), 60_000);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-line bg-surface hover:bg-raised text-xs font-medium text-fg transition-colors cursor-pointer"
                  >
                    <FileCode className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>
              </div>

              {/* Diagnostics Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">Sample Rate</span>
                  <p className="text-sm font-mono font-semibold text-fg">{result.report.sampleRateFormatted}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">Channel Layout</span>
                  <p className="text-sm font-mono font-semibold text-fg">{result.report.channelLayout}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">Duration</span>
                  <p className="text-sm font-mono font-semibold text-fg">{result.report.durationFormatted}</p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">Peak Amplitude</span>
                  <p className="text-sm font-mono font-semibold text-fg">
                    {result.report.peakDbfs} dBFS ({result.report.peakLinear.toFixed(3)})
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">RMS Loudness</span>
                  <p className="text-sm font-mono font-semibold text-fg">
                    {result.report.rmsDbfs} dBFS ({result.report.rmsLinear.toFixed(3)})
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">Dynamic Range</span>
                  <p className="text-sm font-mono font-semibold text-fg">{result.report.dynamicRangeDb} dB</p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">DC Bias Offset</span>
                  <p className="text-sm font-mono font-semibold text-fg">
                    {result.report.dcOffsetPercent.toFixed(4)}%
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">Detected Tempo</span>
                  <p className="text-sm font-mono font-semibold text-fg">
                    {result.report.detectedBpm ? `${result.report.detectedBpm} BPM` : "Unquantized / Ambient"}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-line bg-raised/40 space-y-1">
                  <span className="text-xs text-muted">MIME / Format</span>
                  <p className="text-sm font-mono font-semibold text-fg truncate">{result.report.mimeType}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-line">
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center gap-2 text-xs font-medium text-muted hover:text-fg px-4 py-2 rounded-xl hover:bg-raised border border-line transition-colors"
                >
                  <ArrowCounterClockwise className="w-4 h-4" />
                  <span>Inspect Another File</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Non-intrusive Ad/Sponsor Container (Free usage & restrained advertising readiness) */}
      <div className="pt-6 border-t border-line">
        <div className="p-4 rounded-xl border border-dashed border-line bg-surface/30 text-center space-y-1">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted/80">
            Free Audio Utility Hub Â· Sponsored Area
          </p>
          <p className="text-xs text-muted">
            Audify Tools will always remain 100% free with no wait-walls or artificial processing limits.
          </p>
        </div>
      </div>
    </div>
  );
}
