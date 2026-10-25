"use client";

import { useCallback, useRef, useState, type DragEvent } from "react";
import {
  UploadSimple,
  FileAudio,
  ArrowsClockwise,
  Trash,
  ShieldCheck,
  WarningCircle,
  CircleNotch,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { fileSizeError, supportedExtensions, validateAudioFile } from "@/lib/audio-file";
import { useEditorStore } from "@/stores/editor-store";
import { formatBytes, formatTime } from "@/lib/utils";
import { generateStudioSampleAudioFile } from "@/lib/sample-audio";

export function AudioUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isGeneratingDemo, setIsGeneratingDemo] = useState(false);

  const file = useEditorStore((s) => s.file);
  const isDecoding = useEditorStore((s) => s.isDecoding);
  const decodeError = useEditorStore((s) => s.decodeError);
  const selectFile = useEditorStore((s) => s.selectFile);
  const clearFile = useEditorStore((s) => s.clearFile);

  const handleSelectedFile = useCallback(
    (files: FileList | null) => {
      setLocalError(null);
      const selected = files?.[0];
      if (!selected) return;

      const validation = validateAudioFile(selected);
      if (!validation.ok) {
        setLocalError(fileSizeError(validation.reason));
        return;
      }

      void selectFile(selected);
    },
    [selectFile],
  );

  const handleLoadSample = useCallback(() => {
    try {
      setIsGeneratingDemo(true);
      setLocalError(null);
      const demoFile = generateStudioSampleAudioFile();
      void selectFile(demoFile).finally(() => setIsGeneratingDemo(false));
    } catch (err) {
      console.error("Failed to generate demo track:", err);
      setIsGeneratingDemo(false);
      setLocalError("Could not generate demo audio file in this browser.");
    }
  }, [selectFile]);

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleSelectedFile(e.dataTransfer.files);
  };

  // If a file is currently active
  if (file) {
    const ext = file.name.split(".").pop()?.toUpperCase() || "AUDIO";
    return (
      <section aria-label="Loaded audio file" className="rounded-2xl border border-line bg-surface p-4 sm:p-5 transition-all duration-200 min-w-0 overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* File details */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-primary">
              {isDecoding ? (
                <CircleNotch size={22} className="animate-spin text-primary" />
              ) : (
                <FileAudio size={22} weight="duotone" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-fg">
                  {file.name}
                </span>
                <span className="rounded bg-raised border border-line px-1.5 py-0.5 text-[10px] font-mono font-medium tracking-wide text-muted">
                  {ext}
                </span>
                {isDecoding && (
                  <span className="inline-flex items-center gap-1 rounded bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 text-[10px] font-medium text-amber-500 animate-pulse">
                    Decoding PCM…
                  </span>
                )}
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted">
                <span className="font-mono">{formatBytes(file.size)}</span>
                {file.duration ? (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span className="font-mono font-medium text-fg">{formatTime(file.duration)}</span>
                  </>
                ) : null}
                {file.sampleRate ? (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span className="font-mono">{(file.sampleRate / 1000).toFixed(1)} kHz</span>
                  </>
                ) : null}
                {file.channels ? (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span>{file.channels === 1 ? "Mono" : "Stereo"}</span>
                  </>
                ) : null}
                {file.detectedBpm ? (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span className="font-mono text-primary font-semibold">{file.detectedBpm} BPM</span>
                  </>
                ) : null}
              </div>
            </div>
          </div>

          {/* Actions: Replace / Remove */}
          <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              aria-label="Replace current file"
              className="text-xs h-8"
            >
              <ArrowsClockwise size={13} />
              <span>Replace</span>
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={clearFile}
              aria-label="Remove audio file"
              className="text-faint hover:text-error hover:bg-error/10 h-8 w-8"
            >
              <Trash size={15} />
            </Button>
          </div>
        </div>

        {/* Decode error feedback if any */}
        {decodeError && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-error/25 bg-error/5 p-3 text-xs text-error">
            <WarningCircle size={16} className="shrink-0 mt-0.5" />
            <span>{decodeError}</span>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={supportedExtensions.map((e) => `.${e}`).join(",") + ",audio/*"}
          className="sr-only"
          onChange={(e) => handleSelectedFile(e.target.files)}
          aria-label="Select replacement audio file"
        />
      </section>
    );
  }

  // Initial State: No file uploaded yet
  return (
    <section aria-labelledby="uploader-heading" className="rounded-2xl border border-line bg-surface p-6 sm:p-8 transition-all duration-200 min-w-0 overflow-hidden shadow-xs">
      <div
        role="region"
        aria-label="Audio file drag and drop zone"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-200 ${
          isDragging
            ? "border-primary bg-primary/5 scale-[1.005]"
            : "border-line-strong bg-deep/40 hover:bg-deep/60 hover:border-fg/25"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line bg-surface shadow-xs text-primary transition-transform duration-200 group-hover:scale-105">
          <UploadSimple size={28} weight="duotone" />
        </div>

        <h3 id="uploader-heading" className="mt-4 text-base sm:text-lg font-semibold text-fg tracking-tight">
          Drop your audio track to begin
        </h3>
        <p className="mt-1.5 text-xs text-muted max-w-sm leading-relaxed">
          Supports <span className="font-semibold text-fg">WAV, MP3, FLAC, OGG, AAC &amp; M4A</span> up to 10 MB.
          Processed 100% locally in your browser.
        </p>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            size="md"
            onClick={() => inputRef.current?.click()}
            aria-label="Select an audio file from your device"
            className="rounded-full shadow-glow-wire"
          >
            <UploadSimple size={15} weight="bold" />
            <span>Choose Audio File</span>
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={handleLoadSample}
            disabled={isGeneratingDemo}
            aria-label="Load synthesized demo track"
            className="rounded-full text-xs"
          >
            {isGeneratingDemo ? (
              <CircleNotch size={14} className="animate-spin text-primary" />
            ) : (
              <Sparkle size={14} className="text-primary" />
            )}
            <span>Try Sample Track</span>
          </Button>
        </div>

        <input
          ref={inputRef}
          type="file"
          accept={supportedExtensions.map((e) => `.${e}`).join(",") + ",audio/*"}
          className="sr-only"
          onChange={(e) => handleSelectedFile(e.target.files)}
          aria-label="Select an audio file from your device"
        />
      </div>

      {/* Concise privacy & local processing guarantee */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck size={16} weight="duotone" className="text-primary shrink-0" />
        <span>100% in-browser processing via Web Audio API. Audio never leaves your machine.</span>
      </div>

      {localError && (
        <div className="mt-3.5 flex items-center justify-center gap-2 text-xs font-medium text-error bg-error/10 border border-error/20 rounded-lg p-2.5">
          <WarningCircle size={16} className="shrink-0" />
          <span>{localError}</span>
        </div>
      )}
    </section>
  );
}
