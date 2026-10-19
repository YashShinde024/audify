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
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { fileSizeError, supportedExtensions, validateAudioFile } from "@/lib/audio-file";
import { siteConfig } from "@/config/site";
import { useEditorStore } from "@/stores/editor-store";
import { formatBytes, formatTime } from "@/lib/utils";

export function AudioUploader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

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

      selectFile(selected);
    },
    [selectFile],
  );

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
      <section aria-label="Loaded audio file" className="rounded-xl border border-line bg-surface p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* File details */}
          <div className="flex items-start sm:items-center gap-3.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-line bg-raised text-violet">
              {isDecoding ? (
                <CircleNotch size={20} className="animate-spin" />
              ) : (
                <FileAudio size={20} weight="duotone" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="truncate text-sm font-semibold text-fg">
                  {file.name}
                </span>
                <span className="rounded bg-raised px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-muted">
                  {ext}
                </span>
              </div>

              <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
                <span>{formatBytes(file.size)}</span>
                {file.duration ? (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span className="font-mono">{formatTime(file.duration)}</span>
                  </>
                ) : null}
                {file.sampleRate ? (
                  <>
                    <span aria-hidden="true" className="text-line-strong">·</span>
                    <span>{(file.sampleRate / 1000).toFixed(1)} kHz</span>
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
                    <span className="font-mono text-violet font-semibold">{file.detectedBpm} BPM</span>
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
            >
              <ArrowsClockwise size={14} />
              Replace
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={clearFile}
              aria-label="Remove audio file"
              className="text-faint hover:text-error hover:bg-error/10"
            >
              <Trash size={15} />
            </Button>
          </div>
        </div>

        {/* Decode error feedback if any */}
        {decodeError && (
          <div className="mt-3 flex items-start gap-2 rounded-lg border border-error/20 bg-error/5 p-3 text-xs text-error">
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
    <section aria-labelledby="uploader-heading" className="rounded-xl border border-line bg-surface p-6 sm:p-8">
      <div
        role="region"
        aria-label="Audio file drag and drop zone"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`flex flex-col items-center justify-center rounded-xl border border-dashed p-8 text-center transition-colors ${
          isDragging
            ? "border-violet bg-violet/5"
            : "border-line-strong bg-deep/40 hover:bg-deep/70 hover:border-fg/20"
        }`}
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-line bg-surface shadow-xs text-violet">
          <UploadSimple size={24} weight="duotone" />
        </div>

        <h3 id="uploader-heading" className="mt-4 text-base font-semibold text-fg">
          Select or drag your audio file here
        </h3>
        <p className="mt-1 text-xs text-muted max-w-sm">
          Supports {supportedExtensions.map((e) => e.toUpperCase()).join(", ")} · Up to 10 MB
        </p>

        <div className="mt-5">
          <Button
            size="md"
            onClick={() => inputRef.current?.click()}
            aria-label="Select an audio file from your device"
          >
            Choose Audio File
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
      <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted">
        <ShieldCheck size={16} weight="duotone" className="text-violet shrink-0" />
        <span>100% in-browser processing. Your audio never leaves your device or tab.</span>
      </div>

      {localError && (
        <div className="mt-3 flex items-center justify-center gap-2 text-xs font-medium text-error">
          <WarningCircle size={16} className="shrink-0" />
          <span>{localError}</span>
        </div>
      )}
    </section>
  );
}
