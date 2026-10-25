"use client";

import React, { useRef, useState } from "react";
import {
  UploadSimple,
  MusicNotes,
  WarningCircle,
  X,
  FileAudio,
  Trash,
  ArrowUp,
  ArrowDown,
  SpinnerGap,
} from "@phosphor-icons/react";
import { decodeAudioFile, type DecodedAudio } from "@/lib/audio/decoding";
import { formatBytes, formatDurationMs } from "@/lib/audio/tools-engine";

export interface LoadedAudioFile {
  file: File;
  decoded: DecodedAudio;
  id: string;
}

interface ToolUploaderProps {
  multiFile?: boolean;
  maxFileSizeMb?: number;
  supportedInputs: string[];
  files: LoadedAudioFile[];
  onFilesChange: (files: LoadedAudioFile[]) => void;
  disabled?: boolean;
}

const SUPPORTED_EXTS = ["mp3", "wav", "ogg", "flac", "aac", "m4a", "aiff"];

export function ToolUploader({
  multiFile = false,
  maxFileSizeMb = 50,
  supportedInputs,
  files,
  onFilesChange,
  disabled = false,
}: ToolUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDecoding, setIsDecoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const maxSizeBytes = maxFileSizeMb * 1024 * 1024;

  const validateFile = (file: File): string | null => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    if (!SUPPORTED_EXTS.includes(ext) && !file.type.startsWith("audio/")) {
      return `File "${file.name}" is not a recognized audio format. Supported: ${supportedInputs.join(", ")}.`;
    }
    if (file.size > maxSizeBytes) {
      return `File "${file.name}" exceeds the ${maxFileSizeMb} MB browser memory limit (${(file.size / (1024 * 1024)).toFixed(1)} MB).`;
    }
    return null;
  };

  const handleFiles = async (fileList: FileList | File[]) => {
    setErrorMessage(null);
    const toProcess = Array.from(fileList);
    if (toProcess.length === 0) return;

    if (!multiFile && toProcess.length > 1) {
      toProcess.splice(1); // Keep only first for single-file tools
    }

    // Validate all first
    for (const file of toProcess) {
      const err = validateFile(file);
      if (err) {
        setErrorMessage(err);
        return;
      }
    }

    setIsDecoding(true);
    const newLoaded: LoadedAudioFile[] = [];

    try {
      for (const file of toProcess) {
        const decoded = await decodeAudioFile(file);
        newLoaded.push({
          file,
          decoded,
          id: `${file.name}-${file.size}-${Math.random().toString(36).substring(2, 7)}`,
        });
      }

      if (multiFile) {
        onFilesChange([...files, ...newLoaded]);
      } else {
        onFilesChange(newLoaded.slice(0, 1));
      }
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error && err.message
          ? err.message
          : "Failed to decode audio file. It may be corrupt or encoded in an unsupported codec."
      );
    } finally {
      setIsDecoding(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isDecoding) return;
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id: string) => {
    onFilesChange(files.filter((f) => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    if (!multiFile) return;
    const newIdx = direction === "up" ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= files.length) return;
    const copy = [...files];
    const [moved] = copy.splice(index, 1);
    copy.splice(newIdx, 0, moved);
    onFilesChange(copy);
  };

  return (
    <div className="w-full space-y-4">
      {/* Upload Zone */}
      {(files.length === 0 || multiFile) && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!disabled && !isDecoding) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !isDecoding && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer select-none group
            ${
              isDragging
                ? "border-primary bg-primary/10 scale-[1.01]"
                : "border-line/80 hover:border-primary/50 hover:bg-surface/80 bg-surface/40"
            }
            ${disabled || isDecoding ? "opacity-60 cursor-not-allowed" : ""}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={SUPPORTED_EXTS.map((ext) => `.${ext}`).join(",") + ",audio/*"}
            multiple={multiFile}
            onChange={(e) => e.target.files && handleFiles(e.target.files)}
            className="hidden"
            disabled={disabled || isDecoding}
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary group-hover:scale-110 group-hover:border-primary/60 transition-transform">
              {isDecoding ? (
                <SpinnerGap className="w-8 h-8 animate-spin text-primary" />
              ) : (
                <UploadSimple className="w-8 h-8" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-base sm:text-lg font-semibold text-fg">
                {isDecoding
                  ? "Decoding audio in browser memory..."
                  : multiFile && files.length > 0
                  ? "Add more audio tracks"
                  : "Drop your audio file here or click to browse"}
              </p>
              <p className="text-xs sm:text-sm text-muted">
                Supports {supportedInputs.join(", ")} · Up to {maxFileSizeMb} MB · 100% Client-Side Processing
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Error alert */}
      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-error/10 border border-error/25 text-error text-xs sm:text-sm">
          <WarningCircle className="w-5 h-5 shrink-0" />
          <span className="flex-1">{errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="p-1 hover:bg-error/20 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Loaded file list */}
      {files.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted px-1">
            <span>{multiFile ? `Selected Tracks (${files.length})` : "Loaded Track"}</span>
            {multiFile && (
              <span className="text-[11px] font-normal normal-case">
                Use arrows to change merge sequence
              </span>
            )}
          </div>

          <div className="space-y-2">
            {files.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5 rounded-xl border border-line bg-surface/90 backdrop-blur-sm"
              >
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                  <FileAudio className="w-5 h-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-fg truncate">{item.file.name}</p>
                  <p className="text-xs text-muted">
                    {formatDurationMs(item.decoded.duration)} · {formatBytes(item.file.size)} ·{" "}
                    {(item.decoded.sampleRate / 1000).toFixed(1)} kHz ·{" "}
                    {item.decoded.numberOfChannels === 1 ? "Mono" : "Stereo"}
                    {item.decoded.detectedBpm ? ` · ${item.decoded.detectedBpm} BPM` : ""}
                  </p>
                </div>

                {/* Multi-file reorder controls */}
                {multiFile && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg hover:bg-border/60 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move track up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className="p-1.5 rounded-lg hover:bg-border/60 text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:pointer-events-none transition-colors"
                      title="Move track down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Remove button */}
                <button
                  onClick={() => removeFile(item.id)}
                  disabled={disabled}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-muted-foreground hover:text-red-500 transition-colors"
                  title="Remove file"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
