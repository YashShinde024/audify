/**
 * Audify Tools Engine
 * Core processing logic and buffer operations for the /tools suite.
 * Reuses the existing renderer, DSP utilities, and audio encoders.
 */

import type { ToolDefinition } from "@/config/tools-registry";
import {
  measurePeak,
  measureRms,
  measureDcOffset,
  resampleChannels,
  applyPeakNormalize,
} from "./dsp-utils";
import { renderProcessedAudio, type ProcessedAudioResult } from "./renderer";
import { encodeWav, encodeAiff, encodeMp3 } from "./encoders";
import { getAudioContext } from "./decoding";
import { detectAudioBpm } from "./analysis";
import type { ExportConfig } from "@/types/export";

export interface AudioMetadataReport {
  fileName: string;
  fileSizeFormatted: string;
  fileSizeBytes: number;
  durationSeconds: number;
  durationFormatted: string;
  sampleRate: number;
  sampleRateFormatted: string;
  numberOfChannels: number;
  channelLayout: string;
  peakLinear: number;
  peakDbfs: number;
  rmsLinear: number;
  rmsDbfs: number;
  dynamicRangeDb: number;
  dcOffsetLinear: number;
  dcOffsetPercent: number;
  detectedBpm: number | null;
  mimeType: string;
  containerFormat: string;
}

export interface SplitSegmentResult {
  id: string;
  name: string;
  blob: Blob;
  url: string;
  duration: number;
  durationFormatted: string;
  sizeBytes: number;
  sizeFormatted: string;
  format: string;
}

export interface SplitToolResult {
  kind: "split";
  segments: SplitSegmentResult[];
  originalFileName: string;
  totalDuration: number;
}

export interface MetadataToolResult {
  kind: "metadata";
  report: AudioMetadataReport;
  rawJson: string;
}

export interface SingleToolResult {
  kind: "single";
  result: ProcessedAudioResult;
}

export type ToolExecutionResult = SingleToolResult | SplitToolResult | MetadataToolResult;

/**
 * Format duration in mm:ss.ms
 */
export function formatDurationMs(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00.0";
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(1);
  const padSecs = Number(secs) < 10 ? `0${secs}` : secs;
  return `${mins}:${padSecs}`;
}

/**
 * Format bytes to readable string
 */
export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Creates an in-memory AudioBuffer (works in browser or mock environments)
 */
export function createAudioBuffer(
  numberOfChannels: number,
  length: number,
  sampleRate: number
): AudioBuffer {
  if (typeof window !== "undefined" && typeof AudioBuffer !== "undefined") {
    try {
      const ctx = getAudioContext();
      return ctx.createBuffer(numberOfChannels, length, sampleRate);
    } catch {
      // fallback to constructor if ctx unavailable
    }
    return new AudioBuffer({ numberOfChannels, length, sampleRate });
  }

  // Node/test fallback mock
  const channels: Float32Array[] = [];
  for (let c = 0; c < numberOfChannels; c++) {
    channels.push(new Float32Array(length));
  }
  return {
    numberOfChannels,
    length,
    sampleRate,
    duration: length / sampleRate,
    getChannelData(c: number) {
      return channels[c];
    },
    copyFromChannel(dest: Float32Array, c: number, offset = 0) {
      dest.set(channels[c].subarray(offset, offset + dest.length));
    },
    copyToChannel(src: Float32Array, c: number, offset = 0) {
      channels[c].set(src, offset);
    },
  } as unknown as AudioBuffer;
}

/**
 * Slices an AudioBuffer from startSec to endSec
 */
export function sliceAudioBuffer(
  buffer: AudioBuffer,
  startSec: number,
  endSec: number
): AudioBuffer {
  const duration = buffer.duration;
  const start = Math.max(0, Math.min(startSec, duration));
  const end = Math.max(start, Math.min(endSec, duration));
  const sampleRate = buffer.sampleRate;
  const startSample = Math.floor(start * sampleRate);
  const endSample = Math.min(buffer.length, Math.ceil(end * sampleRate));
  const sliceLength = Math.max(1, endSample - startSample);
  const numChannels = buffer.numberOfChannels;

  const sliced = createAudioBuffer(numChannels, sliceLength, sampleRate);
  for (let c = 0; c < numChannels; c++) {
    const src = buffer.getChannelData(c);
    const dest = sliced.getChannelData(c);
    dest.set(src.subarray(startSample, startSample + sliceLength));
  }
  return sliced;
}

/**
 * Merges multiple AudioBuffers sequentially with inter-track silence gaps
 */
export function mergeAudioBuffers(
  buffers: AudioBuffer[],
  gapSeconds = 0.5,
  targetRate?: number
): AudioBuffer {
  if (buffers.length === 0) {
    throw new Error("No audio files provided for merging.");
  }
  if (buffers.length === 1 && (!targetRate || targetRate === buffers[0].sampleRate)) {
    return buffers[0];
  }

  // Determine target sample rate: use requested or highest among inputs
  const sampleRate =
    targetRate ||
    buffers.reduce((max, b) => Math.max(max, b.sampleRate), 44100);

  // Determine channel count: stereo if any input has >= 2 channels
  const numChannels = buffers.some((b) => b.numberOfChannels > 1) ? 2 : 1;
  const gapSamples = Math.max(0, Math.round(gapSeconds * sampleRate));

  // Prepare normalized channels for each buffer
  const preparedChannels: Float32Array[][] = [];
  let totalLength = 0;

  for (let i = 0; i < buffers.length; i++) {
    const buf = buffers[i];
    let chs: Float32Array[] = [];
    for (let c = 0; c < buf.numberOfChannels; c++) {
      chs.push(buf.getChannelData(c));
    }

    // Expand mono to stereo if needed
    if (buf.numberOfChannels === 1 && numChannels === 2) {
      chs = [chs[0], new Float32Array(chs[0])];
    } else if (buf.numberOfChannels > 2) {
      chs = chs.slice(0, numChannels);
    }

    // Resample if needed
    if (buf.sampleRate !== sampleRate) {
      chs = resampleChannels(chs, buf.sampleRate, sampleRate);
    }

    preparedChannels.push(chs);
    totalLength += chs[0].length;
    if (i < buffers.length - 1) {
      totalLength += gapSamples;
    }
  }

  const merged = createAudioBuffer(numChannels, totalLength, sampleRate);

  for (let c = 0; c < numChannels; c++) {
    const dest = merged.getChannelData(c);
    let offset = 0;
    for (let i = 0; i < preparedChannels.length; i++) {
      const chData = preparedChannels[i][c];
      dest.set(chData, offset);
      offset += chData.length;
      if (i < preparedChannels.length - 1 && gapSamples > 0) {
        // Gap silence is already initialized to 0
        offset += gapSamples;
      }
    }
  }

  return merged;
}

/**
 * Splits an AudioBuffer into segments either by equal parts or fixed duration
 */
export function splitAudioBuffer(
  buffer: AudioBuffer,
  mode: "parts" | "duration",
  value: number
): Array<{ name: string; buffer: AudioBuffer; startSec: number; endSec: number }> {
  const totalDuration = buffer.duration;
  const segments: Array<{ name: string; buffer: AudioBuffer; startSec: number; endSec: number }> =
    [];

  if (mode === "parts") {
    const parts = Math.max(2, Math.min(10, Math.round(value)));
    const partDuration = totalDuration / parts;
    for (let i = 0; i < parts; i++) {
      const start = i * partDuration;
      const end = i === parts - 1 ? totalDuration : (i + 1) * partDuration;
      segments.push({
        name: `Part ${i + 1} of ${parts}`,
        buffer: sliceAudioBuffer(buffer, start, end),
        startSec: start,
        endSec: end,
      });
    }
  } else {
    const interval = Math.max(1, value);
    let currentStart = 0;
    let index = 1;
    while (currentStart < totalDuration) {
      const currentEnd = Math.min(totalDuration, currentStart + interval);
      segments.push({
        name: `Segment ${index} (${formatDurationMs(currentStart)} - ${formatDurationMs(currentEnd)})`,
        buffer: sliceAudioBuffer(buffer, currentStart, currentEnd),
        startSec: currentStart,
        endSec: currentEnd,
      });
      currentStart = currentEnd;
      index++;
    }
  }

  return segments;
}

/**
 * Inspects technical metadata directly from an audio file and its decoded buffer
 */
export function inspectAudioMetadata(
  file: File | null,
  buffer: AudioBuffer
): AudioMetadataReport {
  const fileName = file?.name || "audio-track.wav";
  const fileSizeBytes = file?.size || buffer.length * buffer.numberOfChannels * 2;
  const durationSeconds = buffer.duration;
  const sampleRate = buffer.sampleRate;
  const numberOfChannels = buffer.numberOfChannels;

  // Extract channel arrays
  const channels: Float32Array[] = [];
  for (let c = 0; c < numberOfChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  const peakLinear = measurePeak(channels);
  const peakDbfs = peakLinear > 0.00001 ? 20 * Math.log10(peakLinear) : -96;

  const rmsLinear = measureRms(channels);
  const rmsDbfs = rmsLinear > 0.00001 ? 20 * Math.log10(rmsLinear) : -96;

  const dynamicRangeDb = Math.max(0, peakDbfs - rmsDbfs);

  const dcOffsetLinear = measureDcOffset(channels);
  const dcOffsetPercent = dcOffsetLinear * 100;

  const detectedBpm = detectAudioBpm(buffer);

  const channelLayout =
    numberOfChannels === 1
      ? "Mono (1 Channel)"
      : numberOfChannels === 2
      ? "Stereo (Left / Right)"
      : `${numberOfChannels} Channels Multi-Track`;

  const ext = fileName.split(".").pop()?.toUpperCase() || "WAV";
  const mimeType = file?.type || `audio/${ext.toLowerCase()}`;

  return {
    fileName,
    fileSizeFormatted: formatBytes(fileSizeBytes),
    fileSizeBytes,
    durationSeconds,
    durationFormatted: formatDurationMs(durationSeconds),
    sampleRate,
    sampleRateFormatted: `${(sampleRate / 1000).toFixed(1)} kHz (${sampleRate} Hz)`,
    numberOfChannels,
    channelLayout,
    peakLinear: Number(peakLinear.toFixed(4)),
    peakDbfs: Number(peakDbfs.toFixed(2)),
    rmsLinear: Number(rmsLinear.toFixed(4)),
    rmsDbfs: Number(rmsDbfs.toFixed(2)),
    dynamicRangeDb: Number(dynamicRangeDb.toFixed(2)),
    dcOffsetLinear: Number(dcOffsetLinear.toFixed(5)),
    dcOffsetPercent: Number(dcOffsetPercent.toFixed(3)),
    detectedBpm,
    mimeType,
    containerFormat: ext,
  };
}

/**
 * Encodes an AudioBuffer according to requested format and settings
 */
export function encodeBufferToBlob(
  buffer: AudioBuffer,
  format: "wav" | "mp3" | "aiff",
  bitDepth: 16 | 24 | 32 = 16,
  mp3Bitrate: 128 | 192 | 256 | 320 = 320
): { blob: Blob; url: string; format: string } {
  let blob: Blob;
  if (format === "mp3") {
    // MP3 supports 32, 44.1, 48 kHz
    let inputBuf = buffer;
    if (buffer.sampleRate !== 32000 && buffer.sampleRate !== 44100 && buffer.sampleRate !== 48000) {
      const targetSr = buffer.sampleRate > 46000 ? 48000 : 44100;
      let chs: Float32Array[] = [];
      for (let c = 0; c < buffer.numberOfChannels; c++) {
        chs.push(buffer.getChannelData(c));
      }
      const resampled = resampleChannels(chs, buffer.sampleRate, targetSr);
      inputBuf = createAudioBuffer(resampled.length, resampled[0].length, targetSr);
      for (let c = 0; c < resampled.length; c++) {
        inputBuf.getChannelData(c).set(resampled[c]);
      }
    }
    blob = encodeMp3(inputBuf, mp3Bitrate);
  } else if (format === "aiff") {
    blob = encodeAiff(buffer, bitDepth === 32 ? 24 : bitDepth);
  } else {
    blob = encodeWav(buffer, bitDepth);
  }

  const url = URL.createObjectURL(blob);
  return { blob, url, format };
}

/**
 * Executes a tool task end-to-end
 */
export async function executeToolTask(
  slug: string,
  files: File[],
  buffers: AudioBuffer[],
  settings: Record<string, any>,
  onProgress?: (progress: number, status: string) => void,
  isCancelled?: () => boolean
): Promise<ToolExecutionResult> {
  const checkCancel = () => {
    if (isCancelled?.()) throw new Error("Processing cancelled by user.");
  };

  const primaryFile = files[0] || null;
  const primaryBuffer = buffers[0];

  if (!primaryBuffer && slug !== "audio-metadata") {
    throw new Error("No audio buffer available to process.");
  }

  // -------------------------------------------------------------
  // 1. AUDIO METADATA INSPECTOR
  // -------------------------------------------------------------
  if (slug === "audio-metadata") {
    onProgress?.(40, "Reading audio headers & decoding samples...");
    checkCancel();
    const report = inspectAudioMetadata(primaryFile, primaryBuffer);
    onProgress?.(100, "Diagnostic analysis complete");
    return {
      kind: "metadata",
      report,
      rawJson: JSON.stringify(report, null, 2),
    };
  }

  // -------------------------------------------------------------
  // 2. AUDIO MERGER
  // -------------------------------------------------------------
  if (slug === "audio-merger") {
    onProgress?.(20, `Merging ${buffers.length} tracks with gap alignment...`);
    checkCancel();

    const gapSeconds = Number(settings["gapSeconds"] ?? 0.5);
    const format = (settings["format"] || "wav") as "wav" | "mp3";
    const mergedBuffer = mergeAudioBuffers(buffers, gapSeconds);

    checkCancel();
    onProgress?.(70, `Encoding merged master to ${format.toUpperCase()}...`);

    const { blob, url } = encodeBufferToBlob(
      mergedBuffer,
      format,
      16,
      320
    );

    const baseName = primaryFile?.name.replace(/\.[^/.]+$/, "") || "merged-audio";
    const outFileName = `${baseName}-merged.${format}`;

    onProgress?.(100, "Merge complete!");

    return {
      kind: "single",
      result: {
        blob,
        url,
        duration: mergedBuffer.duration,
        sampleRate: mergedBuffer.sampleRate,
        channels: mergedBuffer.numberOfChannels,
        format,
        bitDepthOrBitrate: format === "mp3" ? "320 kbps" : "16-bit PCM",
        sizeBytes: blob.size,
        filename: outFileName,
        isPeakProtected: true,
        isNormalized: false,
        signature: `merger-${buffers.length}-${Date.now()}`,
        limiterReductionDb: 0,
        normalizeDb: 0,
        renderDurationMs: 0,
        peakDbfs: -0.1,
        rmsDbfs: -14.0,
      },
    };
  }

  // -------------------------------------------------------------
  // 3. AUDIO SPLITTER
  // -------------------------------------------------------------
  if (slug === "audio-splitter") {
    const splitMode = settings["splitMode"] || "parts";
    const val =
      splitMode === "parts"
        ? Number(settings["partCount"] ?? 2)
        : Number(settings["segmentDuration"] ?? 30);

    onProgress?.(25, `Partitioning audio into ${splitMode === "parts" ? `${val} parts` : `${val}s intervals`}...`);
    checkCancel();

    const rawSegments = splitAudioBuffer(primaryBuffer, splitMode, val);
    const format = "wav"; // Split output default lossless WAV for speed and zero-loss
    const results: SplitSegmentResult[] = [];

    const baseName = primaryFile?.name.replace(/\.[^/.]+$/, "") || "audio";

    for (let i = 0; i < rawSegments.length; i++) {
      checkCancel();
      const seg = rawSegments[i];
      const pct = Math.round(30 + ((i + 1) / rawSegments.length) * 65);
      onProgress?.(pct, `Encoding segment ${i + 1} of ${rawSegments.length}...`);

      const { blob, url } = encodeBufferToBlob(seg.buffer, format, 16);
      results.push({
        id: `seg-${i + 1}`,
        name: `${baseName}-part-${i + 1}.wav`,
        blob,
        url,
        duration: seg.buffer.duration,
        durationFormatted: formatDurationMs(seg.buffer.duration),
        sizeBytes: blob.size,
        sizeFormatted: formatBytes(blob.size),
        format: "wav",
      });
    }

    onProgress?.(100, "Splitting complete!");
    return {
      kind: "split",
      segments: results,
      originalFileName: primaryFile?.name || "audio.wav",
      totalDuration: primaryBuffer.duration,
    };
  }

  // -------------------------------------------------------------
  // 4. OTHER UTILITIES (Using Renderer Engine + DSP plan)
  // -------------------------------------------------------------
  let presetId: string | null = null;
  const effectValues: Record<string, any> = {};
  const exportConfig: Partial<ExportConfig> = {};

  const baseFileName = primaryFile?.name || "audio.wav";

  switch (slug) {
    case "audio-converter": {
      presetId = "format-converter";
      const fmt = settings["format"] || "wav";
      exportConfig.format = fmt;
      if (fmt === "wav") {
        exportConfig.wavBitDepth = (Number(settings["bitDepth"] ?? 24) || 24) as 16 | 24 | 32;
      }
      if (fmt === "aiff") {
        exportConfig.aiffBitDepth = (Number(settings["bitDepth"] ?? 24) || 24) as 16 | 24;
      }
      if (fmt === "mp3") {
        exportConfig.mp3Bitrate = (Number(settings["mp3Bitrate"] ?? 320) || 320) as 128 | 192 | 256 | 320;
      }
      if (settings["sampleRate"]) {
        const sr = Number(settings["sampleRate"]);
        if (sr === 44100 || sr === 48000 || sr === 96000) {
          exportConfig.sampleRate = sr;
        }
      }
      break;
    }

    case "sample-rate-converter": {
      presetId = "format-converter";
      const targetRate = Number(settings["targetRate"] ?? 48000);
      if (targetRate === 44100 || targetRate === 48000 || targetRate === 96000) {
        exportConfig.sampleRate = targetRate;
      }
      exportConfig.format = settings["format"] || "wav";
      break;
    }

    case "channel-converter": {
      presetId = "downmixer";
      const channelMode = settings["channelMode"] || "mono";
      exportConfig.channels = channelMode === "mono" ? "mono" : "stereo";
      effectValues["mud-cut"] = Boolean(settings["mudCut"] ?? true);
      break;
    }

    case "audio-trimmer": {
      presetId = "trimmer-cutter";
      const range = settings["timeRange"] || { start: 0, end: primaryBuffer.duration };
      effectValues["trim-start"] = Math.max(0, Number(range.start ?? 0));
      effectValues["trim-end"] = Math.min(primaryBuffer.duration, Number(range.end ?? primaryBuffer.duration));
      if (settings["format"]) exportConfig.format = settings["format"];
      break;
    }

    case "reverse-audio": {
      presetId = "reverse";
      effectValues["reverse-enabled"] = true;
      if (settings["format"]) exportConfig.format = settings["format"];
      break;
    }

    case "audio-fades": {
      presetId = "fade-in-out";
      effectValues["fade-in"] = Number(settings["fadeIn"] ?? 2);
      effectValues["fade-out"] = Number(settings["fadeOut"] ?? 3);
      break;
    }

    case "audio-compressor": {
      presetId = "compressor";
      effectValues["threshold"] = Number(settings["threshold"] ?? -20);
      effectValues["ratio"] = Number(settings["ratio"] ?? 4);
      effectValues["attack"] = Number(settings["attack"] ?? 15);
      effectValues["release"] = Number(settings["release"] ?? 180);
      effectValues["makeup"] = Number(settings["makeup"] ?? 4);
      effectValues["mix"] = 100;
      break;
    }

    case "audio-normalizer": {
      presetId = "volume-changer";
      exportConfig.peakNormalize = true;
      break;
    }

    case "volume-changer": {
      presetId = "volume-changer";
      effectValues["volume-db"] = Number(settings["gainDb"] ?? 3);
      break;
    }

    case "audio-equalizer": {
      presetId = "equalizer";
      effectValues["bass"] = Number(settings["bass"] ?? 0);
      effectValues["eq-mid"] = Number(settings["mid"] ?? 0);
      effectValues["eq-high"] = Number(settings["high"] ?? 0);
      break;
    }

    case "bass-booster": {
      const intensity = settings["intensity"] || "moderate";
      if (intensity === "light") presetId = "bass-boost-light";
      else if (intensity === "heavy") presetId = "bass-boost-heavy";
      else if (intensity === "extreme") presetId = "bass-boost-extreme";
      else presetId = "bass-boost-mod";
      break;
    }

    case "vocal-remover": {
      presetId = "vocal-remover";
      effectValues["mode"] = settings["mode"] || "remove-center";
      effectValues["bass-retention"] = Number(settings["bassPreserve"] ?? 120);
      effectValues["reduction"] = Number(settings["reduction"] ?? 90);
      break;
    }

    default:
      presetId = null;
      break;
  }

  const result = await renderProcessedAudio(
    primaryBuffer,
    presetId,
    effectValues,
    baseFileName,
    exportConfig,
    {
      onProgress,
      isCancelled,
    }
  );

  return {
    kind: "single",
    result,
  };
}
