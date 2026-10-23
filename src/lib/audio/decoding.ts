/**
 * Audify Audio Decoding & Lifecycle Management
 * Provides AudioContext initialization and AudioBuffer decoding.
 */

export interface DecodedAudio {
  buffer: AudioBuffer;
  peaks: number[];
  duration: number;
  sampleRate: number;
  numberOfChannels: number;
  detectedBpm?: number;
}

let sharedAudioContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
  if (typeof window === "undefined") {
    throw new Error("Web Audio API is only available in the browser.");
  }
  if (!sharedAudioContext || sharedAudioContext.state === "closed") {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    sharedAudioContext = new AudioContextClass();
  }
  return sharedAudioContext;
}

import { detectAudioBpm } from "./analysis";

/**
 * Decodes an uploaded Audio file into an AudioBuffer and computes genuine amplitude peaks & BPM.
 */
export async function decodeAudioFile(file: File, peakBuckets = 72): Promise<DecodedAudio> {
  const audioCtx = getAudioContext();
  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }

  const arrayBuffer = await file.arrayBuffer();
  const decodedBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));

  // Compute real normalized peaks from channel 0
  const channelData = decodedBuffer.getChannelData(0);
  const totalSamples = channelData.length;
  const bucketSize = Math.max(1, Math.floor(totalSamples / peakBuckets));
  const peaks: number[] = new Array(peakBuckets).fill(0);

  for (let i = 0; i < peakBuckets; i++) {
    const start = i * bucketSize;
    const end = Math.min(start + bucketSize, totalSamples);
    let max = 0;
    for (let j = start; j < end; j++) {
      const abs = Math.abs(channelData[j]);
      if (abs > max) max = abs;
    }
    peaks[i] = max;
  }

  const maxPeak = Math.max(...peaks, 0.001);
  const normalizedPeaks = peaks.map((p) => Math.max(0.08, Math.min(1, p / maxPeak)));

  // Calculate BPM via autocorrelation
  const bpm = detectAudioBpm(decodedBuffer);

  return {
    buffer: decodedBuffer,
    peaks: normalizedPeaks,
    duration: decodedBuffer.duration,
    sampleRate: decodedBuffer.sampleRate,
    numberOfChannels: decodedBuffer.numberOfChannels,
    detectedBpm: bpm,
  };
}
