/**
 * Pure preset → DSP resolution.
 *
 * `resolveProcessing()` turns a preset id + the current control values into a
 * complete description of what the engine should do. Keeping this pure means:
 * - every exposed slider can be proven to change the render plan (tests),
 * - preset switching can be checked for stale values,
 * - the Web Audio graph builder contains no hidden preset conditionals.
 *
 * Explicit control values always win. A slider at 0 is a real value, never a
 * fallback. Missing controls fall back to that preset's declared defaults.
 */

import { getPresetById } from "@/config/presets";
import type { EffectValues } from "@/types/preset";
import type { ExportConfig } from "@/types/export";

export const MAX_PLAYBACK_RATE = 2.5;
export const MIN_PLAYBACK_RATE = 0.25;
/** Hard ceiling for a single offline render, to keep memory bounded. */
export const MAX_OUTPUT_SECONDS = 600;

export type FilterKind = "highpass" | "lowpass" | "peaking" | "lowshelf" | "highshelf";

export interface FilterSpec {
  type: FilterKind;
  frequency: number;
  q?: number;
  gain?: number;
}

export interface ReverbSpec {
  /** 0..1 linear wet amount. 0 disables the branch entirely. */
  wet: number;
  decaySeconds: number;
  /** 0 = bright/open, 1 = heavily damped. */
  damping: number;
  preDelaySeconds: number;
}

export interface EchoSpec {
  /** 0..1 linear wet amount. */
  wet: number;
  timeSeconds: number;
  /** Feedback gain, always < 1 so the loop decays. */
  feedback: number;
  pingPong: boolean;
  /** Extra render time needed for the repeats to decay. */
  tailSeconds: number;
}

export type PanMode = "static" | "orbit" | "auto";

export interface PanSpec {
  mode: PanMode;
  /** Static balance, -1 (left) .. +1 (right). */
  value: number;
  cycleSeconds: number;
}

export interface TrimSpec {
  start: number;
  /** null = "to the end of the source". */
  end: number | null;
}

export interface ProcessingPlan {
  presetId: string | null;
  playbackRate: number;
  /** True when pitch transposition is achieved by varispeed (tempo changes too). */
  pitchChangesTempo: boolean;
  reverse: boolean;
  trim: TrimSpec | null;
  filters: FilterSpec[];
  /** 0..100 waveshaper drive. */
  saturation: number;
  outputGainDb: number;
  reverb: ReverbSpec | null;
  echo: EchoSpec | null;
  width: number | null;
  pan: PanSpec | null;
  /** Downmix the render bus to a single channel. */
  mono: boolean;
  /** The effect needs two channels even when the source is mono. */
  needsStereo: boolean;
  tailSeconds: number;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function readNumber(values: EffectValues, id: string, fallback: number): number {
  const raw = values[id];
  return typeof raw === "number" && Number.isFinite(raw) ? raw : fallback;
}

function readBool(values: EffectValues, id: string, fallback: boolean): boolean {
  const raw = values[id];
  return typeof raw === "boolean" ? raw : fallback;
}

function defaultNumber(presetId: string | null, id: string, fallback = 0): number {
  const value = getPresetById(presetId ?? "")?.defaults[id];
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function reverb(
  wetPercent: number,
  decaySeconds: number,
  damping: number,
  preDelaySeconds: number
): ReverbSpec | null {
  const wet = clamp(wetPercent / 100, 0, 1);
  if (wet <= 0) return null;
  return {
    wet,
    decaySeconds: clamp(decaySeconds, 0.2, 12),
    damping: clamp(damping, 0, 1),
    preDelaySeconds: clamp(preDelaySeconds, 0, 0.2),
  };
}

/**
 * A ping-pong echo's audible tail: how long until the feedback loop is 60 dB down.
 */
export function computeEchoTailSeconds(timeSeconds: number, feedback: number): number {
  if (timeSeconds <= 0) return 0;
  const fb = clamp(feedback, 0, 0.85);
  if (fb <= 0.001) return timeSeconds;
  const repeats = Math.ceil(Math.log(0.001) / Math.log(fb));
  return clamp(timeSeconds * repeats, timeSeconds, 12);
}

export function computePlaybackRate(speedPercent: number, semitones: number, tuningRatio = 1): number {
  const rate = (speedPercent / 100) * Math.pow(2, semitones / 12) * tuningRatio;
  return clamp(rate, MIN_PLAYBACK_RATE, MAX_PLAYBACK_RATE);
}

/** Duration of the rendered file, before the hard memory ceiling. */
export function computeOutputDuration(plan: ProcessingPlan, sourceSeconds: number): number {
  const start = plan.trim ? clamp(plan.trim.start, 0, sourceSeconds) : 0;
  const end = plan.trim?.end == null ? sourceSeconds : clamp(plan.trim.end, start, sourceSeconds);
  const trimmed = Math.max(0.02, end - start);
  return trimmed / plan.playbackRate + plan.tailSeconds;
}

export function resolveProcessing(presetId: string | null, values: EffectValues): ProcessingPlan {
  const num = (id: string, fallback = 0) => readNumber(values, id, defaultNumber(presetId, id, fallback));
  const bool = (id: string, fallback: boolean) => readBool(values, id, fallback);

  const speed = num("speed", 100);
  const pitch = num("pitch", 0);

  // 432 Hz conversion: A4 440 Hz → 432 Hz is a fixed ratio, achieved by varispeed
  // (pitch and tempo both drop by ~1.8%). The preset's toggle is authoritative.
  let tuningRatio = 1;
  if (presetId === "pitch-432hz") {
    tuningRatio = bool("432hz-enabled", true) ? 432 / 440 : 1;
  }

  const playbackRate = computePlaybackRate(speed, pitch, tuningRatio);
  const reverse = bool("reverse-enabled", presetId === "reverse");

  const hasTrim =
    typeof values["trim-start"] === "number" || typeof values["trim-end"] === "number";
  const trim: TrimSpec | null = hasTrim
    ? {
        start: Math.max(0, num("trim-start", 0)),
        end: typeof values["trim-end"] === "number" ? Math.max(0, values["trim-end"]) : null,
      }
    : null;

  const filters: FilterSpec[] = [];
  let saturation = 0;
  let outputGainDb = 0;
  let reverbSpec: ReverbSpec | null = null;
  let echoSpec: EchoSpec | null = null;
  let width: number | null = null;
  let pan: PanSpec | null = null;

  const wet = num("reverb", 0);

  switch (presetId) {
    case "bathroom-reverb":
      filters.push({ type: "highpass", frequency: 120, q: 0.707 });
      reverbSpec = reverb(wet, 0.65, 0.75, 0.004);
      break;
    case "small-room-reverb":
      filters.push({ type: "highpass", frequency: 100, q: 0.707 });
      reverbSpec = reverb(wet, 1.1, 0.55, 0.008);
      break;
    case "medium-room-reverb":
      reverbSpec = reverb(wet, 2.0, 0.45, 0.012);
      break;
    case "large-room-reverb":
      reverbSpec = reverb(wet, 3.4, 0.35, 0.018);
      break;
    case "church-hall-reverb":
      reverbSpec = reverb(wet, 4.8, 0.3, 0.028);
      break;
    case "cathedral-reverb": {
      const decay = 4.8 + (num("size", 95) / 100) * 1.7;
      reverbSpec = reverb(wet, decay, 0.25, 0.035);
      break;
    }
    case "vocal-reverb":
      reverbSpec = reverb(wet, 1.8, 0.65, 0.035);
      break;
    case "slapback-echo":
      if (num("echo", 35) > 0) {
        echoSpec = {
          wet: clamp(num("echo", 35) / 100, 0, 1),
          timeSeconds: 0.115,
          feedback: 0.15,
          pingPong: false,
          tailSeconds: computeEchoTailSeconds(0.115, 0.15),
        };
      }
      break;
    case "echo-chamber": {
      if (num("echo", 25) > 0) {
        const feedback = clamp(0.2 + (num("size", 50) / 100) * 0.55, 0.05, 0.8);
        const timeSeconds = 0.28;
        echoSpec = {
          wet: clamp(num("echo", 25) / 100, 0, 1),
          timeSeconds,
          feedback,
          pingPong: true,
          tailSeconds: computeEchoTailSeconds(timeSeconds * 2, feedback),
        };
      }
      reverbSpec = reverb(wet, 2.2, 0.3, 0.02);
      break;
    }
    case "slowed-reverb": {
      const decay = 1.2 + (num("size", 75) / 100) * 4.0;
      reverbSpec = reverb(wet, decay, 0.3, 0.015);
      break;
    }
    case "8d-audio": {
      const rotation = clamp(num("rotation", 50), 0, 100);
      reverbSpec = reverb(wet, 2.6, 0.5, 0.02);
      pan = {
        mode: "orbit",
        value: 0,
        cycleSeconds: clamp(14 - (rotation / 100) * 10, 3, 14),
      };
      break;
    }
    case "auto-panner": {
      const speedPercent = clamp(num("pan-speed", 50), 0, 100);
      pan = {
        mode: "auto",
        value: 0,
        cycleSeconds: clamp(6 - (speedPercent / 100) * 5, 1, 6),
      };
      break;
    }
    case "stereo-panner": {
      const balance = clamp(num("rotation", 50), 10, 100);
      pan = { mode: "static", value: clamp((balance - 50) / 50, -1, 1), cycleSeconds: 0 };
      break;
    }
    case "stereo-widening":
      width = clamp(num("width", 65) / 50, 0.2, 2);
      break;

    case "bass-boost-light":
      filters.push({ type: "lowshelf", frequency: 95, gain: num("bass", 3.5) });
      break;
    case "bass-boost-mod":
      filters.push({ type: "lowshelf", frequency: 85, gain: num("bass", 7) });
      break;
    case "bass-boost-heavy":
      filters.push({ type: "lowshelf", frequency: 75, gain: num("bass", 10.5) });
      break;
    case "bass-boost-extreme":
      filters.push({ type: "lowshelf", frequency: 65, gain: num("bass", 15) });
      break;
    case "equalizer": {
      const low = num("bass", 0);
      const mid = num("eq-mid", 0);
      const high = num("eq-high", 0);
      if (low !== 0) filters.push({ type: "lowshelf", frequency: 120, gain: low });
      if (mid !== 0) filters.push({ type: "peaking", frequency: 2400, q: 1.0, gain: mid });
      if (high !== 0) filters.push({ type: "highshelf", frequency: 9000, gain: high });
      break;
    }
    case "treble-air":
      filters.push({ type: "highshelf", frequency: 9000, gain: num("treble", 5) });
      break;
    case "mid-scoop": {
      const cut = clamp(num("cut", -3), -6, 0);
      const brightness = clamp(num("brightness", 3), 0, 6);
      if (cut !== 0) filters.push({ type: "peaking", frequency: 350, q: 1.0, gain: cut });
      if (brightness !== 0) filters.push({ type: "highshelf", frequency: 8000, gain: brightness });
      break;
    }
    case "nightcore":
      filters.push({ type: "highshelf", frequency: 10000, gain: num("treble", 4) });
      break;
    case "daycore":
      filters.push({ type: "lowshelf", frequency: 90, gain: num("bass", 4) });
      break;
    case "super-slowed": {
      const warmth = num("warmth", 40);
      if (warmth > 0) {
        filters.push({ type: "lowshelf", frequency: 120, gain: warmth * 0.06 });
        filters.push({ type: "lowpass", frequency: 14000, q: 0.707 });
      }
      break;
    }

    case "vaporwave": {
      const haze = clamp(num("haze", 50), 0, 100);
      if (haze > 0) {
        filters.push({ type: "lowpass", frequency: clamp(18000 - (haze / 100) * 10000, 8000, 18000), q: 0.707 });
      }
      reverbSpec = reverb(wet, 3.6, 0.45, 0.02);
      break;
    }

    case "underwater":
      // Two cascaded 12 dB/oct low-passes = a real 24 dB/oct slope.
      filters.push({ type: "lowpass", frequency: 520, q: 0.707 });
      filters.push({ type: "lowpass", frequency: 520, q: 0.707 });
      filters.push({ type: "lowshelf", frequency: 160, gain: num("bass", 6) });
      reverbSpec = reverb(wet, 2.4, 0.8, 0.02);
      break;
    case "telephone-voice":
      // 450 Hz high-pass + cascaded 3.2 kHz low-pass = telephone band.
      filters.push({ type: "highpass", frequency: 450, q: 0.707 });
      filters.push({ type: "lowpass", frequency: 3200, q: 0.707 });
      filters.push({ type: "lowpass", frequency: 3200, q: 0.707 });
      saturation = num("saturation", 40);
      break;
    case "lofi-tape":
      filters.push({ type: "highshelf", frequency: 6500, gain: num("treble", -3) });
      filters.push({ type: "lowpass", frequency: 9500, q: 0.6 });
      saturation = num("saturation", 50);
      break;

    case "podcast-voice": {
      // Static EQ shaping only — no compressor stage, no spectral noise reduction.
      if (bool("mud-cut", true)) filters.push({ type: "highpass", frequency: 95, q: 0.707 });
      const presence = clamp(num("presence", 3), 0, 6);
      if (presence !== 0) filters.push({ type: "peaking", frequency: 3200, q: 1.0, gain: presence });
      if (bool("smooth", true)) filters.push({ type: "highshelf", frequency: 8000, gain: -2 });
      break;
    }

    case "noise-reducer":
      // This is a rumble filter, not spectral noise reduction. Labelled as such.
      if (bool("mud-cut", true)) filters.push({ type: "highpass", frequency: 115, q: 0.707 });
      break;
    case "vocal-clarity": {
      if (bool("mud-cut", true)) filters.push({ type: "highpass", frequency: 110, q: 0.707 });
      const presence = num("presence", 3.5);
      if (presence !== 0) filters.push({ type: "peaking", frequency: 2600, q: 1.0, gain: presence });
      break;
    }
    case "de-harsh":
      filters.push({ type: "highshelf", frequency: 7000, gain: num("treble", -3.5) });
      break;

    case "volume-changer":
      outputGainDb = num("volume-db", 3);
      break;
    case "bpm-detector":
      break;
    case "format-converter":
      if (bool("mud-cut", false)) filters.push({ type: "highpass", frequency: 80, q: 0.707 });
      break;
    case "downmixer":
      if (bool("mud-cut", false)) filters.push({ type: "lowshelf", frequency: 120, gain: -3.5 });
      break;
    case "mastering-polish":
      filters.push({ type: "lowshelf", frequency: 80, gain: num("bass", 2) });
      filters.push({ type: "peaking", frequency: 1000, q: 0.7, gain: num("presence", 1) });
      filters.push({ type: "highshelf", frequency: 12000, gain: num("treble", 2) });
      break;

    case "ping-pong": {
      const echo = clamp(num("echo", 40) / 100, 0, 1);
      if (echo > 0) {
        const feedback = clamp(0.2 + (num("size", 45) / 100) * 0.55, 0.05, 0.8);
        const timeSeconds = 0.32;
        echoSpec = {
          wet: echo,
          timeSeconds,
          feedback,
          pingPong: true,
          // The feedback loop crosses both delay lines, so one cycle is 2 × time.
          tailSeconds: computeEchoTailSeconds(timeSeconds * 2, feedback),
        };
      }
      break;
    }

    // Speed / tuning / trim / reverse utilities need no timbre filters.
    case "slowed":
    case "sped-up":
    case "pitch-shifter":
    case "tempo-changer":
    case "reverse":
    case "trimmer-cutter":
    case null:
    default:
      break;
  }

  // Any preset that exposes a generic volume control honours it.
  if (presetId !== "volume-changer" && typeof values["volume-db"] === "number") {
    outputGainDb = values["volume-db"];
  }

  const tailSeconds = Math.max(reverbSpec?.decaySeconds ?? 0, echoSpec?.tailSeconds ?? 0);

  return {
    presetId,
    playbackRate,
    // Varispeed: any rate change shifts pitch and tempo together.
    pitchChangesTempo: playbackRate !== 1,
    reverse,
    trim,
    filters,
    saturation: clamp(saturation, 0, 100),
    outputGainDb: clamp(outputGainDb, -24, 18),
    reverb: reverbSpec,
    echo: echoSpec,
    width,
    pan,
    mono: presetId === "downmixer",
    needsStereo: Boolean(pan || width != null || echoSpec?.pingPong),
    tailSeconds,
  };
}

/** Stable description of everything that affects the rendered bytes. */
export function computeRenderSignature(
  presetId: string | null,
  values: EffectValues,
  exportConfig?: Partial<ExportConfig>
): string {
  const plan = resolveProcessing(presetId, values);
  return JSON.stringify({
    plan,
    format: exportConfig?.format ?? "wav",
    wavBitDepth: exportConfig?.wavBitDepth ?? 16,
    aiffBitDepth: exportConfig?.aiffBitDepth ?? 16,
    mp3Bitrate: exportConfig?.mp3Bitrate ?? 320,
    sampleRate: exportConfig?.sampleRate ?? 0,
    channels: exportConfig?.channels ?? "stereo",
    peakProtection: exportConfig?.peakProtection ?? true,
    peakNormalize: exportConfig?.peakNormalize ?? false,
  });
}
