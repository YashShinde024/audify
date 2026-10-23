/**
 * Audify Audio Encoders Suite
 * Multi-format binary serialization for:
 * - WAV (16-bit PCM, 24-bit PCM, 32-bit Float)
 * - AIFF (16-bit, 24-bit Big-Endian PCM)
 * - MP3 (128, 192, 256, 320 kbps via lamejs)
 * - File size estimation utility
 */

import lamejs from "lamejs";
import MPEGMode from "lamejs/src/js/MPEGMode.js";
import Lame from "lamejs/src/js/Lame.js";
import BitStream from "lamejs/src/js/BitStream.js";
import { float80Bytes } from "./dsp-utils";

/**
 * lamejs 1.2.1 compiles its sources into files that reference `MPEGMode`,
 * `Lame` and `BitStream` as bare identifiers (leftovers from the originally
 * concatenated browser bundle). Under modern bundlers those names are
 * undefined, so `new lamejs.Mp3Encoder(...)` would throw
 * "MPEGMode is not defined". Re-exposing them on the global object fixes this.
 */
if (typeof globalThis !== "undefined") {
  const g = globalThis as Record<string, unknown>;
  g.MPEGMode = g.MPEGMode ?? MPEGMode;
  g.Lame = g.Lame ?? Lame;
  g.BitStream = g.BitStream ?? BitStream;
}

/**
 * Encodes an AudioBuffer into a WAV Blob with 16-bit, 24-bit integer, or 32-bit float PCM.
 */
export function encodeWav(buffer: AudioBuffer, bitDepth: 16 | 24 | 32 = 16): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = bitDepth / 8;
  const isFloat = bitDepth === 32;
  const formatTag = isFloat ? 3 : 1;

  const dataSize = numSamples * numChannels * bytesPerSample;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;

  const arrayBuffer = new ArrayBuffer(totalSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "RIFF");
  view.setUint32(4, 36 + dataSize, true);
  writeString(8, "WAVE");

  writeString(12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, formatTag, true);
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * numChannels * bytesPerSample, true);
  view.setUint16(32, numChannels * bytesPerSample, true);
  view.setUint16(34, bitDepth, true);

  writeString(36, "data");
  view.setUint32(40, dataSize, true);

  let offset = 44;
  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  if (bitDepth === 16) {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
        view.setInt16(offset, intSample, true);
        offset += 2;
      }
    }
  } else if (bitDepth === 24) {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x800000 : s * 0x7fffff;
        const intVal = Math.floor(intSample);
        view.setUint8(offset, intVal & 0xff);
        view.setUint8(offset + 1, (intVal >> 8) & 0xff);
        view.setUint8(offset + 2, (intVal >> 16) & 0xff);
        offset += 3;
      }
    }
  } else {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        view.setFloat32(offset, channels[c][i], true);
        offset += 4;
      }
    }
  }

  return new Blob([arrayBuffer], { type: "audio/wav" });
}

/**
 * Encodes an AudioBuffer into an AIFF Blob (Apple Big-Endian PCM).
 */
export function encodeAiff(buffer: AudioBuffer, bitDepth: 16 | 24 = 16): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const numSamples = buffer.length;
  const bytesPerSample = bitDepth / 8;

  const ssndDataSize = numSamples * numChannels * bytesPerSample;
  const commChunkSize = 18;
  const ssndChunkSize = 8 + ssndDataSize + (ssndDataSize % 2);
  const formSize = 4 + (8 + commChunkSize) + (8 + ssndChunkSize);

  const arrayBuffer = new ArrayBuffer(8 + formSize);
  const view = new DataView(arrayBuffer);

  function writeString(offset: number, str: string) {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  }

  writeString(0, "FORM");
  view.setUint32(4, formSize, false);
  writeString(8, "AIFF");

  let offset = 12;
  writeString(offset, "COMM");
  view.setUint32(offset + 4, commChunkSize, false);
  view.setInt16(offset + 8, numChannels, false);
  view.setUint32(offset + 10, numSamples, false);
  view.setInt16(offset + 14, bitDepth, false);

  // 80-bit IEEE 754 extended float sample rate (handles 96 kHz correctly).
  const rateBytes = float80Bytes(sampleRate);
  for (let i = 0; i < rateBytes.length; i++) {
    view.setUint8(offset + 16 + i, rateBytes[i]);
  }

  offset += 8 + commChunkSize;

  writeString(offset, "SSND");
  view.setUint32(offset + 4, ssndChunkSize, false);
  view.setUint32(offset + 8, 0, false);
  view.setUint32(offset + 12, 0, false);

  offset += 16;

  const channels: Float32Array[] = [];
  for (let c = 0; c < numChannels; c++) {
    channels.push(buffer.getChannelData(c));
  }

  if (bitDepth === 16) {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x8000 : s * 0x7fff;
        view.setInt16(offset, intSample, false);
        offset += 2;
      }
    }
  } else {
    for (let i = 0; i < numSamples; i++) {
      for (let c = 0; c < numChannels; c++) {
        const s = Math.max(-1, Math.min(1, channels[c][i]));
        const intSample = s < 0 ? s * 0x800000 : s * 0x7fffff;
        const intVal = Math.floor(intSample);
        view.setUint8(offset, (intVal >> 16) & 0xff);
        view.setUint8(offset + 1, (intVal >> 8) & 0xff);
        view.setUint8(offset + 2, intVal & 0xff);
        offset += 3;
      }
    }
  }

  return new Blob([arrayBuffer], { type: "audio/aiff" });
}

/**
 * Encodes an AudioBuffer into an MP3 Blob using lamejs.
 */
export function encodeMp3(buffer: AudioBuffer, kbps: 128 | 192 | 256 | 320 = 320): Blob {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;

  if (sampleRate !== 32000 && sampleRate !== 44100 && sampleRate !== 48000) {
    throw new Error(
      `MP3 supports 32 kHz, 44.1 kHz and 48 kHz only (${Math.round(sampleRate / 1000)} kHz requested). Choose WAV or AIFF instead.`
    );
  }

  const mp3encoder = new lamejs.Mp3Encoder(numChannels, sampleRate, kbps);

  const leftChannel = buffer.getChannelData(0);
  const rightChannel = numChannels > 1 ? buffer.getChannelData(1) : leftChannel;
  const numSamples = leftChannel.length;

  const leftInt16 = new Int16Array(numSamples);
  const rightInt16 = new Int16Array(numSamples);

  for (let i = 0; i < numSamples; i++) {
    const sl = Math.max(-1, Math.min(1, leftChannel[i]));
    leftInt16[i] = sl < 0 ? sl * 0x8000 : sl * 0x7fff;

    const sr = Math.max(-1, Math.min(1, rightChannel[i]));
    rightInt16[i] = sr < 0 ? sr * 0x8000 : sr * 0x7fff;
  }

  const mp3Data: Uint8Array[] = [];
  const chunkSize = 1152;

  for (let i = 0; i < numSamples; i += chunkSize) {
    const leftChunk = leftInt16.subarray(i, i + chunkSize);
    const rightChunk = rightInt16.subarray(i, i + chunkSize);

    let mp3buf: Int8Array;
    if (numChannels === 1) {
      mp3buf = mp3encoder.encodeBuffer(leftChunk);
    } else {
      mp3buf = mp3encoder.encodeBuffer(leftChunk, rightChunk);
    }

    if (mp3buf.length > 0) {
      mp3Data.push(new Uint8Array(mp3buf));
    }
  }

  const endBuf = mp3encoder.flush();
  if (endBuf.length > 0) {
    mp3Data.push(new Uint8Array(endBuf));
  }

  return new Blob(mp3Data as BlobPart[], { type: "audio/mp3" });
}

/**
 * Calculates estimated file size based on audio duration and export settings.
 */
export function estimateExportFileSize(
  durationSeconds: number,
  format: string,
  bitDepth: number,
  mp3Bitrate: number,
  sampleRate: number,
  channels: "stereo" | "mono"
): string {
  if (!durationSeconds || durationSeconds <= 0) return "—";

  const numChannels = channels === "mono" ? 1 : 2;
  const sr = sampleRate > 0 ? sampleRate : 44100;

  let bytes = 0;
  if (format === "mp3") {
    bytes = ((mp3Bitrate * 1000) / 8) * durationSeconds;
  } else if (format === "opus") {
    bytes = ((128 * 1000) / 8) * durationSeconds;
  } else if (format === "aiff") {
    bytes = sr * numChannels * (bitDepth / 8) * durationSeconds + 54;
  } else {
    bytes = sr * numChannels * (bitDepth / 8) * durationSeconds + 44;
  }

  if (bytes < 1024 * 1024) {
    return `~${(bytes / 1024).toFixed(1)} KB`;
  }
  return `~${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
